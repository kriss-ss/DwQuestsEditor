import {defaultIcon} from "@/constants/questConstants.js";
import questIcons from '@/assets/json/iconsList/questNamesIcons.json'
import itemsIcons from '@/assets/json/iconsList/itemsNamesIcons.json'


export const iconById = (id) => {
    if (!id) return new URL('/icons/' + defaultIcon, import.meta.url).href
    if (id.includes("{")) {
        id = id.substring(0, id.indexOf("{"));
    }
    id = id.split(":")
    if (id.length === 1) return new URL('/icons/' + defaultIcon, import.meta.url).href;
    let mod = id[0].replaceAll(' ', '_').replaceAll("?", "$4$").replaceAll("|", "$8$")
    let name = id[1].replaceAll(' ', '_').replaceAll("?", "$4$").replaceAll("|", "$8$")
    let meta = null
    if (id.length > 2) {
        meta = id[2]
    }

    let idIcon = mod + "/" + name + (meta ? "_" + meta : "");
    if (itemsIcons.includes(idIcon)) {
        return new URL('/icons/' + idIcon + ".png", import.meta.url).href;
    }

    let idIconNoMeta = mod + "/" + name;
    if (itemsIcons.includes(idIconNoMeta)) {
        return new URL('/icons/' + idIconNoMeta + ".png", import.meta.url).href;
    }

    return new URL('/icons/' + defaultIcon, import.meta.url).href;
}

export const iconByQuestName = (name, iconItem, tabID) => {

    if (iconItem && !(iconItem.includes("{"))) {
        let itemNameIcon = itemNameToFile(iconItem)
        if (itemsIcons.includes(itemNameIcon)) {
            return new URL('/icons/' + itemNameIcon + ".png", import.meta.url).href;
        }
    }

    tabID = tabID.replaceAll(' ', '_');
    let questName = name.replaceAll(' ', '_').replaceAll("?", "&1");
    let questNamesPath = tabID + "." + questName;
    if (questIcons.includes(questNamesPath)) {
        return new URL('/tabs_icons/' + questNamesPath + ".png", import.meta.url).href;
    }
    return iconById(iconItem);
}

const itemNameToFile = (itemName) => {
    if (itemName.includes("{")) {
        itemName = itemName.substring(0, itemName.indexOf("{"));
    }
    itemName = itemName.split(":")
    let mod = itemName[0]
    let name = itemName[1]
    if (itemName.length > 2) {
        name = name + "_" + itemName[2]
    }

    mod = mod.replaceAll(' ', '_');
    name = name.replaceAll(' ', '_').replaceAll("?", "&1");

    return mod + "/" + name
}
