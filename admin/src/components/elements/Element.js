import Image from "./Image";
import Text from "./Text";

export default function Element({type, ...props}) {
    if (type === 'Text') {
        return <Text {...props}/>
    }

    if (type === 'Image') {
        return <Image {...props}/>
    }

    return <></>;
}