export default function useElementPlacement({left, top, width, height}) {
    const columnStart = (left ?? 0) + 1;
    const rowStart = (top ?? 0) + 1;
    const columnEnd = columnStart + width;
    const rowEnd = rowStart + height;

    const placementStyles = {
        gridColumn: `${columnStart} / ${columnEnd}`,
        gridRow: `${rowStart} / ${rowEnd}`,
    }
    
    return { placementStyles };
}