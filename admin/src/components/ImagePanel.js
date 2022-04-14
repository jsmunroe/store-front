import { callWith } from "../utils/htmlHelpers";

import "./ImagePanel.scss";

export default function ImagePanel({images, onSelect, itemComponent}) {   
    const handleImageClick = (event, image) => {
        onSelect && onSelect(image);
    }

    const Item = itemComponent ?? (({children}) => <>{children}</>);

    return <div className="image-panel">
        <div className="image-panel__image-list">
            {images?.map(image => 
                <button key={image.name} type="button" className="image-panel__button" onClick={callWith(handleImageClick, image)} style={{height: image.cellHeight}}>
                    <Item image={image}>
                        <img className="image-panel__image" src={image.source} alt={image.name} />
                    </Item>
                </button>
            )}
        </div>
    </div>
}
