import { useEffect } from "react";
import { listCategories, listImages } from "../../api/images.firebase";
import useFetch from "../../hooks/useFetch";
import { useFormState } from "../../hooks/useFormState";
import './ImageCatalogForm.scss';
import Form from "../controls/Form";
import Select from "../controls/Select";
import Error from "../Error";
import Busy from "../Busy";
import { callWith } from "../../utils/htmlHelpers";
import useBounds from "../../hooks/useBounds";

export default function ImageCatalogForm({onSubmit, onCancel}) {
    var {data, isLoading, error} = useFetch(listCategories);

    const handleSelectImage = image => {
        onSubmit(image);
    }

    const handleCancelClick = event => {
        onCancel();
    }

    return <Form className="form no-grid image-catalog-form">
        <div className="form__title"><i className="icon-image-list"></i> Image Catalog</div>

        <div>{error && <Error message="Error loading catelog categories." />}</div>

        <div className="form__group">
            <label className="form__label">Category</label>
            <Select className="form__select" name="category" placeholder={isLoading ? 'Loading...' : ''}>
                {data?.map(category => <option key={category} value={category}>{category}</option>)}
            </Select>
        </div>

        <CatalogImages onSelect={handleSelectImage} />

        <div className="form__buttons">
            <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
    </Form>
}

function CatalogImages({onSelect}) {
    var [category] = useFormState('category');
    var {data, isLoading, error} = useFetch(() => listImages(category), !!category);

    var {width, ref} = useBounds();

    if (isLoading) {
        return <Busy />
    }

    let { images } = data;

    const handleImageClick = (event, image) => {
        onSelect && onSelect(image);
    }

    images = sizeCollage(width, images);

    return <div className="image-catalog">
        {error && <Error message="Error loading images." />}

        <div className="image-catalog__item-list">
            <div className="image-catalog__collage" ref={ref}>
            {images.map(image => 
                <button key={image.name} type="button" className="image-catalog__button" onClick={callWith(handleImageClick, image)} style={{height: image.cellHeight}}>
                    <img className="image-catalog__image" src={image.source} alt={image.name} />
                </button>
            )}
            </div>
        </div>
    </div>
}

function sizeCollage(viewWidth, images) {
    if (!viewWidth) {
        return images;
    }

    images = images.map(image => ({...image}));
    
    const nominalHeight = 100;
    const minRatio = 0.8;

    let nominalLineWidth = -5;
    let line = [];

    let sized = [];
    
    while (images.length) {
        let image = images.pop();

        image = {...image, cellWidth: image.width / image.height * nominalHeight};

        nominalLineWidth += image.cellWidth + 5;
        line.push(image);

        const viewRatio = nominalLineWidth / (viewWidth * 0.998)
        if (viewRatio > minRatio) {
            // We have enough images for a line.
            sized.push(...line.map(image => ({...image, cellHeight: nominalHeight * 1/viewRatio})));
            nominalLineWidth = -5;
            line = [];
        }
    }

    sized.push(...line.map(image => ({...image, cellHeight: nominalHeight})));

    return sized;
}