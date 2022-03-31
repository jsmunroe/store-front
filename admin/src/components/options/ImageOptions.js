import { useModal } from "../Modal";

import { TabItem, TabPanel } from "../controls/TabPanel";
import ImageCatalogForm from "./ImageCatalogForm";
import TextBox from "../controls/TextBox";
import { useFormState } from "../../hooks/useFormState";

export default function ImageOptions() {
    const modal = useModal();
    const [,setImageRef] = useFormState("image-ref");
    const [,setSrc] = useFormState("src");
    
    const handleBrowseCatalogClick = async event => {
        const image = await modal.show(ImageCatalogForm);

        if (image) {
            setImageRef(image.path);
            setSrc(image.source);
        }
    }

    return <>
        <div className="form__title"><i className="icon-image"></i> Image Properties</div>

        <TabPanel name="image-source-type" title="Image Source">
            <TabItem name="url" title={<><i className="fas fa-link fa-xs"></i> &nbsp;URL</>}>
                <label className="form__label">URL</label>
                <TextBox className="form__input" name="src" required />
            </TabItem>
            <TabItem name="catalog" title={<><i className="icon-image-list icon-xs"></i> &nbsp;Catalog</>}>
                <label className="form__label">Catalog Reference</label>
                <div className="button-group">
                    <TextBox className="form__input" name="image-ref" placeholder="Click browse to select an image. 🡒" required readOnly/>
                    <button type="button" className="button-group__button" onClick={handleBrowseCatalogClick}>Browse...</button>
                </div>
            </TabItem>
        </TabPanel>
    </>;
}
