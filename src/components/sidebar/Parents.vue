<template>
  <div
      class="sidebar-quest-parents"
      @click.right.exact="showContextMenu($event, null)"
      @contextmenu.prevent
  >
    <div class="sidebar-elem-title">
      <p>Зависимости</p>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="title-icon">
        <title>В режиме редактирования можно проводить линии от одного квеста к другому, зажимая Shift+ЛКМ. Таким образом создавая новые зависимости</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 17l0 .01" />
        <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />
      </svg>
    </div>

    <span class="quest-parents-items">
            <span class="quest-parent-item sidebar-item"
                  v-for="parent in getQuestParents(quest, quests)"
                  :key="parent"
                  :class="'parent-item-' + parent.num_id"
                  @contextmenu.prevent
                  @click.right.exact.stop="showContextMenu($event, parent)"
                  @click.right.shift="sidebarDeleteParent(parent)"
            >
              <span
                  class="parent-item-data"
              >
                <img loading="lazy" class="sidebar-item-icon" @click="showParentPicker($event, editParentItem, parent)" :src="iconByQuestName(parent.name, parent.id, props.tabID)" alt=""/>
                <p class="sidebar-item-name">{{parent.questName || parent.name}}</p>
              </span>
              <SelectButton
                  class="sidebar-medium-button quest-parent-type center"
                  :items="parentTypes"
                  :selected="parent.parentType"
                  @change-select="editParentType($event, parent.num_id)"
                  title="Тип зависимости"
              />
              <SelectButton
                  class="sidebar-small-button quest-parent-count center"
                  :items="lineTypes"
                  :selected="parent.lineType"
                  @change-select="editLineType($event, parent.num_id)"
                  title="Направление линии"
              />
            </span>
          </span>
    <span
        class="sidebar-add-button parent-add center"
        @click="sidebarAddParent()"
        title="Добавить зависимость"
    >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.6665 11H20.3332" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11 1.6665V20.3332" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          </span>
  </div>
</template>


<script setup>
import SelectButton from "@/components/ui/SelectButton.vue";
import {parentTypes, lineTypes} from "@/constants/questConstants.js";
import {getQuestParents} from "@/utils/getQuestData.js";
import {iconByQuestName} from "@/utils/getIcon.js";
import {inject} from "vue";

const props = defineProps({
  quest: {
    type: Object,
    required: true,
  },
  parentSelector: {
    type: Object,
    required: true,
  },
  quests: {
    type: Object,
    required: true,
  },
  tabID: {
    type: String,
    required: true
  }
})

const saveSnapshot = inject('saveSnapshot')
const active_quest = inject('active_quest')
const contextMenu = inject('contextMenu')
const buffer = inject("buffer")

const showContextMenu = (event, item) => {
  const options = {
    "Копировать": item != null ? copy : null,
    "Вставить": buffer.value['Зависимости'].length !== 0 ? paste : null,
    "Удалить": item != null ? sidebarDeleteParent : null,
  }
  const title = buffer.value['Зависимости'][0]?.name
  contextMenu.value.openContextMenu(event, item, options, title)
}

const copy = (item) => {
  buffer.value["Зависимости"][0] = item
  saveSnapshot({type: 'copyItem', args: {itemType: 'Parent', value: JSON.stringify(item), id: item.num_id, name: active_quest.value}})
}

const paste = (item) => {
  const new_item = buffer.value["Зависимости"][0]
  const new_index = item !== null ? parseInt(item.num_id) + 1 : props.quest.parents.length

  const new_parent = {
    'questID': new_item.name,
    'lineType': new_item.lineType,
    'parentType': new_item.parentType,
  }
  props.quest.parents.splice(new_index, 0, new_parent)
  saveSnapshot({type: 'pasteItem', args: {itemType: 'Parent', value: JSON.stringify(new_item), id: new_index, name: active_quest.value}})
}

const sidebarAddParent = () => {
  props.quest.parents.push({"questID": "Выберите зависимость.."})
  saveSnapshot({type: 'addItem', args: {itemType: 'Parent', name: active_quest.value}})
}

const sidebarDeleteParent = (parent) => {
  props.quest.parents.splice(parent.num_id, 1)
  saveSnapshot({type: 'deleteItem', args: {itemType: 'Parent', id: parent.num_id, name: active_quest.value}})
}

const showParentPicker = (event, func, data) => {
  props.parentSelector.open(event, (selectedId) => {
    func(data, selectedId);
  });
}

const editParentType = (event, n) => {
  props.quest.parents[n].parentType = event;
  saveSnapshot({type: 'editItemType', args: {itemType: 'Parent', value: event, id: n, name: active_quest.value}})
}

const editParentItem = (parent, item) => {
  props.quest.parents[parent.num_id].questID = item
  saveSnapshot({type: 'editItemItem', args: {itemType: 'Parent', value: item, id: parent.num_id, name: active_quest.value}})
}

const editLineType = (event, n) => {
  props.quest.parents[n].lineType = event;
  saveSnapshot({type: 'editLineType', args: {value: event, id: n, name: active_quest.value}})
}

</script>


<style scoped>

.title-icon {
  transition: all 0.2s ease;
}

.title-icon:hover {
  stroke: var(--special);
}

</style>