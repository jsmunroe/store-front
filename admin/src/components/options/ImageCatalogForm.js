import { listCategories, listImages } from "../../api/images.firebase";
import useFetch from "../../hooks/useFetch";
import { useFormState } from "../../hooks/useFormState";
import './ImageCatalogForm.scss';

import Form from "../controls/Form";
import Select from "../controls/Select";
import Error from "../Error";
import Busy from "../Busy";
import { callWith } from "../../utils/htmlHelpers";

export default function ImageCatalogForm({onSubmit, onCancel}) {
    var {data, isLoading, error} = useFetch(listCategories);

    const handleSelectImage = image => {
        onSubmit(image);
    }

    return <Form className="form">
        <div className="form__title"><i className="icon-image-list"></i> Image Catalog</div>

        {error && <Error message="Error loading catelog categories." />}

        <label className="form__label">Category</label>
        <Select className="form__select" name="category" placeholder={isLoading ? 'Loading...' : ''}>
            {data?.map(category => <option key={category} value={category}>{category}</option>)}
        </Select>

        <div className="form__row">
            <CatalogImages onSelect={handleSelectImage} />
        </div>
    </Form>
}

function CatalogImages({onSelect}) {
    var [category] = useFormState('category');
    var {data, isLoading, error} = useFetch(listImages, category);

    if (isLoading) {
        return <Busy />
    }

    const { images } = data;

    const handleImageClick = (event, image) => {
        onSelect && onSelect(image);
    }

    return <div className="image-catalog">
        {error && <Error message="Error loading images." />}

        <div className="image-catalog__item-list">
        {images.map(image => 
            <button key={image.name} type="button" className="image-catalog__button" onClick={callWith(handleImageClick, image)}>
                <img className="image-catalog__image" src={image.source} alt={image.name} />
            </button>
        )}
        </div>
    </div>
}