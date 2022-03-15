import { closestIndex } from "../utils/array";
import { px } from "../utils/number";
import Tool from "./Tool";

export default class ResizeTool extends Tool {
    constructor() {
        super();

        this.key = 'resize';
    }

    buildState(element, target, viewGrid, onChange) {
        const toolState = super.buildState(target, viewGrid, onChange);

        if (toolState.targetType !== 'element') {
            return null;
        }
   
        toolState.targetHandles = { 
            top: false,
            left: false,
            bottom: false,
            right: false,
            body: false,
        };
    
        toolState.columnGap = 0;
        toolState.rowGap = 0;
        toolState.pointerDownRect = null;
        toolState.snappedColumnIndex = -1;
        toolState.snappedRowIndex = -1;
    
        toolState.leftSnapPositions = [];
        toolState.rightSnapPositions = [];
        toolState.topSnapPositions = [];
        toolState.bottomSnapPositions = [];
    
        toolState.handleThreshold = 15;
        toolState.snapThreshold = 20;

        toolState.element = {
            ...element, 
            top: element.top ?? 0,
            left: element.left ?? 0
        };

        if (!toolState.viewElement) {
            throw new Error('Cannot find parent view element.');
        }

        return toolState;
    }
    
    unbind(toolState) {
        super.unbind(toolState);
        toolState.target.style.cursor = null;
    }

    doPointerDown(toolState, event) {       
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
        }

        if (toolState.targetType !== 'element') {
            return;
        }

        const viewStyle = window.getComputedStyle(toolState.viewElement);
        toolState.columnGap = parseFloat(viewStyle.columnGap);
        toolState.rowGap = parseFloat(viewStyle.rowGap);

        const { clientX, clientY } = this.getPointer(toolState, event);
        
        toolState.pointerDownRect = this.getRect(toolState, toolState.target);
        toolState.grabLocation = { x: clientX - toolState.pointerDownRect.x, y: clientY - toolState.pointerDownRect.y };
        toolState.targetHandles = this.getHandles(toolState, clientX, clientY, toolState.pointerDownRect);
        toolState.target.classList.add('element--no-transition');

        this.updateSnapPositions(toolState);
    }
    
    doPointerMove(toolState, event) {
        event.preventDefault();

        if (toolState.targetType !== 'element') {
            return;
        }

        toolState.viewRect = toolState.viewElement.getBoundingClientRect();

        let { clientX, clientY } = this.getPointer(toolState, event);

        if (toolState.isPointerDown) {   
            toolState.target.classList.add('element--no-transition');
  
            this.snapHandles(toolState, clientX, clientY);
        } 
        else {
            const { clientX, clientY } = this.getPointer(toolState, event);

            const targetRect = this.getRect(toolState, toolState.target);
            const handles = this.getHandles(toolState, clientX, clientY, targetRect)
            this.updateHandleType(toolState, handles);
        }
    }
    
    doPointerUp(toolState, event) {
        if (toolState.targetType !== 'element') {
            return;
        }

        toolState.target.classList.remove('element--no-transition');

        let { clientX, clientY } = this.getPointer(toolState, event);
        this.snapHandles(toolState, clientX, clientY, (x, y) => this.snapClosest(toolState, x, y));

        const updatedElement = this.updateElementPosition(toolState, toolState.element);
        if (updatedElement) {
            toolState.onChange(updatedElement);
        }
    }

    doBlur(toolState, event) {
        if (toolState.targetType !== 'element') {
            return;
        }
        
        toolState.target.style.cursor = '';
    }

    doFocus(toolState, event) {
        // Not used.
    }

    getHandles(toolState, clientX, clientY, targetRect) {
        const handles = {
            top: Math.abs(clientY - targetRect.top) < toolState.handleThreshold,
            left: Math.abs(clientX - targetRect.left) < toolState.handleThreshold,
            bottom: Math.abs(clientY - targetRect.bottom) < toolState.handleThreshold,
            right: Math.abs(clientX - targetRect.right) < toolState.handleThreshold,
        };

        handles.body = !handles.top && !handles.left && !handles.right && !handles.bottom;

        return handles;
    }

    // Snap to nothing.
    snapNone(toolState, clientX, clientY) {
        return { snapX: clientX, snapY: clientY };
    }

    // Snap this point to a row or column if one is within the snap threshold.
    snapClose(toolState, clientX, clientY) {
        let { top, left, right, bottom, body } = toolState.targetHandles;

        if (body) {
            top = true;
            left = true;
        }

        if (top || bottom ) {
            const rows = top ? toolState.topSnapPositions : toolState.bottomSnapPositions;

            const rowIndex = rows.findIndex(row => Math.abs(row - clientY) < toolState.snapThreshold);
            if (rowIndex !== -1) {
                clientY = rows[rowIndex];

                toolState.snappedRowIndex = rowIndex + (top ? 0 : 1); // To include the zeroth row if bottom handle is active.
            } 
            else {
                toolState.snappedRowIndex = -1;
            }
        }

        if (left || right ) {
            const columns = left ? toolState.leftSnapPositions : toolState.rightSnapPositions;

            const columnIndex = columns.findIndex(column => Math.abs(column - clientX) < toolState.snapThreshold);
            if (columnIndex !== -1) {
                clientX = columns[columnIndex];

                toolState.snappedColumnIndex = columnIndex + (left ? 0 : 1); // To include the zeroth column if bottom handle is active.
            }
            else {
                toolState.snappedColumnIndex = -1;
            }
        }

        return { snapX: clientX, snapY: clientY };
    }

    // Snap this point to the closest column and row regardless of threshold.
    snapClosest(toolState, clientX, clientY) {
        let { top, left, right, bottom, body } = toolState.targetHandles;

        if (body) {
            top = true;
            left = true;
        }

        if (top || bottom ) {
            const rows = top ? toolState.topSnapPositions : toolState.bottomSnapPositions;

            const rowIndex = closestIndex(rows, clientY);
            if (rowIndex !== -1) {
                clientY = rows[rowIndex];

                toolState.snappedRowIndex = rowIndex + (top ? 0 : 1); // To include the zeroth row if bottom handle is active.
            } 
            else {
                toolState.snappedRowIndex = -1;
            }
        }

        if (left || right ) {
            const columns = left ? toolState.leftSnapPositions : toolState.rightSnapPositions;

            const columnIndex = closestIndex(columns, clientX);
            if (columnIndex !== -1) {
                clientX = columns[columnIndex];

                toolState.snappedColumnIndex = columnIndex + (left ? 0 : 1); // To include the zeroth column if bottom handle is active.
            }
            else {
                toolState.snappedColumnIndex = -1;
            }
        }

        return { snapX: clientX, snapY: clientY }; 
    }

    snapHandles(toolState, clientX, clientY, snap = (x, y) => this.snapNone(toolState, x, y)) {
        const { snapX, snapY } = snap(clientX, clientY);

        if (toolState.targetHandles.top) {
            toolState.target.style.top = px(snapY);
            toolState.target.style.height = px(toolState.pointerDownRect.bottom - snapY);
        }

        if (toolState.targetHandles.left) {
            toolState.target.style.left = px(snapX);
            toolState.target.style.width = px(toolState.pointerDownRect.right - snapX);
        }

        if (toolState.targetHandles.right) {
            toolState.target.style.width = px(snapX - toolState.pointerDownRect.left);
        }

        if (toolState.targetHandles.bottom) {
            toolState.target.style.height = px(snapY - toolState.pointerDownRect.top);
        }

        if (toolState.targetHandles.body) {
            const { snapX, snapY } = snap(clientX - toolState.grabLocation.x, clientY - toolState.grabLocation.y)

            toolState.target.style.left = px(snapX);
            toolState.target.style.top = px(snapY);
        }
    }

    updateSnapPositions(toolState) {
        const halfColumnGap = toolState.columnGap / 2;
        const halfRowGap = toolState.rowGap / 2;
        toolState.leftSnapPositions = [-halfColumnGap, ...toolState.viewGrid.columns].map(position => position + halfColumnGap);
        toolState.rightSnapPositions = [...toolState.viewGrid.columns, toolState.viewRect.width + halfColumnGap].map(position => position - halfColumnGap);;
        toolState.topSnapPositions = [-halfRowGap, ...toolState.viewGrid.rows].map(position => position + halfRowGap);;
        toolState.bottomSnapPositions = [...toolState.viewGrid.rows, toolState.viewRect.height + halfRowGap].map(position => position - halfRowGap);;
    }

    updateHandleType(toolState, {top, left, bottom, right, body}) {
        if ((top && left) || (bottom && right)) {
            toolState.target.style.cursor = 'nwse-resize';
            return;
        }

        if ((top && right) || (bottom && left)) {
            toolState.target.style.cursor = 'nesw-resize';
            return;
        }

        if (top || bottom) {
            toolState.target.style.cursor = 'ns-resize';
            return;
        }

        if (left || right) {
            toolState.target.style.cursor = 'ew-resize';
            return;
        }

        if (body) {
            toolState.target.style.cursor = 'move';
            return;
        }

        toolState.target.style.cursor = 'null';
    }

    updateElementPosition(toolState) {
        let position = toolState.element;

        const bottom = toolState.element.top + toolState.element.height;
        const right = toolState.element.left + toolState.element.width;

        if (toolState.targetHandles.top && toolState.snappedRowIndex >= 0 &&
            position.top !== toolState.snappedRowIndex &&
            position.height !== bottom - this.snappedRowIndex) {
                
            position = {
                ...position, 
                top: toolState.snappedRowIndex,
                height: bottom - toolState.snappedRowIndex,
            };
        }

        if (toolState.targetHandles.bottom && toolState.snappedRowIndex >= 0 && 
            position.height !== toolState.snappedRowIndex - toolState.element.top) {

            position = {
                ...position, 
                height: toolState.snappedRowIndex - toolState.element.top
            };
        }

        if (toolState.targetHandles.left && toolState.snappedColumnIndex >= 0 &&
            position.left !== toolState.snappedColumnIndex &&
            position.width !== right - toolState.snappedColumnIndex) {

            position = {...position, 
                left: toolState.snappedColumnIndex, 
                width: right - toolState.snappedColumnIndex
            };
        }

        if (toolState.targetHandles.right && toolState.snappedColumnIndex >= 0 && 
            position.width !== toolState.snappedColumnIndex - toolState.element.left) {

            position = {
                ...position, 
                width: toolState.snappedColumnIndex - toolState.element.left
            };
        }

        if (toolState.targetHandles.body && toolState.snappedRowIndex >= 0 &&
            position.top !== toolState.snappedRowIndex) {

            position = {...position,
                top: toolState.snappedRowIndex,
            };
        }

        if (toolState.targetHandles.body && toolState.snappedColumnIndex >= 0 &&
            position.left !== toolState.snappedColumnIndex) {

            position = {...position,
                left: toolState.snappedColumnIndex,  
            };
        }

        return (position === toolState.element) ? null : position;
    }
}
