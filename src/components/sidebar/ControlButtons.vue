<template>
  <div class="sidebar-menu">
    <span
        @click="sidebarAddQuest"
        class="menu-button add-quest">
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-square-rounded-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
    </span>
    <span
        @click="enableEditMode"
        class="menu-button edit-mode"
        :class="{'edit': edit}">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    </span>
    <span
        @click="gridEnable = !gridEnable"
        :class="{'gridEnable': gridEnable}"
        class="menu-button grid-mode">
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="feather feather-grid"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /><path d="M6 3v18" /><path d="M12 3v18" /><path d="M18 3v18" /></svg>
    </span>

    <span
        @click="copyTab"
        class="menu-button copy-tab">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clipboard"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
    </span>
    <span
        @click="saveTab"
        class="menu-button save-tab">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
    </span>
  </div>

</template>

<script setup>
import {inject} from "vue";

const props = defineProps({
  tab: {
    type: Object,
    required: true,
  }
})

const saveSnapshot = inject('saveSnapshot')
const edit = inject('edit')
const gridEnable = inject('gridEnable')


const sidebarAddQuest = () => {
  const questName = 'Квест' + Object.keys(props.tab.quests).length;
  const coords = checkAvailableCoords();
  props.tab.quests[questName] = {
    "displayX": coords.x,
    "displayY": coords.y,
    "description": "<BR>",
    "iconItem": "minecraft:bedrock",
    "parents": [],
    "tasks": {
      "0": {
        "type": "TASK_CONFIRM"
      }
    },
    "rewards": []
  }
  saveSnapshot()
}

const checkAvailableCoords = () => {
  const gridSize = 1.5;
  let x = 0;
  let y = 0;
  let foundPosition = false;

  while (!foundPosition) {
    let positionFree = true;

    for (const quest of Object.values(props.tab.quests)) {
      const questWidth = 1.5;
      const questHeight = 1.5;

      if (x < quest.displayX + questWidth &&
          x + gridSize > quest.displayX &&
          y < quest.displayY + questHeight &&
          y + gridSize > quest.displayY) {
        positionFree = false;
        break;
      }
    }

    if (positionFree) {
      foundPosition = true;
    } else {
      x += gridSize;
      if (x >= gridSize * 5) {
        x = 0;
        y += gridSize;
      }
    }
  }

  return { x, y };
}

const enableEditMode = () => {
  edit.value = !edit.value;
}

const copyTab = async () => {
  const jsonString = JSON.stringify(props.tab, null, 2);
  await navigator.clipboard.writeText(jsonString);
}

const saveTab = () => {
  const jsonString = JSON.stringify(props.tab, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.tab.tabID || 'tab'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

</script>

<style scoped>

.sidebar-menu {
  position: absolute;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  height: 16.25rem;
  width: 3.25rem;
  left: calc(anchor(--sidebar right) + 1rem);
  align-self: center;
  z-index: 100;
  background: var(--primary);
  outline: 0.125rem solid var(--secondary);

  top: 50%;
  transform: translateY(-50%);

  border-radius: 1rem;
  padding: 0.25rem;
  opacity: 0.95;
}

.menu-button {
  display: flex;
  position: relative;
  align-self: center;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 0.5rem;

}

.menu-button:hover {
  background-color: var(--primary);
  filter: brightness(2);
  transition: background-color 0.2s ease;
}

.edit-mode.edit, .grid-mode.gridEnable {
  background: green;
  transition: background 1s ease;
}

.copy-tab {
  outline: solid transparent 1px;
}

</style>