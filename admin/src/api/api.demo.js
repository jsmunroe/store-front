import demoJson from './demo';

const demoStore = (() => {
    const localStorageKey = 'demoStorageObject';
    let cache = loadStore();

    function loadStore() {
        const json = localStorage.getItem(localStorageKey);

        if (!json) {
            return demoJson;
        }

        return JSON.parse(json);
    }

    function saveStore(store) {
        cache = store;
        const json = JSON.stringify(store);
        localStorage.setItem(localStorageKey, json);
    }

    function makeDoc(path, id, data=null) {
        return {
            path: path.join('/'),
            id,
            type: 'doc',
            data,
            exists: !!data,
        }
    }

    function makeCollection(path, data={}) {
        return {
            path: path.join('/'),
            type: 'collection',
            data: Object.keys(data).map(key => makeDoc([...path, key], key, data[key].data)),
            exists: !!data.length
        }  
    }

    function getDoc(path) {
        if (path.length % 2 !== 0) {
            throw new Error('Given path does not reference a document.');
        }

        let [next, ...rest] = path;
        let collectionNode = cache[next];
        let docNode = null;
        let result = makeDoc(path);
        
        while (rest.length > 0) {
            if (!collectionNode) {
                break;
            }

            // Collection -> Document
            ([next, ...rest] = rest);

            docNode = collectionNode[next];
            if (!docNode) {
                break;
            }

            if (rest.length <= 0) {
                result = makeDoc(path, next, docNode.data);
                break;
            }

            // Document -> Collection
            ([next, ...rest] = rest);

            collectionNode = docNode?.collections[next];
            
            if (!collectionNode) {
                break;
            }
        }

        return result;
    }    

    function getCollection(path) {
        if (path.length % 2 !== 1) {
            throw new Error('Given path does not refernce a collection.');
        }
        let [next, ...rest] = path;
        let collectionNode = cache[next];
        let docNode = null;
        let result = makeCollection(path);
        
        if (rest.length <= 0) {
            result = makeCollection(path, collectionNode);
        }

        while (rest.length > 0) {
            if (!collectionNode) {
                break;
            }

            // Collection -> Document
            ([next, ...rest] = rest);

            docNode = collectionNode[next];
            if (!docNode) {
                break;
            }

            if (rest.length <= 0) {
                break;
            }

            // Document -> Collection
            ([next, ...rest] = rest);

            collectionNode = docNode?.collections[next];
            
            if (!collectionNode) {
                break;
            }

            if (rest.length <= 0) {
                result = makeCollection(path, collectionNode);
            }
        }

        return result;
    }

    function addDoc(path, doc, id) {
        if (path.length % 2 !== 1) {
            throw new Error('Given path does not reference a collection.');
        }

        if (!id) {
            id = generateId();
        }

        let [next, ...rest] = path;
        let collectionNode = cache[next];
        let docNode = null;

        if (!collectionNode) {
            collectionNode = cache[next] = { }
        }
        
        while (rest.length > 0) {
            if (!collectionNode) {
                break;
            }

            // Collection -> Document
            ([next, ...rest] = rest);

            docNode = collectionNode[next];
            if (!docNode) {
                docNode = collectionNode[next] = {
                    data: rest.length <= 0 ? doc : { },
                    collections: { },
                };
            }

            if (rest.length <= 0) {
                collectionNode[next] = {
                    data: doc,
                    collections: { },
                };
                break;
            }

            // Document -> Collection
            ([next, ...rest] = rest);

            collectionNode = docNode.collections[next];
            
            if (!collectionNode) {
                collectionNode = docNode.collections[next] = { }
            }

            if (rest.length <= 0) {
                collectionNode[id] = {
                    data: doc,
                    collections: { },
                };
            }
        }

        saveStore(cache);
        return id;
    }


    function setDoc(path, doc, options) {
        if (path.length % 2 !== 0) {
            throw new Error('Given path does not reference a document.');
        }

        let [next, ...rest] = path;
        let collectionNode = cache[next];
        let docNode = null;

        if (!collectionNode) {
            collectionNode = cache[next] = { }
        }
        
        while (rest.length > 0) {
            if (!collectionNode) {
                break;
            }

            // Collection -> Document
            ([next, ...rest] = rest);

            docNode = collectionNode[next];
            if (!docNode) {
                docNode = collectionNode[next] = {
                    data: rest.length <= 0 ? doc : { },
                    collections: { },
                };
            }

            if (rest.length <= 0) {
                docNode.data = options?.merge ? {...docNode.data, ...doc} : doc;
                break;
            }

            // Document -> Collection
            ([next, ...rest] = rest);

            collectionNode = docNode.collections[next];
            
            if (!collectionNode) {
                collectionNode = docNode.collections[next] = { }
            }
        }

        saveStore(cache);
    }

    function deleteDoc(path) {
        if (path.length % 2 !== 0) {
            throw new Error('Given path does not reference a document.');
        }

        let [next, ...rest] = path;
        let collection = cache[next];
        let doc = null;

        if (!collection) {
            collection = cache[next] = { }
        }
        
        while (rest.length > 0) {
            if (!collection) {
                break;
            }

            // Collection -> Document
            ([next, ...rest] = rest);

            doc = collection[next];
            if (!doc) {
                break;
            }

            if (rest.length <= 0) {
                delete collection[next];
                break;
            }

            // Document -> Collection
            ([next, ...rest] = rest);

            collection = doc.collections[next];
            
            if (!collection) {
                break;
            }
        }

        saveStore(cache);
    }

     function generateId() {
        // Modeled after base64 web-safe chars, but ordered by ASCII.
        const chars = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
           
        let now = new Date().getTime();
        const timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = chars.charAt(now % 64);
            now = Math.floor(now / 64);
        }
    
        let id = timeStampChars.join('');
        
        const lastRandChars = [];
        for (i = 0; i < 12; i++) {
            lastRandChars[i] = Math.floor(Math.random() * 64);
        }

        for (i = 0; i < 12; i++) {
            id += chars.charAt(lastRandChars[i]);
        }
    
        return id;
      }

    return {
        getDoc,
        getCollection,
        addDoc,
        setDoc,
        deleteDoc,
        makeDoc,
        makeCollection
    }
})();


/* AUTH */
let onAuthStateChanged_subs = [];

const localAuthStateKey = 'demoAuthState';

let user = loadAuthState();

function loadAuthState() {
    const json = localStorage.getItem(localAuthStateKey);

    if (!json) {
        return demoJson;
    }

    return JSON.parse(json);
}

function saveAuthState(authState) {
    user = authState;
    const json = JSON.stringify(authState);
    localStorage.setItem(localAuthStateKey, json);
}

export function onAuthStateChanged(onNext) {   
    if (!onAuthStateChanged_subs.length) {
        setTimeout(() => {
            onNext(user)
        }, 500);
    }

    onAuthStateChanged_subs.push(onNext);
    return () => onAuthStateChanged_subs = onAuthStateChanged_subs.filter(s => s !== onNext);
}

export async function signInWithEmailAndPassword(email, password) {
    saveAuthState({
        uid: email,
        email,
    });

    onAuthStateChanged_subs.forEach(s => s(user));
}

export async function signOut() {
    saveAuthState(null);

    onAuthStateChanged_subs.forEach(s => s(user));
}

/* FIRESTORE */

export function path(path) {
    if (arguments.length === 1 && typeof path === "string") {
        return path.split('/');
    }

    return Array.from(arguments);
}

export async function getDoc(path) {
    return demoStore.getDoc(path);
}

export async function getCollection(path) {
    return demoStore.getCollection(path);
}

export async function readDoc(path) {
    return read(await getDoc(path));
}

export async function readCollection(path) {
    return readAll(await getCollection(path));
}

export async function setDoc(path, data, options) {
    demoStore.setDoc(path, data, options);
}

export async function addDoc(path, data, id=null) {
    id = demoStore.addDoc(path, data, id);
}

export async function deleteDoc(path) {
    demoStore.deleteDoc(path);
}

export function exists(snapshot) {
    return snapshot?.exists === true;
}

// Read the data from a firebase document and append the id.
export function read({id, data}) {
    return {...data, id};
}

export function readAll({data}) {
    return data.map(read);
}