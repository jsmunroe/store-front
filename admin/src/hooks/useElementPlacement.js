import { px } from "../utils/number";

export default function useElementPlacement(element, viewGrid) {
    if (!viewGrid) {
        return { placementStyles: { display: 'none' } };
    }

    const placement = viewGrid.computeElementPlacement(element);

    const placementStyles = {
        position: 'absolute',
        top: px(placement.top),
        left: px(placement.left),
        width: px(placement.width),
        height: px(placement.height),
    }

    return { placementStyles };
}