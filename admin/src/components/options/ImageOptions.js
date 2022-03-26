import { TabItem, TabPanel } from "../controls/TabPanel";
import TextBox from "../controls/TextBox";

export default function ImageOptions() {
    return <>
        <div className="form__title"><i className="icon-image"></i> Image Properties</div>

        <TabPanel name="image-source-type" title="Image Source">
            <TabItem name="url" title={<><i className="fas fa-link fa-xs"></i> &nbsp;URL</>}>
                <div className="form__label">URL</div>
                <TextBox className="form__input" name="src" required />
            </TabItem>
            <TabItem name="catalog" title={<><i className="icon-image-list icon-xs"></i> &nbsp;Catalog</>}>
                <div className="form__label">Catalog Reference</div>
                <div className="button-group">
                    <TextBox className="form__input" name="ref" placeHolder="Click browse to select an image. 🡒" required readOnly/>
                    <button type="button" className="button-group__button">Browse...</button>
                </div>
            </TabItem>
        </TabPanel>
    </>;
}
