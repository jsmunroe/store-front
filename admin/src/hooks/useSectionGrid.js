import { range, uniform } from "../utils/array";

export default function useSectionGrid(section, sectionElement) {
    const styles = {};

    styles.gridTemplateRows = `repeat(${section.rows}, 1fr)`; //uniform(section.rows, '1fr').join(' ');
    styles.gridTemplateColumns = `repeat(${section.columns}, 1fr)`; //uniform(section.columns, '1fr').join(' ');

    let grid = null;

    if (sectionElement) {
        const sectionRect = sectionElement.getBoundingClientRect();
        const sectionStyle = window.getComputedStyle(sectionElement);

        const columnGap = parseInt(sectionStyle.columnGap, 10);
        const rowGap = parseInt(sectionStyle.rowGap, 10);

        const columnWidth = (sectionRect.width - columnGap * (section.columns - 1)) / section.columns;
        const rowHeight = (sectionRect.height - rowGap * (section.rows - 1)) / section.rows;

        grid = {
            columns: range(1, section.columns).map(idx => idx * (columnWidth + columnGap) - columnGap/2), // centers of the gaps between columns.
            rows: range(1, section.rows).map(idx => idx * (rowHeight + rowGap) - rowGap/2), // centers of the gaps between columns.
        }

        console.log(columnWidth);
    }
    
    return { styles, grid }
}