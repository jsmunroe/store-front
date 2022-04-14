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
    var [category, setCategory] = useState();
    var [selectedTab, setSelectedTab] = useState();
    var [uploadFile, setUploadFile] = useState();

    const handleSelectImage = image => {
        onSubmit && onSubmit(image);
    }

    const handleCancelClick = event => {
        onCancel && onCancel();
    }

    const handleUploadClick = async event => {
        const image = await uploadImage(category, uploadFile);

        onSubmit && onSubmit(image);
    }

    const handleSelectedTabChanged = tabName => {
        setSelectedTab(tabName);
        setUploadFile(null);
    }

    const handleDeleteImage = async image => {
        if (await confirm(`Are you sure you want to remove ${image.name}?`)) {
            await deleteImage(image.path);
        }
    }

    return <Form className="form no-grid image-catalog-form">
        <div className="form__title"><i className="icon-image-list"></i> Image Catalog</div>
    
        <div>{error && <Error message="Error loading catelog categories." />}</div>

        <TabPanel name="action" selectedTabName={selectedTab} onSelectedTabChange={handleSelectedTabChanged}>
            <TabItem name="select" title={<><i className="icon-image-list icon-xs"></i> &nbsp;Images</>}>
                <div className="form__group">
                    <label className="form__label">Category</label>
                    <Select className="form__select" name="category" onSelectionChange={setCategory} placeholder={isLoading ? 'Loading...' : ''}>
                        {data?.map(category => <option key={category} value={category}>{category}</option>)}
                    </Select>
                </div>

                <CatalogImages onSelect={handleSelectImage} onDelete={handleDeleteImage}/>
            </TabItem>
            <TabItem name="catalog" title={<><i className="far fa-caret-square-up fa-xs"></i> &nbsp;Upload</>}>
                <DropZone onDrop={setUploadFile} />
            </TabItem>
        </TabPanel>

        <div className="form__buttons">
            {uploadFile && <button type="button" className="form__submit" onClick={handleUploadClick}>Upload</button>}
            <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
    </Form>
}

function CatalogImages({onSelect, onDelete}) {
    var [category] = useFormState('category');
    var [token, update] = useUpdater();
    var {data, isLoading, error} = useFetch(() => listImages(category), [category, token]);

    if (isLoading) {
        return <Busy />
    }

    const handleDeleteImage = async image => {
        onDelete && await onDelete(image);
        update();
    }

    const { images } = data;
    const Item = ({children, ...props}) => <CatalogImage onDelete={handleDeleteImage} {...props}>{children}</CatalogImage>

    return <div className="image-catalog">
        {error && <Error message="Error loading images." />}

        <div className="image-catalog__item-list">
            <ImagePanel images={images} onSelect={onSelect} itemComponent={Item} />
        </div>
    </div>
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