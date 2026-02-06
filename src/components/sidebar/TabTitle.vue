<template>
  <div class="sidebar-tab-title">
    <input class="tab-title-name"
           :value="tab.tabID"
           @change="editTabID"
           title="Название вкладки (ID)"
    >
    <div
        class="tab-title-icon"
        @click="showItemPicker($event, editTabIcon, 'NaN')"
    >
      <img loading="lazy" class="sidebar-item-icon" :src="iconById(tab.iconItem)" alt="./assets/icons/minecraft/bedrock.png"/>
    </div>
  </div>
</template>

<script setup>
import {iconById} from "@/utils/getIcon.js";
import {inject} from "vue";

const props = defineProps({
  tab: {
    type: Object,
    required: true,
  },
  itemSelector: {
    type: Object,
    required: true,
  }
})

const saveSnapshot = inject('saveSnapshot')

const editTabID = (event) => {
  props.tab.tabID = event.target.value
}

const editTabIcon = (TabIcon, item) => {
  props.tab.iconItem = item;
  saveSnapshot()
}
const showItemPicker = (event, func, data) => {
  props.itemSelector.open(event, (selectedId) => {
    func(data, selectedId);
  });
}
</script>

<style scoped>

.tab-title-icon {
  margin-left: 0.5rem
}

.tab-title-name {
  width: 18rem;
  font-size: 1.5rem;
  font-weight: bold;
  /*text-align: center;*/
  background: transparent;
}


</style>