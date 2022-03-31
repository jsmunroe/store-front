import { getDownloadURL, getStorage, list, listAll, ref } from "firebase/storage";
import "./app.firebase";

const storage = getStorage();

const imageStoreRef = ref(storage, 'image-store');

export async function listCategories() {
    const res = await listAll(imageStoreRef);

    return res.prefixes.map(prefix => prefix.name);
}

export async function listImages(categoryName, pageSize, pageToken) {
    if (!categoryName) {
        return {
            images: []
        }
    }

    const categoryRef = ref(storage, `image-store/${categoryName}`);
    const res = await list(categoryRef, { maxResults: pageSize, pageToken: pageToken });

    const images = await Promise.all(res.items.map(async item => {
        const source = await getDownloadURL(item);

        const [width, height] = await getDimensions(source);

        var image = {
            name: item.name,
            path: item.fullPath,
            source,
            width, 
            height,
        };

        image.getDimensions = () => getDimensions(source, image);

        return image;
    }));

    return {
        images,
        nextPageToken: res.nextPageToken,
    }
}

function getDimensions(source) {
    const image = new Image();
    var promise = new Promise(resolve => {
        image.addEventListener("load", () => {
            resolve([image.naturalWidth, image.naturalHeight])
        }, { once: true });
    })    
    image.src = source;

    return promise;
}