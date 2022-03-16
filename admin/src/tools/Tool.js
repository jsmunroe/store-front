import { px } from "../utils/number";

export class ToolFactory {
    constructor(key) {
        this.key = key;
    }

    bindToElement(element, target, viewGrid, onChange) {
        return oldTool => {
            oldTool?.unbind();

            return this.createElementTool(element, target, viewGrid, onChange);
        }
    }

    bindToView(view, target, viewGrid, onChange) {
        return oldTool => {
            oldTool?.unbind();

            return this.createViewTool(view, target, viewGrid, onChange)
        }
    }

    // Create a new tool to a single element creating a state to support that element only.
    createElementTool(element, target, viewGrid, onChange) { }

    // Create a new tool to a view creating a state to support that view only.
    createViewTool(view, target, viewGrid, onChange) { }
}

export class Tool {
    constructor(target, viewGrid, onChange) {
        this._target = target;
        this._viewGrid = viewGrid;
        this._onChange = onChange;
        this._viewRect = null;
        this._isPointerDown = false;

        this._enabled = true;
        this._selectionEnabled = false;


        if (target.classList.contains('element')) {
            this._viewElement = target.closest('.view');

        } else if (target.classList.contains('view')) {
            this._viewElement = target;
        }
    }

    unbind() {
        this._selector?.remove();
        this._hover?.remove();
    }

    disable() {
        this._enabled = false;
        this.unbind();
    }

    enable() {
        this._enabled = true;
    }

    onPointerDown(event) {
        if (!this._enabled) {
            return;
        }

        event.target.setPointerCapture(event.pointerId);
        this._viewRect = this._viewElement?.getBoundingClientRect();
        this._isPointerDown = true;

        if (this._selectionEnabled) {
            this._pointerDownCell = {...this.hitCell(event)};
        }

        this.doPointerDown(event);
    }
    
    onPointerMove(event) { 
        if (!this._enabled) {
            return;
        }

        this._viewRect = this._viewElement?.getBoundingClientRect();

        if (this._selectionEnabled) {
            const cell = this.hitCell(event);
            if (this._pointerDownCell) {
                this.selectCells(this._pointerDownCell, cell);
            } else {
                this.hoverCell(cell);
            }
        }

        this.doPointerMove(event);
    }
    
    onPointerUp(event) { 
        if (!this._enabled) {
            return;
        }

        event.target.releasePointerCapture(event.pointerId);
        this._viewRect = this._viewElement?.getBoundingClientRect();
        this._isPointerDown = false;

        if (this._selectionEnabled) {
            const cell = this.hitCell(event);
            const selection = this.createSelectionRect(cell, this._pointerDownCell);
            this.onSelect(selection)
            this._pointerDownCell = null;
        }

        this.doPointerUp(event);
    }

    onBlur(event) {
        if (!this._enabled) {
            return;
        }

        this.doBlur(event);
    }

    onFocus(event) {
        if (!this._enabled) {
            return;
        }

        this.doFocus(event);
    }

    onSelect(selection) { }

    doPointerDown(event) { }
    doPointerMove(event) { }
    doPointerUp(event) { }
    doBlur(event) { }
    doFocus(event) { }

    getPointer(event) {
        return {
            clientX: event.clientX - this._viewRect.x,
            clientY: event.clientY - this._viewRect.y,
        }
    }

    getRect(element) {
        const {top, right, bottom, left, width, height, x, y} = element.getBoundingClientRect();

        return {
            top: top - this._viewRect.y,
            left: left - this._viewRect.x,
            right: right - this._viewRect.x,
            bottom: bottom - this._viewRect.y,
            width, 
            height, 
            x: x - this._viewRect.x,
            y: y - this._viewRect.y,
        }
    }

    hitCell(event) {
        const location = this.getPointer(event);
        return this._viewGrid.hitCell({x: location.clientX, y: location.clientY});
    }

    correctSelection(start, end) {
        start = {...start}
        end = {...end}

        const minRow = Math.min(start.row, end.row);
        const maxRow = Math.max(start.row, end.row);
        const maxColumn = Math.max(start.column, end.column);
        const minColumn = Math.min(start.column, end.column);

        start.row = minRow;
        start.column = minColumn;
        end.row = maxRow;
        end.column = maxColumn;

        return { start, end };
    }

    createSelectionRect(start, end) {
        const corrected = this.correctSelection(start, end);

        return {
            top: corrected.start.row,
            left: corrected.start.column,
            width: corrected.end.column - corrected.start.column + 1,
            height: corrected.end.row - corrected.start.row + 1,
        };
    }

    selectCells(start, end) {
        const corrected = this.correctSelection(start, end);

        const topLeft = this._viewGrid.getCellRect({row:corrected.start.row, column:corrected.start.column});
        const bottomRight = this._viewGrid.getCellRect({row:corrected.end.row, column:corrected.end.column});

        const top = topLeft.top;
        const left = topLeft.left;
        const right = bottomRight.left + bottomRight.width;
        const bottom = bottomRight.top + bottomRight.height;
        const width = right - left;
        const height = bottom - top;

        this._hover?.remove();
        this._hover = null;

        if (!this._selector) {
            this._selector = document.createElement("div");
            this._selector.className = 'selector';
            this._selector.style.display = 'none';
            this._target.appendChild(this._selector);    
        }

        this._selector.style.top = px(top);
        this._selector.style.left = px(left);
        this._selector.style.width = px(width);
        this._selector.style.height = px(height);
        this._selector.style.display = null
    }

    hoverCell(cell) {
        const cellRect = this._viewGrid.getCellRect({row:cell.row, column:cell.column});

        if (!this._hover) {
            this._hover = document.createElement("div");
            this._hover.className = 'hover';
            this._hover.style.display = 'none';
            this._target.appendChild(this._hover);    
        }

        this._hover.style.top = px(cellRect.top);
        this._hover.style.left = px(cellRect.left);
        this._hover.style.width = px(cellRect.width);
        this._hover.style.height = px(cellRect.height);
        this._hover.style.display = null;
    }
}
