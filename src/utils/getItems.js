import { shallowReactive } from 'vue';

const state = shallowReactive({
    items: [],
    names: []
});

export const initItemsData = async () => {
    const response = await fetch('/items/items.json');
    state.items = await response.json();
    return state.items;
};

export const initItemsNamesData = async () => {
    const response = await fetch('/items/itemsNamesIcons.json');
    state.names = await response.json();
    return state.names;
};

export const getItems = () => {
    return state.items;
};

export const getItemsNames = () => {
    return state.names;
};