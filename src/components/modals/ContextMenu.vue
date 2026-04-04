<template>
  <div class="context-menu"
       v-if="visibleContextMenu"
       ref="contextMenu"
       :style="{ top: position.top + 'px', left: position.left + 'px' }"
  >
    <div class="menu-item">
      <p class="item-title">Меню</p>
      <p class="item-title title-name">{{title}}</p>
    </div>
    <hr>
    <div
        class="menu-item"
        v-for="option in Object.keys(options)"
        :class="{
          'unavailable': options[option] == null,
          'item-hover': options[option] != null,
        }"
        @click="options[option](item); handleItemClick()"
    >{{option}}</div>
  </div>
</template>

<script setup>

import {inject, provide, ref, watch} from "vue";

const visibleContextMenu = ref(false)
const position = ref({ top: 0, left: 0 })
const item = ref({})
const options = ref({})
const title = ref("")

const onSelect = ref(null)

const contextMenu = ref(null)


const openContextMenu = (event, data, features, titleInfo="") => {
  if (Object.values(features).every(item => item === null)) return;

  position.value = {
    top: event.y - 100,
    left: event.x
  };
  item.value = data
  options.value = features
  title.value = titleInfo

  visibleContextMenu.value = true;


  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 0);
}

defineExpose({
  openContextMenu
})

provide("openContextMenu", openContextMenu)

const handleItemClick = () => {
  visibleContextMenu.value = false;
  document.removeEventListener('click', handleOutsideClick);
}

const handleOutsideClick = (e) => {
  if (!contextMenu.value?.contains(e.target)) {
    visibleContextMenu.value = false;
    document.removeEventListener('click', handleOutsideClick);
  }
}


</script>

<style scoped>

.context-menu {
  display: flex;
  flex-direction: column;
  z-index: 12313;
  gap: 0.125rem;

  background: var(--primary-hover);
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.25rem var(--special);
  position: absolute;
  font-family: Inter, sans-serif;
  font-size: 14px;
  opacity: 1;
  width: 10rem;
}

.menu-item {
  border-radius: 0.25rem;
  transition: background-color 0.125s ease;
  padding: 0.25rem;

  user-select: none;
}

.item-hover:hover {
  background: var(--secondary);
  cursor: pointer;
}

.item-title {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 150px;
}

.title-name {
  color: var(--special);
  font-style: italic;
}

.unavailable {
  color: var(--secondary);
}

</style>