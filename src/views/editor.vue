<template>
  <main>
    <div class="quests-container">
      <Sidebar
          :tab="tab"
          :quest="active_quest"
          :parent-selector="parentSelector"
          :item-selector="itemSelector"
          :print-graph="printGraph"
      />

      <div class="quests-field"
           @mousedown="drag.startDrag($event, edit); onFieldClick($event)"
           @mousemove="drag.onDrag"
           @mouseup="drag.endDrag"
           @mouseleave="drag.endDrag"
           @wheel.prevent="drag.onZoom"
           @contextmenu.prevent>

        <div class="quests" id="quests"
             @mousemove="canvasRef.draw" @mousedown.shift="edit ? canvasRef.beginDrawing($event) : null" @mouseup="canvasRef.stopDrawing"
             :style="{transform: `${drag.getTransform()}`}">
          <div
              class="grid-container"
              :class="{'gridEnable': gridEnable}"
              :style="{ '--grid-size': `${gridSize}px` }"
          >
          </div>
          <CanvasLines
              ref="canvasRef"
              :quests="tab.quests"
              :save-snapshot="saveSnapshot"/>

          <QuestNodes :save-snapshot="saveSnapshot"
                      :print-graph="printGraph"
                      :tab="tab"
                      :edit="edit"
                      :active_quest="active_quest"
                      :scale="scale"
                      @edit-active-quest="editActiveQuest"/>
        </div>
        <PrevertQuest
            v-if="active_quest"
            @wheel.stop
            @mousemove.stop
            @mousedown.stop
            :quest="tab.quests[active_quest]"
            :name="active_quest"
            :tabID="tab.tabID"
        />
      </div>
      <items-list
          ref="itemSelector"
          :items-type="'item'"
          :items="items"
          :placeholder-text="'Введите название или id..'"
          class="test-test"
      />
      <items-list
          ref="parentSelector"
          :items-type="'parent'"
          :items="Object.keys(tab.quests).filter(e => e !== active_quest)"
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
import {onBeforeUnmount, onMounted, ref, provide, nextTick} from "vue";
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
const gridSize = ref(30)


const saveSnapshot = () => {
  historyManager.value.saveSnapshot(tab.value)
  printGraph()
}

provide('saveSnapshot', saveSnapshot)
provide('edit', edit)
provide('gridEnable', gridEnable)


const editActiveQuest = (name) => {
  active_quest.value = name;
}

const onFieldClick = (event) => {
  if (!event.target.closest('.quest')) {
    active_quest.value = "";
  }
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

  $(".template-img").draggable({})

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
  top: calc(var(--field-radius) * -1);
  left: calc(var(--field-radius) * -1);
  width: calc(var(--field-radius) * 2);
  height: calc(var(--field-radius) * 2);
  pointer-events: none;
  background-image:
      linear-gradient(to right, rgba(0, 0, 0, 0.3) 2px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 2px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
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
  min-width: 500px;
  min-height: 500px;
  flex-grow: 1;
  background: rgb(61,53,17);
  background: radial-gradient(circle, rgba(61,53,17,1) 0%, rgba(24,10,70,1) 100%);
  box-shadow: inset 0 0 1rem rgba(0, 0, 0, 0.8);
  overflow: hidden;
  position: relative;
  user-select: none;
  cursor: grab;
}

.quests-field:active {
  cursor: grabbing;
}


</style>