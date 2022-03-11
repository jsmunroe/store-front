import { useEffect, useState } from "react";
import { range } from "../utils/array";

export default function useViewGrid(view, domView) {
    const [grid, setGrid] = useState(null);
    const [styles, setStyles] = useState({});

    useEffect(() => {
        if (view && domView) {
            const viewRect = domView.getBoundingClientRect();
            const viewStyle = window.getComputedStyle(domView);

            const columnGap = parseInt(viewStyle.columnGap, 10);
            const rowGap = parseInt(viewStyle.rowGap, 10);

            const columnWidth = (viewRect.width - columnGap * (view.columns - 1)) / view.columns;
            const rowHeight = columnWidth * (2/(1 + Math.sqrt(5)));

            setStyles({
                gridTemplateRows: `repeat(${view.rows}, ${rowHeight}px)`,
                gridTemplateColumns: `repeat(${view.columns}, 1fr)`,
            });
        
            const columns = range(1, view.columns).map(idx => idx * (columnWidth + columnGap) - columnGap/2); // centers of the gaps between columns.
            const rows = range(1, view.rows).map(idx => idx * (rowHeight + rowGap) - rowGap/2); // centers of the gaps between columns.

            const viewGrid = {
                width: viewRect.width,
                height: rows[rows.length - 1] + rowHeight,
                columns,
                rows,
                rowHeight,
                columnWidth,
                rowGap,
                columnGap,
                rect: viewRect,
            };

            viewGrid.computeElementPlacement = element => computeElementPlacement(viewGrid, element);
            viewGrid.hitCell = location => hitCell(viewGrid, location);
            viewGrid.getCellRect = location => getCellRect(viewGrid, location);

            setGrid(viewGrid);
        }

    }, [view, domView])

    if (domView) {
    }
    
    return { styles, grid }
}

// Compute the pixel placement of an element within a view (i.e., top, left, width, and height).
function computeElementPlacement(viewGrid, element) {
    const halfColumnGap = viewGrid.columnGap / 2;
    const halfRowGap = viewGrid.rowGap / 2;
    const leftSnapPositions = [-halfColumnGap, ...viewGrid.columns].map(position => position + halfColumnGap);
    const topSnapPositions = [-halfRowGap, ...viewGrid.rows].map(position => position + halfRowGap);

    let top = topSnapPositions[element.top ?? 0];
    let left = leftSnapPositions[element.left ?? 0];
    let width = (viewGrid.columnWidth + viewGrid.columnGap) * element.width - viewGrid.columnGap;
    let height = (viewGrid.rowHeight + viewGrid.rowGap) * element.height - viewGrid.rowGap;

    return {top, left, width, height};
}

// Compute the cell coordinates (column, row) for the given view-releative location.
function hitCell(viewGrid, {x, y}) {
    const columns = [...viewGrid.columns, viewGrid.width];
    const rows = [...viewGrid.rows, viewGrid.height];

    const column = columns.findIndex(c => x <= c);
    const row = rows.findIndex(r => y <= r);

    return { column, row }
}

// Get the rectangle for a cell at the given column and row.
function getCellRect(viewGrid, {column, row}) {
    const left = column * (viewGrid.columnWidth + viewGrid.columnGap) - viewGrid.columnGap / 2;
    const top = row * (viewGrid.rowHeight + viewGrid.rowGap) - viewGrid.rowGap / 2;
    const width = viewGrid.columnWidth + viewGrid.columnGap;
    const height = viewGrid.rowHeight + viewGrid.rowGap;

    return {left, top, width, height};
}