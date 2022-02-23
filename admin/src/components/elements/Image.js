import { useState } from "react";
import { useEffect } from "react";
import { forwardRef } from "react";
import { useClass } from "../../utils/htmlHelpers";
import ImageOptionsForm from "../options/ImageOptionsForm";
import ElementBase from "./ElementBase";

const Image = forwardRef(({element, ...props}, ref) => {
    const [hasError, setHasError] = useState(element.src === '');
    const [badSource, setBadSource] = useState();

    useEffect(() => {
        if (element.src === '' || element.src === badSource) {
            setHasError(true);
        } else {
            setHasError(false);
        }

    }, [element, element.src, badSource])

    const handleError = event => {
        setBadSource(element.src);
        setHasError(true);
    }  

    return <ElementBase element={element} optionsForm={ImageOptionsForm} {...props}>
        <img className={`element__image ${useClass(hasError, 'error')}`} alt="Element" src={element.src} ref={ref} onError={handleError} />
        {hasError && <div className="element__error"><p className="">Image source cannot be found.</p></div>}
    </ElementBase>
});

export default Image;