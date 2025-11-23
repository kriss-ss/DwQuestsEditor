import {parse} from "nbt-ts";

export const giftStringToObject = (giftID) => {
    let giftNBT = {}
    let nbt = giftID.slice(giftID.indexOf("{"), giftID.lastIndexOf("}") + 1);
    nbt = nbt.replace(/\[/g, "{").replace(/]/g, "}")
        .replace(/Layers:[{\[](\d{1,2})[}\]]/g, 'Layers:[$1]')
        .replace(/Layers:\{(\d{1,2}),(\d{1,2})}/g, 'Layers:[$1,$2]');
    if (!nbt) {
        nbt = "{}"
    }
    nbt = parse(nbt)
    giftNBT.MinRandom = nbt.MinRandom || {"value": 1}
    giftNBT.display = nbt.display || {"Lore": "", "Name": "Гифт"}
    giftNBT.Items = nbt.Items || {}
    giftNBT.DropType = nbt.DropType || "RANDOM"
    giftNBT.Layers = nbt.Layers || [{"value": 0}, {"value": 2}]
    giftNBT.MaxRandom = nbt.MaxRandom || {"value": 2}
    return giftNBT
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