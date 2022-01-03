import { range } from "../utils/array";

export default function useSectionGrid(section, sectionElement) {
    const styles = {};
    let grid = null;

    if (sectionElement) {
        const sectionRect = sectionElement.getBoundingClientRect();
        const sectionStyle = window.getComputedStyle(sectionElement);

        const columnGap = parseInt(sectionStyle.columnGap, 10);
        const rowGap = parseInt(sectionStyle.rowGap, 10);

        const columnWidth = (sectionRect.width - columnGap * (section.columns - 1)) / section.columns;
        const rowHeight = columnWidth * (2/(1 + Math.sqrt(5)));

        styles.gridTemplateRows = `repeat(${section.rows}, ${rowHeight}px)`; //uniform(section.rows, '1fr').join(' ');
        styles.gridTemplateColumns = `repeat(${section.columns}, 1fr)`; //uniform(section.columns, '1fr').join(' ');
    
        grid = {
            columns: range(1, section.columns).map(idx => idx * (columnWidth + columnGap) - columnGap/2), // centers of the gaps between columns.
            rows: range(1, section.rows).map(idx => idx * (rowHeight + rowGap) - rowGap/2), // centers of the gaps between columns.
        }
    }
    
    return { styles, grid }
}