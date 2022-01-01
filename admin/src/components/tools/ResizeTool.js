export default class ResizeTool {
    constructor() {
        this.target = null;
        this.section = null;
    
        this.targetHandles = { 
            top: false,
            left: false,
            bottom: false,
            right: false,
        };
    
        this._sectionRect = null;
        this._sectionColumnGap = 0;
        this._sectionRowGap = 0;
        this._pointerDownRect = null;
        this._snappedColumnIndex = -1;
        this._snappedRowIndex = -1;
    
        this._leftSnapPositions = [];
        this._rightSnapPositions = [];
        this._topSnapPositions = [];
        this._bottomSnapPositions = [];
    
        this._handleThreshold = 15;
        this._resizeSnapThreshold = 20;
    }


    // Bind to a single element creating a state to support that element only.
    bind(element, target, sectionGrid, onChange) {
        if (!target) {
            return null;
        }

        const tool = new ResizeTool()

        tool._element = {
            ...element, 
            top: element.top ?? 0,
            left: element.left ?? 0
        };

        tool._target = target;
        tool._section = target.closest('.section');

        tool._sectionGrid = sectionGrid;

        tool._onChange = onChange;

        if (!tool._section) {
            throw new Error('Cannot find parent section element.');
        }

        return tool;
    }
    
    onPointerDown(event) {
        const sectionStyle = window.getComputedStyle(this._section);
        this._sectionColumnGap = parseFloat(sectionStyle.columnGap);
        this._sectionRowGap = parseFloat(sectionStyle.rowGap);
        this._sectionRect = this._section.getBoundingClientRect();

        const { clientX, clientY } = this.getPointer(event);
        
        this._pointerDownRect = this.getRect(this._target);
        this._targetHandles = this.getHandles(clientX, clientY, this._pointerDownRect);
        this._target.setPointerCapture(event.pointerId);
        this._target.classList.add('element--no-transition');

        this.updateSnapPositions();
    }
    
    onPointerMove(event) {
        event.preventDefault();

        this._sectionRect = this._section.getBoundingClientRect();

        let { clientX, clientY } = this.getPointer(event);

        if (this._target.hasPointerCapture(event.pointerId)) {      

            ({ clientX, clientY } = this.snap(clientX, clientY));

            if (this._targetHandles.top) {
                this._target.style.marginTop = `${clientY - this._pointerDownRect.top}px`;
            }

            if (this._targetHandles.left) {
                this._target.style.marginLeft = `${clientX - this._pointerDownRect.left}px`;
            }

            if (this._targetHandles.right) {
                this._target.style.marginRight = `${this._pointerDownRect.right - clientX}px`;
            }

            if (this._targetHandles.bottom) {
                this._target.style.marginBottom = `${this._pointerDownRect.bottom - clientY}px`;
            }
        } 
        else {
            const { clientX, clientY } = this.getPointer(event);

            const targetRect = this.getRect(this._target);
            const handles = this.getHandles(clientX, clientY, targetRect)
            this.updateHandleType(handles);
        }
    }
    
    onPointerUp(event) {
        this._target.style.marginTop = null;
        this._target.style.marginLeft = null;
        this._target.style.marginRight = null;
        this._target.style.marginBottom = null;

        this._target.releasePointerCapture(event.pointerId);
        setTimeout(() => this._target.classList.remove('element--no-transition'), 0);

        const updatedElement = this.updateElementPosition(this._element);
        if (updatedElement) {
            this._onChange(updatedElement);
        }
    }

    getHandles(clientX, clientY, targetRect) {
        return {
            top: Math.abs(clientY - targetRect.top) < this._handleThreshold,
            left: Math.abs(clientX - targetRect.left) < this._handleThreshold,
            bottom: Math.abs(clientY - targetRect.bottom) < this._handleThreshold,
            right: Math.abs(clientX - targetRect.right) < this._handleThreshold,
        };

    }

    getPointer(event) {
        return {
            clientX: event.clientX - this._sectionRect.x,
            clientY: event.clientY - this._sectionRect.y,
        }
    }

    getRect(element) {
        const rect = element.getBoundingClientRect();

        return {
            ...rect, 
            top: rect.top - this._sectionRect.y,
            left: rect.left - this._sectionRect.x,
            right: rect.right - this._sectionRect.x,
            bottom: rect.bottom - this._sectionRect.y,
        }
    }

    snap(clientX, clientY) {
        const { top, left, right, bottom } = this._targetHandles;
        
        if (top || bottom) {
            const rows = top ? this._topSnapPositions : this._bottomSnapPositions;

            const rowIndex = rows.findIndex(row => Math.abs(row - clientY) < this._resizeSnapThreshold);
            if (rowIndex !== -1) {
                clientY = rows[rowIndex];

                this._snappedRowIndex = rowIndex + (top ? 0 : 1); // To include the zeroth row if bottom handle is active.
            } 
            else {
                this._snappedRowIndex = -1;

            }
        }

        if (left || right) {
            const columns = left ? this._leftSnapPositions : this._rightSnapPositions;

            const columnIndex = columns.findIndex(column => Math.abs(column - clientX) < this._resizeSnapThreshold);
            if (columnIndex !== -1) {
                clientX = columns[columnIndex];

                this._snappedColumnIndex = columnIndex + (left ? 0 : 1); // To include the zeroth column if bottom handle is active.
            }
            else {
                this._snappedColumnIndex = -1;
            }
        }

        return { clientX, clientY };
    }

    updateSnapPositions() {
        const halfColumnGap = this._sectionColumnGap / 2;
        const halfRowGap = this._sectionRowGap / 2;
        this._leftSnapPositions = [-halfColumnGap, ...this._sectionGrid.columns].map(position => position + halfColumnGap);
        this._rightSnapPositions = [...this._sectionGrid.columns, this._sectionRect.width].map(position => position - halfColumnGap);;
        this._topSnapPositions = [-halfRowGap, ...this._sectionGrid.rows].map(position => position + halfRowGap);;
        this._bottomSnapPositions = [...this._sectionGrid.rows, this._sectionRect.height].map(position => position - halfRowGap);;
    }

    updateHandleType({top, left, bottom, right}) {
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

        this._target.style.cursor = null;
    }

    updateElementPosition() {
        let position = this._element;

        if (this._targetHandles.top && this._snappedRowIndex >= 0) {
            const bottom = this._element.top + this._element.height;
            position = {
                ...position, 
                top: this._snappedRowIndex,
                height: bottom - this._snappedRowIndex,
            };
        }

        if (this._targetHandles.bottom && this._snappedRowIndex >= 0) {
            position = {
                ...position, 
                height: this._snappedRowIndex - this._element.top
            };
        }

        if (this._targetHandles.left && this._snappedColumnIndex >= 0) {
            const right = this._element.left + this._element.width;
            position = {...position, 
                left: this._snappedColumnIndex, 
                width: right - this._snappedColumnIndex
            };
        }

        if (this._targetHandles.right && this._snappedColumnIndex >= 0) {
            position = {
                ...position, 
                width: this._snappedColumnIndex - this._element.left
            };
        }

        return (position === this._element) ? null : position;
    }


}
