import { px } from "../utils/number";

export default class Tool {
    buildState(target, viewGrid, onChange) {
        let targetType = getTargetType(target);

        return {
            target,
            targetType,
            viewGrid,
            viewElement: getViewElement(target, targetType),
            viewRect: null,
            onChange,
            isPointerDown: false,
            selectionEnabled: false,
        }
    }

    unbind(toolState) {
        toolState.selector?.remove();
        toolState.hover?.remove();
    }

    onPointerDown(toolState, event) {
        if (!toolState) {
            return;
        }

        event.target.setPointerCapture(event.pointerId);
        toolState.viewRect = toolState.viewElement?.getBoundingClientRect();
        toolState.isPointerDown = true;

        if (toolState.selectionEnabled) {
            toolState.pointerDownCell = {...this.hitCell(toolState, event)};
        }

        this.doPointerDown(toolState, event);
    }
    
    onPointerMove(toolState, event) {
        if (!toolState) {
            return;
        }

        toolState.viewRect = toolState.viewElement?.getBoundingClientRect();

        if (toolState.selectionEnabled) {
            const cell = this.hitCell(toolState, event);
            if (toolState.pointerDownCell) {
                this.selectCells(toolState, toolState.pointerDownCell, cell);
            } else {
                this.hoverCell(toolState, cell);
            }
        }

        this.doPointerMove(toolState, event);
    }
    
    onPointerUp(toolState, event) {
        if (!toolState) {
            return;
        }

        event.target.releasePointerCapture(event.pointerId);
        toolState.viewRect = toolState.viewElement?.getBoundingClientRect();
        toolState.isPointerDown = false;

        if (toolState.selectionEnabled) {
            const cell = this.hitCell(toolState, event);
            const selection = this.createSelectionRect(toolState, cell, toolState.pointerDownCell);
            this.onSelect(toolState, selection)
            toolState.pointerDownCell = null;
        }

        this.doPointerUp(toolState, event);
    }

    onBlur(toolState, event) {
        this.doBlur(toolState, event);
    }

    onFocus(toolState, event) {
        this.doFocus(toolState, event);
    }

    onSelect(toolState, selection) { }

    doPointerDown(toolState, event) { }
    doPointerMove(toolState, event) { }
    doPointerUp(toolState, event) { }
    doBlur(toolState, event) { }
    doFocus(toolState, event) { }

    getPointer(toolState, event) {
        return {
            clientX: event.clientX - toolState.viewRect.x,
            clientY: event.clientY - toolState.viewRect.y,
        }
    }

    getRect(toolState, element) {
        const {top, right, bottom, left, width, height, x, y} = element.getBoundingClientRect();

        return {
            top: top - toolState.viewRect.y,
            left: left - toolState.viewRect.x,
            right: right - toolState.viewRect.x,
            bottom: bottom - toolState.viewRect.y,
            width, 
            height, 
            x: x - toolState.viewRect.x,
            y: y - toolState.viewRect.y,
        }
    }

    hitCell(toolState, event) {
        const location = this.getPointer(toolState, event);
        return toolState.viewGrid.hitCell({x: location.clientX, y: location.clientY});
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

    selectCells(toolState, start, end) {
        const corrected = this.correctSelection(start, end);

        const topLeft = toolState.viewGrid.getCellRect({row:corrected.start.row, column:corrected.start.column});
        const bottomRight = toolState.viewGrid.getCellRect({row:corrected.end.row, column:corrected.end.column});

        const top = topLeft.top;
        const left = topLeft.left;
        const right = bottomRight.left + bottomRight.width;
        const bottom = bottomRight.top + bottomRight.height;
        const width = right - left;
        const height = bottom - top;

        toolState.hover?.remove();
        toolState.hover = null;

        if (!toolState.selector) {
            toolState.selector = document.createElement("div");
            toolState.selector.className = 'selector';
            toolState.selector.style.display = 'none';
            toolState.target.appendChild(toolState.selector);    
        }

        toolState.selector.style.top = px(top);
        toolState.selector.style.left = px(left);
        toolState.selector.style.width = px(width);
        toolState.selector.style.height = px(height);
        toolState.selector.style.display = null
    }

    hoverCell(toolState, cell) {
        const cellRect = toolState.viewGrid.getCellRect({row:cell.row, column:cell.column});

        if (!toolState.hover) {
            toolState.hover = document.createElement("div");
            toolState.hover.className = 'hover';
            toolState.hover.style.display = 'none';
            toolState.target.appendChild(toolState.hover);    
        }

        toolState.hover.style.top = px(cellRect.top);
        toolState.hover.style.left = px(cellRect.left);
        toolState.hover.style.width = px(cellRect.width);
        toolState.hover.style.height = px(cellRect.height);
        toolState.hover.style.display = null;
    }

}
    
function getTargetType(target) {
    return target.dataset.targetType;
}

function getViewElement(target, targetType) {
    switch (targetType) {
        case 'element':
            return target.closest('.view');
        case 'view':
            return target.closest('.view');
        default:
            return null;
    }
}