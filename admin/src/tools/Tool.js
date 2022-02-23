import { px } from "../utils/number";

export class ToolFactory {
    constructor(key) {
        this.key = key;
    }

    bindToElement(element, target, sectionGrid, onChange) {
        return oldTool => {
            oldTool?.unbind();

            return this.createElementTool(element, target, sectionGrid, onChange);
        }
    }

    bindToSection(section, target, sectionGrid, onChange) {
        return oldTool => {
            oldTool?.unbind();

            return this.createSectionTool(section, target, sectionGrid, onChange)
        }
    }

    // Create a new tool to a single element creating a state to support that element only.
    createElementTool(element, target, sectionGrid, onChange) { }

    // Create a new tool to a section creating a state to support that section only.
    createSectionTool(section, target, sectionGrid, onChange) { }
}

export class Tool {
    constructor(target, sectionGrid, onChange) {
        this._target = target;
        this._sectionGrid = sectionGrid;
        this._onChange = onChange;
        this._sectionRect = null;
        this._isPointerDown = false;

        this._selectionEnabled = false;


        if (target.classList.contains('element')) {
            this._sectionElement = target.closest('.section');

        } else if (target.classList.contains('section')) {
            this._sectionElement = target;
        }
    }

    unbind() {
        this._selector?.remove();
        this._hover?.remove();
    }

    onPointerDown(event) {
        event.target.setPointerCapture(event.pointerId);
        this._sectionRect = this._sectionElement?.getBoundingClientRect();
        this._isPointerDown = true;

        if (this._selectionEnabled) {
            this._pointerDownCell = {...this.hitCell(event)};
        }
    }
    
    onPointerMove(event) { 
        this._sectionRect = this._sectionElement?.getBoundingClientRect();

        if (this._selectionEnabled) {
            const cell = this.hitCell(event);
            if (this._pointerDownCell) {
                this.selectCells(this._pointerDownCell, cell);
            } else {
                this.hoverCell(cell);
            }
        }
    }
    
    onPointerUp(event) { 
        event.target.releasePointerCapture(event.pointerId);
        this._sectionRect = this._sectionElement?.getBoundingClientRect();
        this._isPointerDown = false;

        if (this._selectionEnabled) {
            const cell = this.hitCell(event);
            const selection = this.createSelectionRect(cell, this._pointerDownCell);
            this.onSelect(selection)
            this._pointerDownCell = null;
        }
    }

    onBlur(event) { }

    onFocus(event) { }

    onSelect(selection) { }

    getPointer(event) {
        return {
            clientX: event.clientX - this._sectionRect.x,
            clientY: event.clientY - this._sectionRect.y,
        }
    }

    getRect(element) {
        const {top, right, bottom, left, width, height, x, y} = element.getBoundingClientRect();

        return {
            top: top - this._sectionRect.y,
            left: left - this._sectionRect.x,
            right: right - this._sectionRect.x,
            bottom: bottom - this._sectionRect.y,
            width, 
            height, 
            x: x - this._sectionRect.x,
            y: y - this._sectionRect.y,
        }
    }

    hitCell(event) {
        const location = this.getPointer(event);
        return this._sectionGrid.hitCell({x: location.clientX, y: location.clientY});
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

        const topLeft = this._sectionGrid.getCellRect({row:corrected.start.row, column:corrected.start.column});
        const bottomRight = this._sectionGrid.getCellRect({row:corrected.end.row, column:corrected.end.column});

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
        const cellRect = this._sectionGrid.getCellRect({row:cell.row, column:cell.column});

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
