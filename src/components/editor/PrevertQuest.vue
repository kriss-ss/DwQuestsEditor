<template>

  <div class="p-quest-container"
    :style="{
    opacity: visible ? 0.25 : 1,
    }"
  >
<!--    <div class="p-quest-visible"-->
<!--    @click="visible = !visible">-->
<!--      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--        <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--        <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--      </svg>-->
<!--    </div>-->
    <div class="p-quest-data">
      <div class="p-quest-data-icon">
        <img
            class="p-quest-icon"
            :src="iconByQuestName(props.name, getIconItem(quest), props.tabID)"
            alt="Иконка"
            :style="{
              filter: `drop-shadow(0 0 4px ${getQuestColor(quest)})`,
            }"
           >
      </div>
      <div class="p-quest-data-name">
        <p class="p-quest-name">{{quest.displayName || name}}</p>
      </div>
    </div>

    <div class="p-quest-line"
         :style="{
      background: `linear-gradient(to right, transparent, ${getQuestColor(quest)}, transparent)`,
         }"
      ></div>

    <div class="p-quest-description">
      <div class="p-quest-description-title" :style="{color: getQuestColor(quest)}">Описание</div>

      <div class="p-quest-description-text" v-html="convertDescription(getQuestDescription(quest))"></div>
    </div>

    <div class="p-quest-tasks">
      <div class="p-quest-tasks-title" :style="{color: getQuestColor(quest)}">Задачи</div>

      <div class="p-quest-tasks-tasks"
      >
        <div class="p-quest-task"
             v-for="task in getQuestTasks(quest)">
          <div class="p-quest-task-icon">
            <img class="p-task-icon" :src="iconById(task.id)" alt="">
          </div>
          <div class="p-quest-task-data">
            <span class="p-quest-task-type" v-if="!task.hasCustomDescription">{{taskTypes[task.type] || "Сбор"}}:</span>
            <span class="p-quest-task-name">{{task.name}}</span>
            <span class="p-quest-task-count" v-if="task.count">(0/{{task.count}})</span>
          </div>
        </div>
      </div>
    </div>
    <div class="p-quest-rewards">
      <div class="p-quest-rewards-title" :style="{color: getQuestColor(quest)}">Награды</div>
      <div class="p-quest-rewards-rewards"
        v-if="getQuestRewards(quest) && Object.keys(getQuestRewards(quest)).length > 0"
      >
        <div class="p-quest-reward"
        v-for="reward in getQuestRewards(quest)"
        >
          <div class="p-quest-reward-icon">
            <img class="p-reward-icon" :src="iconById(reward.id)" alt="">
          </div>
          <div class="p-quest-reward-data">
            <div class="p-quest-reward-name">{{reward.name}} -</div>
            <div class="p-quest-reward-count">{{reward.count}} шт</div>
          </div>
          <span class="p-quest-reward-hover" v-html="convertDescription(reward.data)"></span>
        </div>
      </div>
      <div v-else class="p-quest-rewards-rewards">
        <div class="p-quest-reward-empty">Награды отсутствуют</div>
      </div>
    </div>
  </div>

</template>
<script setup>

import {questRarities, taskTypes} from "@/constants/questConstants.js";
import {getPosQuest, getQuestSize, getQuestColor, getQuestDescription, getQuestRewards, getQuestTasks, getIconItem} from "@/utils/getQuestData.js";
import {iconByQuestName, iconById} from "@/utils/getIcon.js";
import {convertDescription} from "@/utils/convertDescription.js";
import {ref} from "vue";


const props = defineProps({
  quest: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tabID: {
    type: String,
    required: true
  }
})

const visible = ref(false);

</script>

<style scoped>

.p-quest-container::-webkit-scrollbar {
  width: 0.5rem;
  height: 0;
  background: rgb(0, 0, 0, 0.2);
}

.p-quest-container::-webkit-scrollbar-thumb {
  width: 8px;
  background: #77767D;
}

.p-quest-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background:
      linear-gradient(rgba(2, 9, 18, 0.2), rgba(2, 9, 18, 0.2)),
      url("/bg.webp") center/cover;

  padding: 1rem;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6) inset;
  margin: auto;
  height:95vh;
  width: 55%;
  z-index: 1;
  overflow: scroll;
  opacity: 1;
  cursor: auto;
}



.p-quest-visible {
  position: fixed;
  left: 100%;
  top: 0;
  margin-left: -3rem;
  width: 2rem;
  height: 2rem;
  cursor: pointer;

}

.p-quest-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.p-quest-icon {
  width: 9rem;
  height: 9rem;
  margin-bottom: 1rem;
  image-rendering: pixelated;
}

.p-quest-name {
  font-size: 2rem;
  font-weight: normal;
  margin-top: 0.5rem;
}

.p-quest-description, .p-quest-tasks, .p-quest-rewards {
  width: 100%;

  padding: 0.5rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.p-quest-description-text {
  background: rgba(0, 0, 0, 0.2);
  padding: 0 1rem 1rem;

}

.p-quest-task-icon, .p-quest-reward-icon {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.125rem;
}

.p-quest-tasks-tasks, .p-quest-rewards-rewards {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem 1rem 1rem;
}

.p-quest-description-title,
.p-quest-tasks-title,
.p-quest-rewards-title {
  width: fit-content;
  background: rgba(0, 0, 0, 0.4);
  margin-left: 0.75rem;
  /*margin-bottom: 5px;*/
  padding: 0.5rem;

}

.p-quest-task, .p-quest-reward {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.4rem;
  position: relative;
}

.p-quest-task-icon, .p-quest-reward-icon {
  width: 2.25rem;
  height: 2.25rem;
}

.p-quest-task-type {
  margin-left: 0.5rem;
}

.p-quest-task-type, .p-quest-task-name, .p-quest-reward-name,
.p-quest-reward-name, .p-quest-task-count, .p-quest-reward-count {
  display: flex;
  justify-content: left;
  align-items: center;
  text-align: center;
  padding-top: 0.25rem;
}

.p-quest-task-name, .p-quest-reward-name {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.p-quest-task-data, .p-quest-reward-data {
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: left;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 2.25rem;

  /*padding: 2px;*/
}


.p-quest-data-name, .p-quest-description-text,
.p-quest-description-title, .p-quest-tasks-title,
.p-quest-rewards-title, .p-quest-task, .p-quest-reward,
.p-quest-reward-empty {
  font-family: minecraft, sans-serif;
}

.p-quest-line {
  content: '';
  width: 31.25rem;
  min-height: 0.33rem;
  margin: 0.5rem;
}

.p-quest-reward-hover {
  /*width: 100%;*/
  opacity: 0;
  background: #12040F;
  border: solid 4px #1A0139;
  border-radius: 8px;
  z-index: 1;
  position: fixed;
  left: 40%;
  /*top: -300px;*/
  transition: opacity 0.2s;
  padding: 5px;
}

.p-quest-reward:hover > .p-quest-reward-hover:not(:hover) {
  opacity: 0.95;
}

</style>