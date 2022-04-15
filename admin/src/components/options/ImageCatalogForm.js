import { deleteImage, listCategories, listImages, uploadImage } from "../../api/images.firebase";
import { confirm } from "../Modal";
import useFetch from "../../hooks/useFetch";
import { useFormState } from "../../hooks/useFormState";
import { useDropzone } from 'react-dropzone'
import useBusy from "../../hooks/useBusy";

import { Form, Select } from "../controls";
import Error from "../Error";
import Busy from "../Busy";
import ImagePanel from "../ImagePanel";

import './ImageCatalogForm.scss';
import { classIf } from "../../utils/htmlHelpers";

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
    const [category] = useFormState('category');
    const {data, isLoading, error, refresh} = useFetch(() => listImages(category), [category]);
    const {isBusy, busyWhile} = useBusy();

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop: files => handleDrop(files), 
        noClick: true
    });

    const handleSelectImage = image => {
        onSelect && onSelect(image);
    }

    const handleCancelClick = event => {
        onCancel && onCancel();
    }

    const handleDrop = async (files) => {
        await busyWhile(async () => {
            await Promise.all(files.map(file => uploadImage(category, file)))
            
            refresh();
        });
    }

    const handleDeleteImage = async image => {
        if (await confirm(`Are you sure you want to remove ${image.name}?`)) {
            await busyWhile(async () => {
                await deleteImage(image.path);
            });

            refresh();
        }
    }

    const handleUploadClick = event => {
        open();
    }

    const { images } = data ?? { images: [] };
    const Item = ({children, ...props}) => <CatalogImage onDelete={handleDeleteImage} {...props}>{children}</CatalogImage>

    return <>
        <div className={`drop-zone ${classIf(isDragActive, 'active')}`}>
            {/* <input {...getInputProps()} /> */}

            <div className="image-catalog">
                {error && <Error message="Error loading images." />}

                <div className="image-catalog__item-list">
                    <ImagePanel images={images} onSelect={handleSelectImage} itemComponent={Item} />
                </div>
            </div>
        </div>
        <div className="form__buttons">
            <button type="button" className="form__button" onClick={handleUploadClick}>Upload an Image</button>
            <button type="button" className="form__button" onClick={handleCancelClick}>Cancel</button>
        </div>
        {(isLoading || isBusy) && <div className="image-catalog__busy">
            <Busy/>
        </div>}
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
        <button type="button" className="image__tool-button" onMouseDown={handleDelete}>
            <i className="fas fa-times fa-fw"></i>
        </button>
    </div>
}

