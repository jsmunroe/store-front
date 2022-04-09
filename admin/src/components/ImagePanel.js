import { callWith } from "../utils/htmlHelpers";

import "./ImagePanel.scss";

export default function ImagePanel({images, onSelect, rowHeight=100, maxRatio=0.8, itemComponent}) {   
    const handleImageClick = (event, image) => {
        onSelect && onSelect(image);
    }

    return <div className="image-panel">
        <div className="image-panel__image-list">
            {images?.map(image => 
                <button key={image.name} type="button" className="image-panel__button" onClick={callWith(handleImageClick, image)} style={{height: image.cellHeight}}>
                    <img className="image-panel__image" src={image.source} alt={image.name} />
                </button>
            )}
        </div>
    </div>
}
