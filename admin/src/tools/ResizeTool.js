import { closestIndex } from "../utils/array";
import { px } from "../utils/number";
import { Tool, ToolFactory } from "./Tool";

export default class ResizeToolFactory extends ToolFactory {
    constructor() {
        super('resize');
    }
    
    // Bind a new tool to a single element creating a state to support that element only.
    createElementTool(element, target, viewGrid, onChange) { 
        if (!target) {
            return null;
        }

        return new ResizeTool(element, target, viewGrid, onChange);
    }
}

export class ResizeTool extends Tool {
    constructor(element, target, viewGrid, onChange) {
        super(target, viewGrid, onChange);
   
        this._targetHandles = { 
            top: false,
            left: false,
            bottom: false,
            right: false,
            body: false,
        };
    
        this._columnGap = 0;
        this._rowGap = 0;
        this._pointerDownRect = null;
        this._snappedColumnIndex = -1;
        this._snappedRowIndex = -1;
    
        this._leftSnapPositions = [];
        this._rightSnapPositions = [];
        this._topSnapPositions = [];
        this._bottomSnapPositions = [];
    
        this._handleThreshold = 15;
        this._snapThreshold = 20;

        this._element = {
            ...element, 
            top: element.top ?? 0,
            left: element.left ?? 0
        };

        if (!this._viewElement) {
            throw new Error('Cannot find parent view element.');
        }
    }
    
    unbind() {
        super.unbind();
        this._target.style.cursor = null;
    }

    doPointerDown(event) {       
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        const viewStyle = window.getComputedStyle(this._viewElement);
        this._columnGap = parseFloat(viewStyle.columnGap);
        this._rowGap = parseFloat(viewStyle.rowGap);

        const { clientX, clientY } = this.getPointer(event);
        
        this._pointerDownRect = this.getRect(this._target);
        this._grabLocation = { x: clientX - this._pointerDownRect.x, y: clientY - this._pointerDownRect.y };
        this._targetHandles = this.getHandles(clientX, clientY, this._pointerDownRect);
        this._target.classList.add('element--no-transition');

        this.updateSnapPositions();
    }
    
    doPointerMove(event) {
        event.preventDefault();

        this._viewRect = this._viewElement.getBoundingClientRect();

        let { clientX, clientY } = this.getPointer(event);

        if (event.target.hasPointerCapture(event.pointerId)) {      
            this.snapHandles(clientX, clientY);
        } 
        else {
            const { clientX, clientY } = this.getPointer(event);

            const targetRect = this.getRect(this._target);
            const handles = this.getHandles(clientX, clientY, targetRect)
            this.updateHandleType(handles);
        }
    }
    
    doPointerUp(event) {
        this._target.classList.remove('element--no-transition');

        let { clientX, clientY } = this.getPointer(event);
        this.snapHandles(clientX, clientY, this.snapClosest.bind(this));

        const updatedElement = this.updateElementPosition(this._element);
        if (updatedElement) {
            this._onChange(updatedElement);
        }
    }

    doBlur(event) {
        this._target.style.cursor = '';
    }

    doFocus(event) {
        // Not used.
    }

    getHandles(clientX, clientY, targetRect) {
        const handles = {
            top: Math.abs(clientY - targetRect.top) < this._handleThreshold,
            left: Math.abs(clientX - targetRect.left) < this._handleThreshold,
            bottom: Math.abs(clientY - targetRect.bottom) < this._handleThreshold,
            right: Math.abs(clientX - targetRect.right) < this._handleThreshold,
        };

        handles.body = !handles.top && !handles.left && !handles.right && !handles.bottom;

        return handles;
    }

    // Snap to nothing.
    snapNone(clientX, clientY) {
        return { snapX: clientX, snapY: clientY };
    }

    // Snap this point to a row or column if one is within the snap threshold.
    snapClose(clientX, clientY) {
        let { top, left, right, bottom, body } = this._targetHandles;

        if (body) {
            top = true;
            left = true;
        }

        if (top || bottom ) {
            const rows = top ? this._topSnapPositions : this._bottomSnapPositions;

            const rowIndex = rows.findIndex(row => Math.abs(row - clientY) < this._snapThreshold);
            if (rowIndex !== -1) {
                clientY = rows[rowIndex];

                this._snappedRowIndex = rowIndex + (top ? 0 : 1); // To include the zeroth row if bottom handle is active.
            } 
            else {
                this._snappedRowIndex = -1;
            }
        }

        if (left || right ) {
            const columns = left ? this._leftSnapPositions : this._rightSnapPositions;

            const columnIndex = columns.findIndex(column => Math.abs(column - clientX) < this._snapThreshold);
            if (columnIndex !== -1) {
                clientX = columns[columnIndex];

                this._snappedColumnIndex = columnIndex + (left ? 0 : 1); // To include the zeroth column if bottom handle is active.
            }
            else {
                this._snappedColumnIndex = -1;
            }
        }

        return { snapX: clientX, snapY: clientY };
    }

    // Snap this point to the closest column and row regardless of threshold.
    snapClosest(clientX, clientY) {
        let { top, left, right, bottom, body } = this._targetHandles;

        if (body) {
            top = true;
            left = true;
        }

        if (top || bottom ) {
            const rows = top ? this._topSnapPositions : this._bottomSnapPositions;

            const rowIndex = closestIndex(rows, clientY);
            if (rowIndex !== -1) {
                clientY = rows[rowIndex];

                this._snappedRowIndex = rowIndex + (top ? 0 : 1); // To include the zeroth row if bottom handle is active.
            } 
            else {
                this._snappedRowIndex = -1;
            }
        }

        if (left || right ) {
            const columns = left ? this._leftSnapPositions : this._rightSnapPositions;

            const columnIndex = closestIndex(columns, clientX);
            if (columnIndex !== -1) {
                clientX = columns[columnIndex];

                this._snappedColumnIndex = columnIndex + (left ? 0 : 1); // To include the zeroth column if bottom handle is active.
            }
            else {
                this._snappedColumnIndex = -1;
            }
        }

        return { snapX: clientX, snapY: clientY }; 
    }

    snapHandles(clientX, clientY, snap = this.snapNone.bind(this)) {
        const { snapX, snapY } = snap(clientX, clientY);

        if (this._targetHandles.top) {
            this._target.style.top = px(snapY);
            this._target.style.height = px(this._pointerDownRect.bottom - snapY);
        }

        if (this._targetHandles.left) {
            this._target.style.left = px(snapX);
            this._target.style.width = px(this._pointerDownRect.right - snapX);
        }

        if (this._targetHandles.right) {
            this._target.style.width = px(snapX - this._pointerDownRect.left);
        }

        if (this._targetHandles.bottom) {
            this._target.style.height = px(snapY - this._pointerDownRect.top);
        }

        if (this._targetHandles.body) {
            const { snapX, snapY } = snap(clientX - this._grabLocation.x, clientY - this._grabLocation.y, true)

            this._target.style.left = px(snapX);
            this._target.style.top = px(snapY);
        }
    }

    updateSnapPositions() {
        const halfColumnGap = this._columnGap / 2;
        const halfRowGap = this._rowGap / 2;
        this._leftSnapPositions = [-halfColumnGap, ...this._viewGrid.columns].map(position => position + halfColumnGap);
        this._rightSnapPositions = [...this._viewGrid.columns, this._viewRect.width + halfColumnGap].map(position => position - halfColumnGap);;
        this._topSnapPositions = [-halfRowGap, ...this._viewGrid.rows].map(position => position + halfRowGap);;
        this._bottomSnapPositions = [...this._viewGrid.rows, this._viewRect.height + halfRowGap].map(position => position - halfRowGap);;
    }

    updateHandleType({top, left, bottom, right, body}) {
        if ((top && left) || (bottom && right)) {
            this._target.style.cursor = 'nwse-resize';
            return;
        }

        if ((top && right) || (bottom && left)) {
            this._target.style.cursor = 'nesw-resize';
            return;
        }

        if (top || bottom) {
            this._target.style.cursor = 'ns-resize';
            return;
        }

        if (left || right) {
            this._target.style.cursor = 'ew-resize';
            return;
        }

        if (body) {
            this._target.style.cursor = 'move';
            return;
        }

        this._target.style.cursor = 'null';
    }

    updateElementPosition() {
        let position = this._element;

        const bottom = this._element.top + this._element.height;
        const right = this._element.left + this._element.width;

        if (this._targetHandles.top && this._snappedRowIndex >= 0 &&
            position.top !== this._snappedRowIndex &&
            position.height !== bottom - this.snappedRowIndex) {
                
            position = {
                ...position, 
                top: this._snappedRowIndex,
                height: bottom - this._snappedRowIndex,
            };
        }

        if (this._targetHandles.bottom && this._snappedRowIndex >= 0 && 
            position.height !== this._snappedRowIndex - this._element.top) {

            position = {
                ...position, 
                height: this._snappedRowIndex - this._element.top
            };
        }

        if (this._targetHandles.left && this._snappedColumnIndex >= 0 &&
            position.left !== this._snappedColumnIndex &&
            position.width !== right - this._snappedColumnIndex) {

            position = {...position, 
                left: this._snappedColumnIndex, 
                width: right - this._snappedColumnIndex
            };
        }

        if (this._targetHandles.right && this._snappedColumnIndex >= 0 && 
            position.width !== this._snappedColumnIndex - this._element.left) {

            position = {
                ...position, 
                width: this._snappedColumnIndex - this._element.left
            };
        }

        if (this._targetHandles.body && this._snappedRowIndex >= 0 &&
            position.top !== this._snappedRowIndex) {

            position = {...position,
                top: this._snappedRowIndex,
            };
        }

        if (this._targetHandles.body && this._snappedColumnIndex >= 0 &&
            position.left !== this._snappedColumnIndex) {

            position = {...position,
                left: this._snappedColumnIndex,  
            };
        }

        return (position === this._element) ? null : position;
    }
}
