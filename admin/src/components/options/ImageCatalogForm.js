import { deleteImage, listCategories, listImages, uploadImage } from "../../api/images.firebase";
import { confirm } from "../Modal";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useFormState } from "../../hooks/useFormState";
import useUpdater from "../../hooks/useUpdater";

import { Form, Select } from "../controls";
import Error from "../Error";
import Busy from "../Busy";
import ImagePanel from "../ImagePanel";
import { TabItem, TabPanel } from "../controls/TabPanel";
import DropZone from "../DropZone";

import './ImageCatalogForm.scss';

export default function ImageCatalogForm({onSubmit, onCancel}) {
    var {data, isLoading, error} = useFetch(listCategories);
    return <Form className="form no-grid image-catalog-form">
        <div className="form__title"><i className="icon-image-list"></i> Image Catalog</div>
    
        <div>{error && <Error message="Error loading catelog categories." />}</div>

        <div className="form__group">
            <label className="form__label">Category</label>
            <Select className="form__select" name="category" placeholder={isLoading ? 'Loading...' : ''}>
                {data?.map(category => <option key={category} value={category}>{category}</option>)}
            </Select>
        </div>

        <CatalogImages onSelect={onSubmit} onCancel={onCancel}/>
    </Form>
}

function CatalogImages({onSelect, onCancel}) {
    var [category] = useFormState('category');
    var [token, update] = useUpdater();
    var {data, isLoading, error} = useFetch(() => listImages(category), [category, token]);
    var [isUploading, setIsUploading] = useState(false);
    var [uploadFile, setUploadFile] = useState();

    const handleSelectImage = image => {
        onSelect && onSelect(image);
    }

    const handleCancelClick = event => {
        onCancel && onCancel();
    }

    const handleUploadClick = async event => {
        const image = await uploadImage(category, uploadFile);

        onSelect && onSelect(image);
    }

    const handleDeleteImage = async image => {
        if (await confirm(`Are you sure you want to remove ${image.name}?`)) {
            await deleteImage(image.path);
        }
        update();
    }

    const handleSetIsUploading = isUploading => {
        setIsUploading(isUploading);
        setUploadFile(null);
    }

    if (isLoading) {
        return <Busy />
    }


    const { images } = data;
    const Item = ({children, ...props}) => <CatalogImage onDelete={handleDeleteImage} {...props}>{children}</CatalogImage>

    return <>
        {!isUploading 
            ? <div className="image-catalog">
                {error && <Error message="Error loading images." />}

                <div className="image-catalog__item-list">
                    <ImagePanel images={images} onSelect={handleSelectImage} itemComponent={Item} />
                </div>
            </div>
            : <div className="image-drop-zone">
                <DropZone onDrop={setUploadFile} />
                <button type="button" className="image-drop-zone__cancel-button" onClick={() => handleSetIsUploading(false)}>
                    <i className="fas fa-times fa-fw"></i>
                </button>
            </div>
        }
        <div className="form__buttons">
                {!isUploading && <button type="button" className="form__button" onClick={() => handleSetIsUploading(true)}>Upload an Image</button>}
                {uploadFile && <button type="button" className="form__submit" onClick={handleUploadClick}>Upload</button>}
                <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
    </>
}
    
function CatalogImage({image, children, onDelete}) {
    const handleDelete = event => {
        event.stopPropagation();
        onDelete && onDelete(image);
    }

    return <div className="image">
        {children}
        <div className="image__name">{image.name}</div>
        <button type="button" className="image__tool-button" onClick={handleDelete}>
            <i className="fas fa-times fa-fw"></i>
        </button>
    </div>
}

