import {parse} from "nbt-ts";

export const nbtParser = (nbt) => {
    nbt = nbt.replace(/\[/g, "{").replace(/]/g, "}")
             .replace(/\\n/g, "\n")
             .replace(/Layers:[{\[](\d{1,2})[}\]]/g, 'Layers:[$1]')
             .replace(/Layers:\{(\d{1,2}),(\d{1,2})}/g, 'Layers:[$1,$2]');
    nbt = parse(nbt)
    return nbt
}

