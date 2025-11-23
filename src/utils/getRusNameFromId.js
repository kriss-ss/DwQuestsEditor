import {getItems} from "@/utils/getItems.js"

const items = getItems()

export const getRusNameFromId = (id) => {
    if (id === undefined) return "Галочка";

    if (id.startsWith("DwQuests:Gift")) {
        const match = id.match((/Name:\\?"([^"]+)\\?"/));
        return match ? match[1].replaceAll("§r", "") : "Имя";
    }

    if (id.includes("{")) {
        id = id.substring(0, id.indexOf("{"));
    }
    if (id.startsWith("DwQuests:Gift")) {
        const match = id.match((/Name:\\?"([^"]+)\\?"/));
        return match ? match[1] : "Имя1";
    }

    if (!(items.hasOwnProperty(id))) {
        if (id.includes(":")) {
            id = id.substring(0, id.lastIndexOf(":"));
        }
        if (!(items.hasOwnProperty(id))) return "Имя"
    }
    return items[id]["itemName"];
}