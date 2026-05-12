<template>
  <div class="quests-sidebar"
       :class="{ 'collapsed': edit, 'no-transition': isResizing }"
       :style="{ width: sidebarWidth + 'px' }"
       ref="sidebarElement"
  >
    <div class="quests-sidebar-content">
      <TabTitle :item-selector="itemSelector" :tab="tab"/>
      <hr class="devider"/>
      <TabInfo :tab="tab"/>
      <hr class="devider"/>
      <div class="sidebar-quest-data" v-if="quest">
        <Title :item-selector="itemSelector"
               :quest-name="quest"
               :quest="tab.quests[quest]"
               :tabID="tab.tabID"
        />
        <hr class="devider"/>
        <Coords :quest="tab.quests[quest]"/>
        <hr class="devider"/>
        <Visual :quest="tab.quests[quest]"/>
        <hr class="devider"/>
        <Description :quest="tab.quests[quest]"/>
        <hr class="devider"/>
        <Tasks :item-selector="itemSelector"
               :quest="tab.quests[quest]"/>
        <hr class="devider"/>
        <Rewards :item-selector="itemSelector"
                 :quest="tab.quests[quest]"/>
        <hr class="devider"/>
        <Parents :parent-selector="parentSelector"
                 :quest="tab.quests[quest]"
                 :quests="tab.quests"
                 :tabID="tab.tabID"
        />
      </div>
    </div>
    <div
        class="resizer-handle"
        @mousedown="startResizing"
    ></div>

  </div>
    <Menu
        :tab="tab"
    />
  <ContextMenu/>
</template>

<script setup>
import TabTitle from "@/components/sidebar/TabTitle.vue";
import TabInfo from "@/components/sidebar/TabInfo.vue";
import Visual from "@/components/sidebar/Visual.vue";
import Coords from "@/components/sidebar/Coords.vue"
import Title from "@/components/sidebar/Title.vue"
import Description from "@/components/sidebar/Description.vue";
import Tasks from "@/components/sidebar/Tasks.vue";
import Rewards from "@/components/sidebar/Rewards.vue";
import Parents from "@/components/sidebar/Parents.vue";
import Menu from "@/components/sidebar/Menu.vue";
import {ref, inject} from "vue";
import ContextMenu from "@/components/modals/ContextMenu.vue";

const props = defineProps({
  tab: {
    type: Object,
    required: true,
  },
  quest: {
    type: String,
    required: true,
  },
  itemSelector: {
    type: Object,
    required: true,
  },
  parentSelector: {
    type: Object,
    required: true,
  },
  printGraph: {
    type: Function,
    required: true,
  }
})

const edit = inject("edit");
const sidebarElement = ref(null);
const isResizing = ref(false);
const sidebarWidth = ref(450);

const startResizing = (event) => {
  isResizing.value = true;

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', stopResizing);

  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const handleMouseMove = (event) => {
  if (!isResizing.value) return;
  const w = window.innerWidth;
  sidebarWidth.value = Math.min(Math.max(event.clientX, w * 0.15), w * 0.35);
};

const stopResizing = () => {
  isResizing.value = false;
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', stopResizing);

  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

</script>

<style scoped>

.quests-sidebar::-webkit-scrollbar {
  width: 0;
}

.resizer-handle {
  width: 5px;
  height: 100%;
  bottom: 0;
  background: white;
  border-left: 4px var(--primary) solid;
  position: sticky;
  right: 0;
  top: 0;
  cursor: col-resize;
  transition: background 0.2s;
  z-index: 10;
}

.resizer-handle:hover,
.quests-sidebar.no-transition .resizer-handle {
  background: var(--secondary);
}

.quests-sidebar.collapsed .resizer-handle {
  display: none;
}

.quests-sidebar {
  position: relative;
  height: 100vh;
  display: flex;
  flex-shrink: 0;

  overflow: hidden;
  overflow-y: auto;
  anchor-name: --sidebar;

  background: var(--primary);
  font-family: Inter, sans-serif;
  color: white;
  transition: all 1s ease;
}

.quests-sidebar.collapsed {
  width: 0;
  min-width: 0;
  max-width: 0;
  opacity: 25%;
}


.quests-sidebar.no-transition {
  transition: none;
}

.sidebar-quest-data div {
  margin: 0.66rem;
}

.quests-sidebar-content {
  width: 100%;
  position: relative;
}

.devider {
  border-color: var(--secondary);
}

</style>