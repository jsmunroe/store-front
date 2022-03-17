const catalogs = {};

export default function useCatalog(name) {
    const catalog = catalogs[name] ?? (catalogs[name] = {});

    return {
        getValue: key => catalog[key],
        setValue: (key, value) => catalog[key] = value,
        removeValue: key => delete catalog[key],
    }
}