import { useState } from "react";
import { useEffect } from "react";
import { useClass } from "../../utils/htmlHelpers";

export default function Image({element}) {
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

    return <>
        <img className={`element__image ${useClass(hasError, 'error')}`} alt="Element" src={element.src} onError={handleError} />
        {hasError && <div className="element__error"><p className="">Image source cannot be found.</p></div>}
    </>
}