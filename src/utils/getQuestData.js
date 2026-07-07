import {
    iconSize,
    scaleField,
    questNodesOffset,
    specialIconSizes,
    questRarities,
    defaultIcon, defaultID
} from "@/constants/questConstants.js";
import {getRusNameFromId} from "@/utils/getRusNameFromId.js";
import {getItems} from "@/utils/getItems.js";
import {nbtParser} from "@/utils/nbtParser.js";
import {getGiftItems} from "@/utils/giftParser.js";


export const getDisplayName = (quest) => {
    return quest.displayName
}

export const getPosQuest = (quest) => {
    let posX = quest.displayX * scaleField - (getQuestSize(quest) - 1) * iconSize / 2 + questNodesOffset * 2
    let posY = quest.displayY * scaleField - (getQuestSize(quest) - 1) * iconSize / 2 + questNodesOffset

    return {x: posX, y: posY};
}

export const getQuestSize = (quest) => {
    return specialIconSizes[quest.iconSize || "DEFAULT"];
}

export const getQuestColor = (quest) => {
    return questRarities[quest.rarity || "UNCOMMON"];
}

export const getQuestDescription = (quest) => {
    return quest.description;
}

export const getQuestTasks = (quest) => {
    if (!("tasks" in quest)) return []
    let tasks = quest.tasks;
    let formated_tasks = []
    Object.keys(tasks).forEach(key => {
        let task = tasks[key]

        formated_tasks.push({
            num_id: key,
            id: task.forgeName || "DwQuests:StarAtlas",
            name: task.customDescription || task.displayName || getRusNameFromId(task.forgeName),
            type: task.type,
            count: task.requiredCount,
            hasCustomDescription: !!task.customDescription
        })
    })

    return formated_tasks
}

export const getQuestRewards = (quest) => {
    if (!("rewards" in quest)) return []
    let rewards = quest.rewards;
    let formated_rewards = []
    let n = 0
    rewards.forEach(reward => {
        let index_count = reward.lastIndexOf("=");
        let index_nbt = reward.lastIndexOf("}");

        let nbt = getItemHover(reward)

        if (index_count === -1 || index_count < index_nbt) {
            formated_rewards.push({
                id: reward,
                name: getRusNameFromId(reward),
                count: 1,
                data: nbt,
                num_id: n++
            })
        } else {
            formated_rewards.push({
                id: reward.substring(0, index_count),
                name: getRusNameFromId(reward.substring(0, index_count)),
                count: parseInt(reward.substring(index_count + 1)),
                data: nbt,
                num_id: n++
            })
        }
    })

    return formated_rewards
}

export const getQuestParents = (quest, quests) => {
    if (!("parents" in quest)) return []
    let parents = quest.parents;

    let formated_parents = []

    let n = 0
    parents.forEach(parent => {
        let quest_id = quests[parent.questID]?.iconItem || defaultID
        formated_parents.push({
            id: quest_id,
            num_id: n++,
            name: parent.questID,
            questName: quests[parent.questID]?.displayName,
            lineType: parent.lineType || "DEFAULT",
            parentType: parent.parentType || "Обычная",
        })

    })
    return formated_parents
}

const getItemHover = (item) => {
    const items = getItems()

    let hoverItemID = item
    if (~item.indexOf("{")) {
        hoverItemID = item.slice(0, item.indexOf("{"))
    }
    if (~item.indexOf("=")) {
        hoverItemID = item.slice(0, item.lastIndexOf("="));
    }

    let hoverItemMod = hoverItemID.slice(0, item.indexOf(":"));
    let nbt = item.slice(item.indexOf("{"), item.lastIndexOf("}") + 1).replace(/\[/, "{").replace(/]/, "}")

    if (~nbt.indexOf("DropType")) {
        nbt = nbtParser(nbt)
        let giftItems = ""
        getGiftItems(nbt.Items).forEach(item => {
            giftItems += "&emsp;- " + item.name + "§7 x" + item.count + "\n";
        });
        let itemsCount = ""
        if (typeof nbt.MaxRandom?.value === "undefined") {
            itemsCount = "Содержит все предметы"
        } else if (nbt.MinRandom.value === nbt.MaxRandom.value) {
            itemsCount = `Содержит ${nbt.MinRandom.value} случайный предмет`
        } else if (nbt.MaxRandom.value === 1) {
            itemsCount = "Содержит 1 случайный предмет"
        } else {
            itemsCount = `Содержит от ${nbt.MinRandom?.value} до ${nbt.MaxRandom?.value} случайных предметов`
        }

        const lore = nbt.display.Lore.replace(/\/\//g, "/")

        return `${nbt.display.Name} §r7318§7\n${lore}§7\n\n${itemsCount}\n${giftItems}§o§9Dwarven Quests`
    } else if (~item.indexOf("ScriptedData")) {
        return ""
    } else if (~item.indexOf("{")) {
        nbt = nbtParser(nbt)
        let itemName = nbt?.display?.Name
        let itemLore = ""
        if (nbt?.display?.Lore) {
            itemLore = Object.values(nbt?.display?.Lore).join("\n")
        }

        return `${itemName} §r${items[hoverItemID]?.itemId}§7\n${itemLore}\n§o§9${hoverItemMod}`

    }
    return `${getRusNameFromId(hoverItemID)} §r${items[hoverItemID]?.itemId}§7\n§o§9${hoverItemMod}`
}

export const getIconItem = (quest) => {
    return quest.iconItem || defaultIcon;
}
