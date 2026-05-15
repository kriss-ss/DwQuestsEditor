import {defaultIcon} from "@/constants/questConstants.js";
import {getItemsNames} from "@/utils/getItems.js";

export const getIcon = (id) => {
    const itemsNames = getItemsNames();

    if (itemsNames.length === 0) {
        return new URL('/icons/' + defaultIcon, import.meta.url).href;
    }

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

    if (meta === "*") meta = null

    let idIcon = mod + "/" + name + (meta ? "_" + meta : "");
    if (itemsNames.includes(idIcon)) {
        return new URL('/icons/' + idIcon + ".png", import.meta.url).href;
    }

    let idIconNoMeta = mod + "/" + name;
    if (itemsNames.includes(idIconNoMeta)) {
        return new URL('/icons/' + idIconNoMeta + ".png", import.meta.url).href;
    }

    let idLikeWithMeta = itemsNames.find(icon => icon.startsWith(idIconNoMeta));
    if (idLikeWithMeta) return new URL('/icons/' + idLikeWithMeta + ".png", import.meta.url).href;

    return new URL('/icons/' + defaultIcon, import.meta.url).href;
}
