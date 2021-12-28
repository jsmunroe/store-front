import { forwardRef } from "react";
import Element from "./Element";

const Image = forwardRef(({src, ...props}, ref) => {
    return <Element {...props}>
        <img className="element__image" alt="Content" src={src} ref={ref} />
    </Element>
});

export default Image;