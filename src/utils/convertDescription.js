import {mcFormats, mcColors} from "@/constants/questConstants.js";

export const convertDescription = (text) => {
    return text
        .replace(/§([0-9a-f])/g, (match, color, content) => {
            const colorCode = mcColors[color] || "#FFFFFF";
            return `<span style="color: ${colorCode}">`;
        })
        .replace(/§([lomnk])/g, (match, format, content) => {
            const formatCode = mcFormats[format] || "";
            return `<span class="${formatCode}">`;
        })
        .replace(/§r/g, `</span><span class="none-format">`)
        .replace("<BR>", '<br>&emsp;') // Самый первый <BR>
        .replace(/<IMG>.*<\/IMG>/g, '<br>&emsp;')
        .replace(/<BR>/g, '<br><br>&emsp;')
        .replace(/<RI>/g, '&emsp;')
        .replace(/\n/g, '<br>');
}