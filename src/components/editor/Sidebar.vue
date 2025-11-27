<template>
  <div class="quests-sidebar"
       :class="{
         'collapsed': edit,
         'ui-resizable': true,
         'no-transition': isResizing
       }"
       ref="sidebarElement"
  >
    <div class="quests-sidebar-content"
         @mousewheel.passive="resizableHandleEditor"
    >

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

<!--      <Grid/>-->

    </div>

  </div>
    <ControlButtons
        :tab="tab"
    />
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
import Grid from "@/components/sidebar/Grid.vue";
import ControlButtons from "@/components/sidebar/ControlButtons.vue";
import {nextTick, onMounted, ref, watch, inject, provide} from "vue";

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

const sidebar = ref(null)
const handler = ref(null)
const edit = inject("edit");
const isResizing = ref(false);

const sidebarElement = ref(null)
const computedWidth = ref(null)


onMounted(() => {
  $(".quests-sidebar").resizable({
    handles: "e",
    start() {
      isResizing.value = true;
    },
    stop() {
      isResizing.value = false;
    },
    resize(event, ui) {
    }

  });

  nextTick(() => {
    if (sidebarElement.value) {
      computedWidth.value = sidebarElement.value.scrollWidth + 'px'
    }
  })

  sidebar.value = $('.quests-sidebar')
  handler.value= $('.ui-resizable-handle')
})

const resizableHandleEditor = () => {
  const height = props.quest ? sidebar.value[0].scrollHeight : sidebar.value.height();
  handler.value.css('height', height + 'px');
}

watch(
    () => props.quest,
    () => resizableHandleEditor()
);

</script>

<style scoped>

.quests-sidebar::-webkit-scrollbar {
  width: 0;
}

.quests-sidebar {
  height: 100vh;
  min-width: 15%;
  max-width: 35%;
  width: min-content;
  flex-shrink: 0;

  overflow: hidden;
  overflow-y: auto;
  anchor-name: --sidebar;

  background: var(--primary);
  font-family: Inter, sans-serif;
  color: white;
  transition: all 0.8s ease;
}

.quests-sidebar.collapsed {
  width: 0;
  min-width: 0;
  max-width: 0;
  opacity: 0;
  visibility: hidden;
}

.quests-sidebar.collapsed {
  transform: translateX(-200%);
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

</style>