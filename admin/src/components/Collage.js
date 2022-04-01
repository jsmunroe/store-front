import { useEffect, useState } from "react";
import useBounds from "../hooks/useBounds";
import { callWith } from "../utils/htmlHelpers";

import Busy from "./Busy";
import Error from "./Error";

import "./Collage.scss";

export default function Collage({images: imagesProp, onSelect, rowHeight=100, maxRatio=0.8, itemComponent}) {
    const {width, ref} = useBounds();

    const {images, isLoading, error} = useCanvasResize(imagesProp, {width, rowHeight});

    const handleImageClick = (event, image) => {
        onSelect && onSelect(image);
    }

    const Item = itemComponent ?? (({children}) => <>{children}</>);

    return <div className="collage" ref={ref}>
        {isLoading && <Busy/>}
        {error && <Error message="An error occured loading images." />}
        <div className="collage__image-list">
            {images?.map(image => 
                <button key={image.name} type="button" className="collage__button" onClick={callWith(handleImageClick, image)} style={{height: image.cellHeight}}>
                    <Item image={image}><img className="collage__image" src={image.source} alt={image.name} /></Item>
                </button>
            )}
        </div>
    </div>
}

function useCanvasResize(imagesProp, {width, rowHeight = 100, maxRatio = 0.8}) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            if (!imagesProp || !width) {
                return;
            }

            try {

                const images = await computeImageSizesForCollage(imagesProp, { width, rowHeight, maxRatio})
                setImages(images);
                setIsLoading(false);
            } 
            catch (error) {
                setIsLoading(false);
                setError(error);
            }
        })();

    }, [imagesProp, width, rowHeight, maxRatio])

    return {images, isLoading, error};
}

function getDimensions(source) {
    const image = new Image();
    var promise = new Promise(resolve => {
        image.addEventListener("load", () => {
            resolve([image.naturalWidth, image.naturalHeight])
        }, { once: true });
    })    
    image.src = source;

    return promise;
}

async function applyImageDimensions(image) {
    const [width, height] = await getDimensions(image.source);

    return {...image, width, height};
}

async function computeImageSizesForCollage(images, { width, rowHeight=100, minRatio=0.8 }) {
    images = await Promise.all(images.map(applyImageDimensions));

    let lineWidth = -5;
    let line = [];

    let sized = [];
    
    while (images.length) {
        let image = images.pop();

        image = {...image, cellWidth: image.width / image.height * rowHeight};

        lineWidth += image.cellWidth + 5;
        line.push(image);

        const viewRatio = lineWidth / (width * 0.998)
        if (viewRatio > minRatio) {
            // We have enough images for a line.
            sized.push(...line.map(image => ({...image, cellHeight: rowHeight * 1/viewRatio})));
            lineWidth = -5;
            line = [];
        }
    }

    sized.push(...line.map(image => ({...image, cellHeight: rowHeight})));

    return sized;
}