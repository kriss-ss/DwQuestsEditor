<template>
  <div class="sidebar-quest-tasks">
    <p class="sidebar-elem-title">Задачи</p>

    <span class="quest-tasks-items">
            <span class="quest-task-item"
                  :key="task"
                  :class="'task-item-' + task.num_id"
                  v-for="task in getQuestTasks(quest)"
                  @contextmenu.prevent
                  @click.right.shift="sidebarDeleteTask(task.num_id)"
            >
              <span
                  class="task-item-data"
              >
                <img class="sidebar-item-icon" @click="showItemPicker($event, editTaskItem, task)" :src="iconById(task.id)" alt=""/>
                <p class="sidebar-item-name">{{task.name}}</p>
              </span>
              <SelectButton
                  class="sidebar-medium-button quest-task-type center"
                  :items="taskTypes"
                  :selected="task.type"
                  @change-select="editTaskType($event, task.num_id)"
              />
              <input class="sidebar-small-button quest-task-count center" type="text" :value="quest.tasks[task.num_id].requiredCount" @change="editTaskCount($event, task.num_id)"/>

            </span>
          </span>
    <span class="sidebar-add-button task-add center"
          @click="sidebarAddTask()">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.6665 11H20.3332" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11 1.6665V20.3332" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          </span>
  </div>
</template>

<script setup>
import SelectButton from "@/components/ui/SelectButton.vue";
import {getQuestTasks} from "@/utils/getQuestData.js";
import {iconById} from "@/utils/getIcon.js";
import {taskTypes} from "@/constants/questConstants.js";
import {inject} from "vue";

const props = defineProps({
  quest: {
    type: Object,
    required: true,
  },
  itemSelector: {
    type: Object,
    required: true,
  }
})

const saveSnapshot = inject('saveSnapshot')

const sidebarDeleteTask = (id) => {
  delete props.quest.tasks[id];

  const newTasks = {};
  let newId = 0;

  Object.keys(props.quest.tasks)
      .sort((a, b) => a - b)
      .forEach(oldId => {
        newTasks[newId] = props.quest.tasks[oldId];
        newId++;
      });

  props.quest.tasks = newTasks;
  saveSnapshot()
}

const editTaskItem = (task, item) => {
  props.quest.tasks[task.num_id].forgeName = item
  saveSnapshot()
}

const showItemPicker = (event, func, data) => {
  props.itemSelector.open(event, (selectedId) => {
    func(data, selectedId);
  });
}

const editTaskType = (event, n) => {
  props.quest.tasks[n].type = event;
  saveSnapshot()
}

const editTaskCount = (event, n) => {
  props.quest.tasks[n].requiredCount = event.target.value;
  saveSnapshot()
}

const sidebarAddTask = () => {
  let tasks = props.quest.tasks;
  let task_number = (parseInt(Object.keys(tasks)[Object.keys(tasks).length - 1]) + 1).toString()
  if (task_number === "NaN") task_number = "0";
  props.quest.tasks[task_number] = {
    "type": "ITEM_CRAFT",
    "requiredCount": 1,
    "forgeName": "minecraft:dirt"
  }
  saveSnapshot()
}

</script>

<style scoped>

</style>