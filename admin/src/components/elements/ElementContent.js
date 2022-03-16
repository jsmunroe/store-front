import Image from "./Image";
import Text from "./Text";

export default function ElementContent({element}) {
    if (element?.type === 'Text') {
        return <Text element={element}/>
    }

    if (element?.type === 'Image') {
        return <Image element={element}/>
    }

    return <></>;
}