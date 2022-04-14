import { deleteObject, getDownloadURL, getStorage, list, listAll, ref, uploadBytes } from "firebase/storage";
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

        var image = {
            name: item.name,
            path: item.fullPath,
            source
        };

        return image;
    }));

    return {
        images,
        nextPageToken: res.nextPageToken,
    }
}

export async function uploadImage(categoryName, file, overwrite) {
    var metadata = {
        uploaded: new Date().getUTCDate(),
        size: file.size,
        type: file.type,                
    }

    const imageRef = ref(storage, `image-store/${categoryName}/${file.name}`);
    const imageExists = await refExists(imageRef)
    if (!overwrite && imageExists) {
        throw new Error('Image already exists.');
    }

    const result = await uploadBytes(imageRef, file, metadata);

    return {
        name: result.metadata.name,
        path: result.metadata.fullPath,
        source: await getDownloadURL(result.ref),
    };
}

export async function deleteImage(categoryName, imageName) {
    let path = categoryName;
    if (typeof imageName === 'string') {
        path = `image-store/${categoryName}/${imageName}`;
    }

    const imageRef = ref(storage, path);
    
    await deleteObject(imageRef);
} 

export async function refExists(ref) {
    return getDownloadURL(ref)
        .then(url => {
            return Promise.resolve(true);
        })
        .catch(error => {
            if (error.code === 'storage/object-not-found') {
                return Promise.resolve(false);
            } else {
                return Promise.reject(error);
            }
        });
  }