import { forwardRef } from "react";
import Element from "./Element";

const Image = forwardRef(({element, ...props}, ref) => {

    return <Element element={element} {...props}>
        <img className="element__image" alt="Content" src={element.src} ref={ref} />
    </Element>
});

export default Image;