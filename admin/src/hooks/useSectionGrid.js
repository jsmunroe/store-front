import { useEffect, useState } from "react";
import { range } from "../utils/array";

export default function useSectionGrid(section, sectionElement) {
    const [grid, setGrid] = useState(null);
    const [styles, setStyles] = useState({});

    useEffect(() => {
        if (section && sectionElement) {
            const sectionRect = sectionElement.getBoundingClientRect();
            const sectionStyle = window.getComputedStyle(sectionElement);

            const columnGap = parseInt(sectionStyle.columnGap, 10);
            const rowGap = parseInt(sectionStyle.rowGap, 10);

            const columnWidth = (sectionRect.width - columnGap * (section.columns - 1)) / section.columns;
            const rowHeight = columnWidth * (2/(1 + Math.sqrt(5)));

            setStyles({
                gridTemplateRows: `repeat(${section.rows}, ${rowHeight}px)`, //uniform(section.rows, '1fr').join(' ');
                gridTemplateColumns: `repeat(${section.columns}, 1fr)`, //uniform(section.columns, '1fr').join(' ');
            });
        
            const columns = range(1, section.columns).map(idx => idx * (columnWidth + columnGap) - columnGap/2); // centers of the gaps between columns.
            const rows = range(1, section.rows).map(idx => idx * (rowHeight + rowGap) - rowGap/2); // centers of the gaps between columns.

            const sectionGrid = {
                width: sectionRect.width,
                height: rows[rows.length - 1] + rowHeight,
                columns,
                rows,
                rowHeight,
                columnWidth,
                rowGap,
                columnGap,
                rect: sectionRect,
            };

            sectionGrid.computeElementPlacement = element => computeElementPlacement(sectionGrid, element);
            sectionGrid.hitCell = location => hitCell(sectionGrid, location);
            sectionGrid.getCellRect = location => getCellRect(sectionGrid, location);

            setGrid(sectionGrid);
        }

    }, [section, sectionElement])

    if (sectionElement) {
    }
    
    return { styles, grid }
}

// Compute the pixel placement of an element within a section (i.e., top, left, width, and height).
function computeElementPlacement(sectionGrid, element) {
    const halfColumnGap = sectionGrid.columnGap / 2;
    const halfRowGap = sectionGrid.rowGap / 2;
    const leftSnapPositions = [-halfColumnGap, ...sectionGrid.columns].map(position => position + halfColumnGap);
    const topSnapPositions = [-halfRowGap, ...sectionGrid.rows].map(position => position + halfRowGap);

    let top = topSnapPositions[element.top ?? 0];
    let left = leftSnapPositions[element.left ?? 0];
    let width = (sectionGrid.columnWidth + sectionGrid.columnGap) * element.width - sectionGrid.columnGap;
    let height = (sectionGrid.rowHeight + sectionGrid.rowGap) * element.height - sectionGrid.rowGap;

    return {top, left, width, height};
}

// Compute the cell coordinates (column, row) for the given section-releative location.
function hitCell(sectionGrid, {x, y}) {
    const columns = [...sectionGrid.columns, sectionGrid.width];
    const rows = [...sectionGrid.rows, sectionGrid.height];

    const column = columns.findIndex(c => x <= c);
    const row = rows.findIndex(r => y <= r);

    return { column, row }
}

// Get the rectangle for a cell at the given column and row.
function getCellRect(sectionGrid, {column, row}) {
    const left = column * (sectionGrid.columnWidth + sectionGrid.columnGap) - sectionGrid.columnGap / 2;
    const top = row * (sectionGrid.rowHeight + sectionGrid.rowGap) - sectionGrid.rowGap / 2;
    const width = sectionGrid.columnWidth + sectionGrid.columnGap;
    const height = sectionGrid.rowHeight + sectionGrid.rowGap;

    return {left, top, width, height};
}