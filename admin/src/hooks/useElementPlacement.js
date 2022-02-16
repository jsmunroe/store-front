import { px } from "../utils/number";

export default function useElementPlacement(element, sectionGrid) {
    if (!sectionGrid) {
        return { placementStyles: { display: 'none' } };
    }

    const placement = sectionGrid.computeElementPlacement(element);

    const placementStyles = {
        position: 'absolute',
        top: px(placement.top),
        left: px(placement.left),
        width: px(placement.width),
        height: px(placement.height),
    }

    return { placementStyles };
}