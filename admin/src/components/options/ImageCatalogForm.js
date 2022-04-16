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
import { callWith, classIf } from "../../utils/htmlHelpers";
import useRefresh from "../../hooks/useRefresh";
import useStateList from "../../hooks/useStateList";

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
    const selectedImages = useStateList();

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

    const handleItemSelect = (event, image) => {
        if (event.ctrlKey) {
            isSelected(image) ? selectedImages.add(image) : selectedImages.remove(i => i === image);
        }
        else {
            selectedImages.clear();
            !isSelected(image) && selectedImages.add(image);
        }
    }

    const handleClearItemSelection = event => {
        selectedImages.clear();
    }

    const handleUploadClick = event => {
        open();
    }

    const isSelected = image => selectedImages.items.some(i => i === image);

    let { images } = data ?? { images: [] };
    images.forEach(image => image.isSelected = isSelected(image));

    const Item = ({children, ...props}) => <CatalogImage onSelect={handleItemSelect} {...props}>{children}</CatalogImage>

    return <>
        <div className={`image-catalog drop-zone ${classIf(isDragActive, 'active')}`} {...getRootProps()}>
            <input {...getInputProps()} />

            <div className="image-catalog" onClick={handleClearItemSelection}>
                {error && <Error message="Error loading images." />}

                <div className="image-catalog__item-list">
                    <ImagePanel images={images} itemComponent={Item} />
                </div>
            </div>

            <div className="drop-zone__overlay">Drop the image here to add it to this category.</div>
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
    
function CatalogImage({image, children, onSelect}) {
    const [refresh] = useRefresh();

    const handleClick = (event, image) => {
        event.stopPropagation();
        onSelect && onSelect(event, image);
        refresh();
    }

    return <div className={`item ${classIf(image.isSelected, 'selected')}`} onClick={callWith(handleClick, image)}>
        <div className="item__image">
            {children}
        </div>
        <div className="item__name">{image.name}</div>
    </div>
}

