<template>
  <div class="sidebar-tab-info">
    <div class="tab-info-count-quests">Всего квестов:
      <input type="text" :value="tabLength()" class="tab-input-quests-count" disabled>
    </div>
    <div class="tab-info-sort-index">Порядок сортировки:
      <input type="text"
             :value="tab.sortIndex"
             @change="editSortIndex($event)"
             class="tab-input-sort-index">
    </div>
  </div>
</template>

<script setup>
import {inject} from "vue";

const props = defineProps({
  tab: {
    type: Object,
    required: true
  }
})

const saveSnapshot = inject('saveSnapshot')

const tabLength = () => {
  return Object.keys(props.tab.quests).length
}

const editSortIndex = (event) => {
  props.tab.sortIndex = parseInt(event.target.value)
  saveSnapshot()
}

</script>

<style scoped>

.tab-info-sort-index {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-input-sort-index, .tab-input-quests-count {
  width: 3rem;
  height: 1.5rem;
  background: transparent;
  text-align: center;
  padding: 0;
}

</style>