import { px } from "../utils/number";
import { computeElementPlacement } from "./useSectionGrid";

export default function useElementPlacement(element, sectionGrid) {
    // const columnStart = (left ?? 0) + 1;
    // const rowStart = (top ?? 0) + 1;
    // const columnEnd = columnStart + width;
    // const rowEnd = rowStart + height;

    // const placementStyles = {
    //     gridColumn: `${columnStart} / ${columnEnd}`,
    //     gridRow: `${rowStart} / ${rowEnd}`,
    // }

    if (!sectionGrid) {
        return { placementStyles: { display: 'none' } };
    }

    const placement = computeElementPlacement(sectionGrid, element);

    const placementStyles = {
        position: 'absolute',
        top: px(placement.top),
        left: px(placement.left),
        width: px(placement.width),
        height: px(placement.height),
    }

    return { placementStyles };
}