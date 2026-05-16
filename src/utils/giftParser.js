import {nbtParser} from "@/utils/nbtParser.js";
import {getRusNameFromId} from "@/utils/getRusNameFromId.js";

export const giftStringToObject = (giftID) => {
    let giftNBT = {}
    const nbt = nbtParser(giftID)
    giftNBT.MinRandom = nbt.MinRandom || {"value": 1}
    giftNBT.display = nbt.display || {"Lore": "", "Name": "Гифт"}
    giftNBT.Items = nbt.Items || {}
    giftNBT.DropType = nbt.DropType || "RANDOM"
    giftNBT.Layers = nbt.Layers || [{"value": 0}, {"value": 2}]
    giftNBT.MaxRandom = nbt.MaxRandom || {"value": 2}
    return giftNBT
}

export const getGiftItems = (items) => {
    let gift_items = []
    Object.values(items).forEach((item, index) => {
        let itemID = item.ID
        let itemName = item.Tag?.display?.Name
        let itemCount = 1
        if (item.ID.lastIndexOf("=") !== -1) {
            itemID = item.ID.slice(0, item.ID.lastIndexOf("="));
            itemCount = item.ID.slice(item.ID.lastIndexOf("=") + 1);
        }
        gift_items.push({
            id: itemID,
            num_id: index,
            name: itemName || getRusNameFromId(itemID),
            count: itemCount,
        })
    })

    return gift_items;
}

export const customStringify = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string') return `"${obj}"`;
        return String(obj);
    }

    if (Array.isArray(obj)) {
        const items = obj.map(item => {
            if (typeof item === 'object' && item !== null && 'value' in item) {
                return customStringify(item.value);
            }
            return customStringify(item);
        });
        return `[${items.join(',')}]`;
    }

    const entries = Object.entries(obj).map(([key, value]) => {
        let valStr;
        if (key === 'Items') {
            const items = Object.entries(value).map(([num, item]) => {
                return `${num}:{Slot:${item.Slot.value}b,ID:"${item.ID}"}`;
            });
            valStr = `[${items.join(',')}]`;
        } else if (typeof value === 'object' && value !== null && 'value' in value) {
            valStr = customStringify(value.value);
        } else {
            valStr = customStringify(value);
        }

        const needsQuotes = key.includes(' ') || key.includes(':');
        const keyStr = needsQuotes ? `"${key}"` : key;

        return `${keyStr}:${valStr}`;
    });

    return `{${entries.join(',')}}`;
}