<template>
  <main>
    <div class="quests-container">
      <div class="quests-field"
           @mousedown="drag.startDrag($event, edit); onFieldClick($event)"
           @mousedown.shift="edit ? canvasRef.beginDrawing($event) : null"
           @mousemove="drag.onDrag($event); canvasRef.draw($event)"
           @mouseup="drag.endDrag($event); canvasRef.stopDrawing($event)"
           @mouseleave="drag.endDrag"
           @wheel.prevent="drag.onZoom"
           @contextmenu.prevent>


        
        <CanvasLines
            ref="canvasRef"
            :quests="tab.quests"
            :save-snapshot="saveSnapshot"/>
        <div class="quests" id="quests"
             :class="{'edit-mode': edit}"
             :style="{transform: `${drag.getTransform()}`}">
          <div
              class="grid-container"
              :class="{'gridEnable': gridEnable}"
              :style="{'--grid-size': `${gridSize * 30}px`,
                       marginLeft: `${parseFloat(gridModifier.left) * 30}px`,
                       marginTop: `${parseFloat(gridModifier.top) * 30}px`,}"
          >
          </div>

          <QuestNodes :save-snapshot="saveSnapshot"
                      :print-graph="printGraph"
                      :tab="tab"
                      :edit="edit"
                      :active_quest="active_quest"
                      :scale="scale"
                      @edit-active-quest="editActiveQuest"/>
        </div>
      </div>
      <Sidebar
          :tab="tab"
          :quest="active_quest"
          :parent-selector="parentSelector"
          :item-selector="itemSelector"
          :print-graph="printGraph"
      />
      <PrevertQuest
          v-if="active_quest"
          @wheel.stop
          @mousemove.stop
          @mousedown.stop
          :quest="tab.quests[active_quest]"
          :name="active_quest"
          :tabID="tab.tabID"
      />
      <items-list
          ref="itemSelector"
          :items-type="'item'"
          :items="items"
          :placeholder-text="'Введите название или id..'"
      />
      <items-list
          ref="parentSelector"
          :items-type="'parent'"
          :items="getParentsList()"
          :placeholder-text="'Введите название родителя..'"
          :tabID="tab.tabID"
      />
    </div>
  </main>
</template>

<script setup>
import Sidebar from "@/components/editor/Sidebar.vue";
import PrevertQuest from "@/components/editor/PrevertQuest.vue";
import QuestNodes from "@/components/editor/QuestNodes.vue";
import CanvasLines from "@/components/editor/CanvasLines.vue";
import {editorHistory} from "@/composables/editorHistory.js";
import ItemsList from "@/components/modals/ItemsList.vue";
import {dragField} from "@/composables/dragField.js";
import {getItems} from "@/utils/getItems.js";
import {onBeforeUnmount, onMounted, ref, provide, nextTick, inject} from "vue";
import {useRouter} from "vue-router";


const tab = ref({})
const active_quest = ref("")
const edit = ref(null)
const scale = ref(1)
const items = ref({})
const itemSelector = ref({})
const parentSelector = ref({})
const canvasRef = ref(null)
const drag = ref(null)
const historyManager = ref(null)
const updateTabInterval = ref(null)
const gridEnable = ref(false)
const gridSize = ref(4)
const gridModifier = ref({left: 0, top: 0})


const saveSnapshot = () => {
  historyManager.value.saveSnapshot(tab.value)
  printGraph()
}

provide('saveSnapshot', saveSnapshot)
provide('edit', edit)
provide('gridEnable', gridEnable)
provide('active_quest', active_quest)
provide('gridSize', gridSize)
provide('gridModifier', gridModifier)



const editActiveQuest = (name) => {
  active_quest.value = name;
}

const onFieldClick = (event) => {
  if (!event.target.closest('.quest')) {
    active_quest.value = "";
  }
}

const getParentsList = () => {
  return Object.entries(tab.value.quests)
      .filter(([key]) => key !== active_quest.value)
      .reduce((acc, [key, quest]) => {
        acc[key] = {
          id: quest.iconItem,
          name: quest.displayName
        };
        return acc;
      }, {});
}

// const toggleEditMode = () => {
//   edit.value.value = !edit.value.value;
// }

const printGraph = () => {
  if (canvasRef.value) {
    nextTick(() => canvasRef.value.canvasLines())
  }
}

const savedTab = localStorage.getItem('current-tab');

if (savedTab) {
  tab.value = JSON.parse(savedTab);
} else {
  useRouter().push('/')
}

historyManager.value = editorHistory(tab.value, {
  onStateChange: (newState) => {
    tab.value = newState
    printGraph()
  }
})

provide("tabID", tab.value.tabID)

historyManager.value.initialize()
drag.value = dragField()
saveSnapshot()

onBeforeUnmount(() => {
  if (updateTabInterval.value) {
    clearInterval(updateTabInterval.value);
    updateTabInterval.value = null;
  }
})

onMounted(() => {
  items.value = getItems()

  updateTabInterval.value = setInterval(() => {
    localStorage.setItem('current-tab', JSON.stringify(tab.value));
  }, 5000);


})

</script>

<style scoped>

.quests-container {
  width: 100%;
  display: flex;
  height: 100vh;
  background: var(--primary);
}

.quests {
  position: absolute;
  transform-origin: 0 0;
  will-change: transform;
}

.grid-container {
  position: absolute;
  top: calc((var(--field-radius)) * -1);
  left: calc((var(--field-radius)) * -1);
  width: calc(var(--field-radius) * 2);
  height: calc(var(--field-radius) * 2);
  pointer-events: none;
  background-image:
      linear-gradient(to left, rgba(0, 0, 0, 0.3) 2px, transparent 1px),
      linear-gradient(to top, rgba(0, 0, 0, 0.3) 2px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
  background-position: calc((var(--field-radius)) + 1017px) calc((var(--field-radius)) + 517px);
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.1s ease;
  z-index: -100;
}

.grid-container.gridEnable {
  transform: scale(1);
  opacity: 1;
}


.quests-field {
   width: 100%;
   height: 100%;
   flex-grow: 1;
   overflow: hidden;
   position: absolute;
   user-select: none;
   cursor: grab;

   background:
       linear-gradient(rgba(2, 9, 18, 0.3), rgba(2, 9, 18, 0.3)),
       url("/bg.webp") center/cover;

   box-shadow: inset 0 0 1rem rgba(0,0,0,0.85);
 }



.quests-field:active {
  cursor: grabbing;
}


</style>