export const useLogger = () => {
    const formatMessage = (log) => {
        const args = log.args
        switch (log.type) {
            case 'initializeEditor': return `Инициализация редактора`;
            case 'handleDrawLine': return `Отрисована линия: \`${args.fromName}\` -> \`${args.toName}\``;
            case 'deleteQuest': return `Удалён квест: \`${args.name}\``;
            case 'dragQuests': return `Перемещены квесты: \`${args.listNames}\``;
            case 'addQuest': return `Добавлен квест`

            case 'editSortIndex': return `Изменён SortIndex: \`${args.value}\``;
            case 'editTabID': return `Изменён editTabID: \`${args.value}\``;
            case 'editTabIcon': return `Изменён editTabIcon: \`${args.value}\``;


            case 'editQuestTitle': return `Изменён QuestTitle: \`${args.value}\``;
            case 'editQuestTitleIcon': return `Изменён QuestTitleIcon: \`${args.value}\``;
            case 'editDisplayX': return `Изменён DisplayX: \`${args.value}\``;
            case 'editDisplayY': return `Изменён DisplayY: \`${args.value}\``;
            case 'editDescription': return `Изменён Description: \n\`\`\`${args.value}\`\`\``;
            case 'editSize': return `Изменён Size: \`${args.value}\``;
            case 'editColor': return `Изменён Color: \`${args.value}\``;
            case 'sortItemsSidebar': return `Отсортированы: \`${args.itemsType}\``;

            case 'addItem': return `Добавлен \`${args.itemType}\``;
            case 'deleteItem': return `Удалён \`${args.itemType}\`\nID: \`${args.id}\``;
            case 'editItemType': return `Изменён \`${args.itemType}\` Type: \`${args.value}\`\nID: \`${args.id}\``;
            case 'editItemItem': return `Изменён \`${args.itemType}\` Item: \`${args.value}\`\nID: \`${args.id}\``;
            case 'editItemCount': return `Изменён \`${args.itemType}\`: \`${args.value}\`\nID: \`${args.id}\``;
            case 'copyItem': return `Скопировано \`${args.itemType}\`: \n\`\`\`${args.value}\`\`\`\nID: \`${args.id}\``;
            case 'pasteItem': return `Вставлено \`${args.itemType}\`: \n\`\`\`${args.value}\`\`\`\nID: \`${args.id}\``;

            case 'editLineType': return `Изменён LineType: \`${args.value}\`\nID: \`${args.id}\``;
            case 'editTasksType': return `Изменён TasksType: \`${args.value}\``;

            case 'addGiftItem': return `Добавлен GiftItem`;
            case 'deleteGiftItem': return `Удалён GiftItem\nID: \`${args.id}\``;
            case 'editGiftName': return `Изменён GiftName: \`${args.value}\`\nID: \`${args.id}\``;
            case 'editGiftLore': return `Изменён GiftLore: \`${args.value}\`\nID: \`${args.id}\``;
            case 'editGiftType': return `Изменён GiftType: \`${args.value}\`\nID: \`${args.id}\``;
            case 'editGiftRandom': return `Изменён GiftRandom: \`${args.value}\`\nТип рандома: \`${args.randomType}\`\nID: \`${args.id}\``;
            case 'editGiftItem': return `Изменён GiftItem: \`${args.value}\`\nID: \`${args.id}\``;

            default: return `Неизвестное действие`;
        }
    }

    const sendLog = (log, tab) => {
        const userToken = localStorage.getItem('userToken');
        fetch('/api/logger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userToken: userToken,
                logText: formatMessage(log),
                rawLog: log,
                tab: tab,
            })
        })
    }

    return { sendLog }
}
