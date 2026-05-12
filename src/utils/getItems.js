const cache = new Map()

const loadJson = async (url) => {
    if (cache.has(url)) {
        return cache.get(url)
    }

    const promise = fetch(url)
        .then(response => {
            return response.json()
        })

    cache.set(url, promise)

    return promise
}

export const getItems = () =>
    loadJson('/items/items.json')

export const getItemsNames = () =>
    loadJson('/items/itemsNamesIcons.json')