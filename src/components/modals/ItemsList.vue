<template>
  <div
      v-if="visible"
      class="items-list-container"
      ref="itemsList"
      :style="{ top: position.top + 'px', left: position.left + 'px' }"
  >
    <input
        v-model="searchValue"
        class="search"
        @keydown.enter.prevent="handleItemClick(searchValue)"
        :placeholder="placeholderText" />
    <svg
        class="search-icon"
        width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#646A77" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div
      v-if="itemsMatches.length === 0"
      class="no-items"
    >
      <p class="item-new"> Предмет не найден<br> <br> Нажмите <code>Enter</code>, чтобы добавить новый предмет <br> Используйте буквенный ID формата: <code>minecraft:stone</code></p>
    </div>
    <RecycleScroller
        class="items-container"
        :items="itemsMatches"
        :item-size="48"
        key-field="0"
        v-if="itemsMatches.length > 0"
    >
      <template #default="{ item: [key, value] }">
        <div
            v-if="itemsType === 'item'"
            class="item"
            @click="handleItemClick(key)"
        >
          <img loading="lazy" class="item-icon" :src="iconById(key)" alt="">
          <p class="item-name">{{ getRusNameFromId(key) }} ({{ value.itemId }})</p>
        </div>
        <div
            v-if="itemsType === 'parent'"
            class="item"
            @click="handleItemClick(key)"
        >
          <img loading="lazy" class="item-icon" :src="iconByQuestName(key, value.id, props.tabID)" alt="">
          <p class="item-name">{{ value.name ?? key }}</p>
        </div>


      </template>

    </RecycleScroller>

  </div>
</template>

<script setup>
import { matchSorter, rankings } from "match-sorter";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import {onMounted, ref, watch} from "vue";
import {getRusNameFromId} from "@/utils/getRusNameFromId.js";
import {iconById, iconByQuestName} from "@/utils/getIcon.js";

const props = defineProps({
  itemsType: {
    type: String,
    required: true,
  },
  placeholderText: {
    type: String,
    required: true,
  },
  items: {
    type: Object,
    required: true,
  },
  tabID: {
    type: String,
  }
})

const visible = ref(false)
const itemsMatches = ref([])
const searchValue = ref("")
const position = ref({ top: 0, left: 0 })
const onSelect = ref(null)

const itemsList = ref(null)


watch(searchValue, (newValue) => {
  if (newValue === "") {
    itemsMatches.value = Object.entries(props.items)
  } else {
    itemsMatches.value = matchSorter(Object.entries(props.items), newValue, {
      keys: [(entry) => entry[1]?.itemName, (entry) => entry[1]?.itemId, (entry) => entry[1], (entry) => entry[0]],
      threshold: rankings.CONTAINS
    })
  }
})


const open = (event, callback) => {
  if (visible.value) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const popupHeight = 300;

  const spaceBelow = window.innerHeight - rect.bottom;
  const showAbove = spaceBelow < popupHeight;

  position.value = {
    top: showAbove ? rect.top + window.scrollY - popupHeight : rect.bottom + window.scrollY,
    left: rect.left + window.scrollX
  };

  visible.value = true;
  searchValue.value = "";
  itemsMatches.value = Object.entries(props.items);
  onSelect.value = callback;


  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 0);
}

defineExpose({
  open
})

const handleItemClick = (itemId) => {
  visible.value = false;
  onSelect.value?.(itemId);
  document.removeEventListener('click', handleOutsideClick);
}

const handleOutsideClick = (e) => {
  if (!itemsList.value?.contains(e.target)) {
    visible.value = false;
    document.removeEventListener('click', handleOutsideClick);
  }
}

</script>

<style scoped>

.items-list-container {
  width: 28.125rem;
  height: 18.75rem;
  background: var(--primary-hover);
  border: solid 0.125rem var(--primary-hover);
  border-radius: 4px;

  position: absolute;
  /*top: 50%;*/
  /*left: 50%;*/
  /*transform: translate(0, -50%);*/
  z-index: 999;
  padding: 0.25rem;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
}

.search {
  width: 100%;
  height: 2rem;
  margin-bottom: 0.5rem;
  padding-left: 2.125rem;

  color: white;
  background: var(--primary-hover);
  border-radius: 2px;
  border: #1E1F22 solid 1px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

.search-icon {
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;
}

.items-container {
  border: #1E1F22 solid 2px;
  height: 15.5rem;
  overflow: scroll;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

.item {
  border-radius: 4px;
  padding: 0.25rem;
  color: white;
  display: grid;
  grid-template-columns: 10% 90%;
  grid-auto-rows: minmax(2rem, auto);
  background-color: var(--primary-hover);
  align-items: center;
  border: #1E1F22 dotted 1px;
  cursor: pointer;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25)
}

.item:hover {
  background-color: #1E1F22;
  transition: background-color 0.2s ease;
}

.item-name {
  font-family: Inter, sans-serif;
  line-height: 1;
}


.items-container::-webkit-scrollbar {
  width: 0.5rem;
  height: 0;
  background: var(--primary-hover);
}

.items-container::-webkit-scrollbar-thumb {
  width: 0.5rem;
  background: #77767D;
}

.item-icon {
  width: 2rem;
  height: 2rem;
}

.no-items {
  padding: 0.25rem;
  border: #1E1F22 solid 1px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25)
}

.item-new {
  font-family: Inter, sans-serif;
}

.item-new code {
  background: var(--primary);
  color: darkcyan;
  font-weight: bold;
}

</style>