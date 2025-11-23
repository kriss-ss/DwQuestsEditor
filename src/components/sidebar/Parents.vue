<template>
  <div class="sidebar-quest-parents">
    <p class="sidebar-elem-title">Зависимости</p>

    <span class="quest-parents-items">
            <span class="quest-parent-item"
                  v-for="parent in getQuestParents(quest, quests)"
                  :key="parent"
                  :class="'parent-item-' + parent.num_id"
                  @contextmenu.prevent
                  @click.right.shift="sidebarDeleteParent(parent.num_id)"
            >
              <span
                  class="parent-item-data"
              >
                <img class="sidebar-item-icon" @click="showParentPicker($event, editParentItem, parent)" :src="iconByQuestName(parent.name, parent.id, props.tabID)" alt=""/>
                <p class="sidebar-item-name">{{parent.name}}</p>
              </span>
              <SelectButton
                  class="sidebar-medium-button quest-parent-type center"
                  :items="parentTypes"
                  :selected="parent.parentType"
                  @change-select="editParentType($event, parent.num_id)"
              />
              <SelectButton
                  class="sidebar-small-button quest-parent-count center"
                  :items="lineTypes"
                  :selected="parent.lineType"
                  @change-select="editLineType($event, parent.num_id)"
              />
            </span>
          </span>
    <span
        class="sidebar-add-button parent-add center"
        @click="sidebarAddParent()"
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

const sidebarAddParent = () => {
  props.quest.parents.push({"questID": "Выберите зависимость.."})
  saveSnapshot()
}

const sidebarDeleteParent = (id) => {
  props.quest.parents.splice(id, 1)
  saveSnapshot()
}

const showParentPicker = (event, func, data) => {
  props.parentSelector.open(event, (selectedId) => {
    func(data, selectedId);
  });
}

const editParentType = (event, n) => {
  props.quest.parents[n].parentType = event;
  saveSnapshot()
}

const editParentItem = (parent, item) => {
  props.quest.parents[parent.num_id].questID = item
  saveSnapshot()
}

const editLineType = (event, n) => {
  props.quest.parents[n].lineType = event;
  saveSnapshot()
}

</script>


<style scoped>

</style>