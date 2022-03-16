import ImageOptions from "./ImageOptions";
import TextOptions from "./TextOptions";

export default function ElementOptionsFormContent({type, ...props}) {

    if (type === 'Text') {
        return <TextOptions {...props}/>
    }

    if (type === 'Image') {
        return <ImageOptions {...props}/>
    }

    return <></>

}