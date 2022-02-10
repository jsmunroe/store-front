import { forwardRef } from "react";
import ImageOptionsForm from "../options/ImageOptionsForm";
import ElementBase from "./ElementBase";

const Image = forwardRef(({element, ...props}, ref) => {

    return <ElementBase element={element} optionsForm={ImageOptionsForm} {...props}>
        <img className="element__image" alt="Content" src={element.src} ref={ref} />
    </ElementBase>
});

export default Image;