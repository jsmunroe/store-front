import { toBlob } from 'dom-to-image'

const { ClipboardItem, Blob } = window;

export async function copyElement({element, domElement}) {
    if (domElement && element) {
        const image = await toBlob(domElement);
        const json = new Blob([`SF-Element:${JSON.stringify(element)}`], {type: 'text/plain'});

        const data = [
            new ClipboardItem({
                [image.type]: image, 
                [json.type]: json,
            })
        ];

        await navigator.clipboard.write(data);
    }
}

export async function pastElement() {
    const text = await navigator.clipboard.readText();
    const match = /^SF-Element:(?<json>.*)$/g.exec(text);

    if (!match) {
        return;
    }

    const json = match.groups.json;
    
    if (!json) {
        return;
    }

    const element = JSON.parse(json);

    if (!element) {
        return;
    }

    return element;
}