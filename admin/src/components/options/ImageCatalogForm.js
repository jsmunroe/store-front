import { listCategories, listImages } from "../../api/images.firebase";
import useFetch from "../../hooks/useFetch";
import { useFormState } from "../../hooks/useFormState";
import Form from "../controls/Form";
import Select from "../controls/Select";
import Error from "../Error";
import Busy from "../Busy";
import ImagePanel from "../ImagePanel";
import './ImageCatalogForm.scss';

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

    if (isLoading) {
        return <Busy />
    }

    let { images } = data;

    return <div className="image-catalog">
        {error && <Error message="Error loading images." />}

        <div className="image-catalog__item-list">
            <ImagePanel images={images} onSelect={onSelect} itemComponent={CatalogImage} />
        </div>
    </div>
}

function CatalogImage({image, children}) {
    return <div className="image">
        {children}
        <div className="image__name">{image.name}</div>
    </div>
}