import { forwardRef } from "react";
import ImageOptionsForm from "../options/ImageOptionsForm";
import Element from "./Element";

const Image = forwardRef(({element, ...props}, ref) => {

    return <Element element={element} optionsForm={ImageOptionsForm} {...props}>
        <img className="element__image" alt="Content" src={element.src} ref={ref} />
    </Element>
});

export default Image;