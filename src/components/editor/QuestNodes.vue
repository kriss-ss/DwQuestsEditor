<template>
  <div class="quest-nodes">
    <div
        v-for="quest in dataQuests"
        :key="quest.name"

        @click="edit ? null : onQuestClick(quest.name)"
        @click.right.shift="deleteQuest(quest.name)"

        class="quest"
        :id="quest.name"
        :title="quest.displayName || quest.name"
        :style="{
            left: `${quest.x}px`,
            top: `${quest.y}px`,
            width: `${quest.size}px`,
            height: `${quest.size}px`,
            boxShadow: `0 0 ${quest.size / 2}px ${quest.size / 5}px ${quest.color}`,
            background: `radial-gradient( var(--white), ${quest.color})`,
            '--quest-size': `${quest.size}px`,
            '--quest-color': quest.color,
          }"
    >
      <img :src="quest.icon" class="quest-icon"  alt=""/>
    </div>
  </div>
</template>

<script setup>

import {ref, watch, nextTick, inject, computed} from 'vue';
import {iconSize, questNodesOffset, scaleField} from "@/constants/questConstants.js";
import {getPosQuest, getQuestSize, getQuestColor, getIconItem, getDisplayName} from "@/utils/getQuestData.js";
import {iconByQuestName} from "@/utils/getIcon.js";

const props = defineProps({
  tab: {
    type: Object,
    required: true,
  },
  active_quest: {
    type: String,
    required: true,
  },
  printGraph: {
    type: Function,
    required: true,
  }
})

const saveSnapshot = inject('saveSnapshot')
const scale = inject('scale')
const edit = inject('edit')

const emit = defineEmits(['edit-active-quest'])


const _drawQueued = ref(false)

const dataQuests = computed(() => {
  return Object.keys(props.tab.quests).map(quest_name => {
    const quest = props.tab.quests[quest_name];

    return {
      name: quest_name,
      displayName: getDisplayName(quest),
      x: getPosQuest(quest).x,
      y: getPosQuest(quest).y,
      size: getQuestSize(quest) * iconSize,
      color: getQuestColor(quest),
      icon: iconByQuestName(quest_name, getIconItem(quest), props.tab.tabID),
    };
  });
})

const deleteQuest = (name) => {
  delete props.tab.quests[name];
  emit('edit-active-quest', '')
  saveSnapshot();
}

const onQuestClick = (name) => {
  emit('edit-active-quest', name)
  // this.active_quest.data = this.tab.quests[name];

  nextTick(() => {
    $(".sidebar-elem-title").click(function () {
      $(this).siblings().slideToggle("slow");
    })

    $('.quest-tasks-items, .quest-rewards-items, .quest-parents-items').sortable({
      opacity: 0.5,
      scroll: true,
      axis: 'y',
      placeholder: "ui-state-highlight",
      handle: ".sidebar-item-name",
      tolerance: "pointer",
      forcePlaceholderSize: true,
      start: function(event, ui) {
        $('.ui-state-highlight').height(ui.item.height() + 1);
      },
      update: function (event, ui) {
        let target = event.target.classList[0];
        if (target.includes('tasks')) {
          let elems = $('.quest-tasks-items').children();
          const newElems = {};
          for(let i = 0; i < elems.length; i++) {
            let elemId = elems[i].classList[1].split("-")[2]
            newElems[i.toString()] = props.tab.quests[name].tasks[elemId];
          }
          props.tab.quests[name].tasks = newElems;
        }
        else if (target.includes('rewards')) {
          let elems = $('.quest-rewards-items').children();
          const newElems = [];
          for(let i = 0; i < elems.length; i++) {
            let elemId = elems[i].classList[1].split("-")[2]
            newElems.push(props.tab.quests[name].rewards[elemId]);
          }
          props.tab.quests[name].rewards = newElems;
        }
        else if (target.includes('parents')) {
          let elems = $('.quest-parents-items').children();
          const newElems = [];
          for(let i = 0; i < elems.length; i++) {
            let elemId = elems[i].classList[1].split("-")[2]
            newElems.push(props.tab.quests[name].parents[elemId]);
          }
          props.tab.quests[name].parents = newElems;
        }
        saveSnapshot();
      },
    });
  });
}

const editMode = () => {
  let selected = $([]), offset = { top: 0, left: 0 };

  $(".quests-field").on("mousemove", function(event) {
    if (event.shiftKey) {
      $(".ui-selectable-helper").hide()
    }
  })
      .selectable({
        filter: '> > .quest-nodes .quest',

        stop: function() {
          $(".ui-selectable-helper").show()
        }
      });

  $(".quest").draggable({
    stack: ".quest",
    scroll: false,
    start: function (ev, ui) {
      if (ev.originalEvent.shiftKey) return false;
      if (!$(this).is(".ui-selected")) {
        $(".ui-selected").removeClass("ui-selected");
      }
      selected = $(".ui-selected").each(function () {
        let el = $(this);
        el.data("offset", el.offset());
      });
      offset = $(this).offset();
    },
    drag: function (ev, ui) {

      let dt = (ui.position.top - offset.top);
      let dl = (ui.position.left - offset.left);

      selected.each(function () {
        let el = $(this), off = el.data("offset");
        if (el[0].id === "drawLine") return;

        let top = (off.top + dt) / scale.value;
        let left = (off.left + dl) / scale.value;
        dragMoveQuest(el[0].id, left, top);
      });

      if (!(_drawQueued.value)) {
        _drawQueued.value = true;
        requestAnimationFrame(() => {
          props.printGraph()
          _drawQueued.value = false;
        });
      }
    },
    stop: function (ev, ui) {
      saveSnapshot()
    }
  }).on("mousedown", function (event) {
    if ($(".ui-selected").length > 0 && !$(this).hasClass("ui-selected") && !event.ctrlKey) {
      $(".ui-selected").removeClass("ui-selected");
    }
    if (event.shiftKey) return;
    $(this).addClass("ui-selected");
  });
}

const disableEditMode = () => {
  $(".quests-field, .quests div, .quest-icon")
      .removeData()
      .off()
      .removeClass("ui-selected ui-selectee ui-draggable ui-draggable-handle");
}

const dragMoveQuest = (name, posX, posY) => {
  if (!props.tab.quests[name]) return;
  let newPosX = ((posX + (getQuestSize(props.tab.quests[name]) - 1) * iconSize / 2 - questNodesOffset * 2) / scaleField).toFixed(2)
  let newPosY = ((posY + (getQuestSize(props.tab.quests[name]) - 1) * iconSize / 2 - questNodesOffset) / scaleField).toFixed(2)

  props.tab.quests[name].displayX = newPosX
  props.tab.quests[name].displayY = newPosY
}

watch(() => edit.value, (newValue) => {
  if (newValue) {
    editMode();
  } else {
    disableEditMode();
  }
}, { immediate: true })

</script>

<style scoped>

.quest {
  /*background-size: cover;*/
  /*background-repeat: no-repeat;*/
  border-radius: 50%;
  position: absolute;
  transition: transform 0.2s ease;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transform-origin: center;
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    width: calc(var(--quest-size) * 1.5);
    height: calc(var(--quest-size) * 1.5);
    border-radius: 50%;
    opacity: 0;
  }
}

.quest-icon {
  display: block;
  width: 70%;
  height: 70%;
  pointer-events: none;

}

</style>