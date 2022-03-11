import { toBlob } from 'dom-to-image'
import uuid from 'react-uuid';

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

export async function copyElements(elements) {
    if (Array.isArray(elements) && elements.length) {
        const json = new Blob([`SF-Element:${JSON.stringify(elements)}`], {type: 'text/plain'});

        const data = [
            new ClipboardItem({
                [json.type]: json,
            })
        ];

        await navigator.clipboard.write(data);
    }
}

export async function pasteElements() {
    const text = await navigator.clipboard.readText();
    const match = /^SF-Element:(?<json>.*)$/g.exec(text);

    if (!match) {
        return;
    }

    const json = match.groups.json;
    
    if (!json) {
        return;
    }

    const elements = JSON.parse(json);

    if (!elements) {
        return;
    }

    if (!Array.isArray(elements)) {
        return [elements];
    }

    return elements.map(e => ({...e, id: uuid()}));
}

export async function hasElements() {
    const text = await navigator.clipboard.readText();
    const match = /^SF-Element:(?<json>.*)$/g.exec(text);

    return !!match;
}