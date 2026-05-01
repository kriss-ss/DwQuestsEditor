<template>
  <div
      class="sidebar-quest-rewards"
      @click.right.exact="showContextMenu($event, null)"
      @contextmenu.prevent
  >
    <p class="sidebar-elem-title">Награды</p>

    <span class="quest-rewards-items">
            <draggable
                v-model="rewardsList"
                item-key="num_id"
                handle=".sidebar-item-name"
                ghost-class="ui-state-highlight"
                tag="div"
                class="quest-rewards-items"
            >
  <template #item="{ element: reward }">
    <span class="quest-reward-item sidebar-item"
          :class="['reward-item-' + reward.num_id, {
                    'gift-item': getRewardType(reward.id) === 'GIFT'
                  }]"
          @contextmenu.prevent
          @click.right.exact.stop="showContextMenu($event, reward)"
          @click.right.shift="sidebarDeleteReward(reward)"
    >
      <span class="reward-item-data">
        <img loading="lazy"
             class="sidebar-item-icon"
             @click="showItemPicker($event, editRewardItem, reward)"
             :src="iconById(reward.id)"
             alt=""/>
        <p class="sidebar-item-name" :title="reward.id">{{ reward.name }}</p>
      </span>

      <SelectButton
          class="sidebar-medium-button quest-reward-type center"
          :items="rewardTypes"
          :selected="getRewardType(reward.id)"
          @change-select="editRewardType($event, reward.num_id)"
          title="Тип награды"
      />

      <input class="sidebar-small-button quest-reward-count center"
             type="text"
             :value="getRewardCount(quest.rewards[reward.num_id])"
             @change="editRewardCount($event, reward.num_id)"
             :disabled="isRewardCountDisabled(quest.rewards[reward.num_id])"
             title="Количество предметов"
      />

      <span class="reward-settings" v-if="getRewardType(reward.id) === 'GIFT'">
        <Gift :reward="reward" :quest="quest" :item-selector="itemSelector" />
      </span>

      <span class="reward-settings" v-if="getRewardType(reward.id) === 'SCRIPT'">
        <Script :reward="reward" :quest="quest"/>
      </span>
    </span>
  </template>
</draggable>
          </span>

    <span class="sidebar-add-button reward-add center"
          @click="sidebarAddReward()"
          title="Добавить награду"
    ><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.6665 11H20.3332" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M11 1.6665V20.3332" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
          </span>
  </div>
</template>

<script setup>
import SelectButton from "@/components/ui/SelectButton.vue";
import {getRusNameFromId} from "@/utils/getRusNameFromId.js";
import {getQuestRewards, getQuestTasks} from "@/utils/getQuestData.js";
import {iconById} from "@/utils/getIcon.js";
import {rewardTypes} from "@/constants/questConstants.js";
import Gift from "@/components/sidebar/Gift.vue";
import {computed, inject} from "vue";
import draggable from "vuedraggable";
import Script from "@/components/sidebar/Script.vue";

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
const contextMenu = inject('contextMenu')
const active_quest = inject('active_quest')
const buffer = inject("buffer")

const rewardsList = computed({
  get: () => {
    return getQuestRewards(props.quest);
  },
  set: (newList) => {
    props.quest.rewards = newList.map(item => item.id);
    saveSnapshot({type: 'sortItemsSidebar', args: { itemsType: 'Награды', name: active_quest.value }});
  }
});

const sidebarAddReward = () => {
  props.quest.rewards.push("minecraft:dirt")
  saveSnapshot({type: 'addItem', args: {itemType: 'Reward', name: active_quest.value}})
}
const sidebarDeleteReward = (reward) => {
  props.quest.rewards.splice(reward.num_id, 1)
  saveSnapshot({type: 'deleteItem', args: {itemType: 'Reward', id: reward.num_id, name: active_quest.value}})
}

const showItemPicker = (event, func, data) => {
  props.itemSelector.open(event, (selectedId) => {
    func(data, selectedId);
  });
}

const showContextMenu = (event, item) => {
  const options = {
    "Копировать": item != null ? copy : null,
    "Вставить": buffer.value['Награды'].length !== 0 ? paste : null,
    "Удалить": item != null ? sidebarDeleteReward : null,
  }
  const title = buffer.value['Награды'][0]?.name
  // console.log(item)
  contextMenu.value.openContextMenu(event, item, options, title)
}

const copy = (item) => {
  buffer.value["Награды"][0] = item
  saveSnapshot({type: 'copyItem', args: {itemType: 'Reward', value: JSON.stringify(item), id: item.num_id, name: active_quest.value}})
}

const paste = (item) => {
  const new_item = buffer.value["Награды"][0]
  const new_index = item !== null ? parseInt(item.num_id) + 1 : props.quest.rewards.length
  props.quest.rewards.splice(new_index, 0, new_item.count > 1 ? new_item.id + "=" + new_item.count : new_item.id)
  saveSnapshot({type: 'pasteItem', args: {itemType: 'Reward', value: JSON.stringify(new_item), id: new_index, name: active_quest.value}})
}

const editRewardItem = (reward, item) => {
  props.quest.rewards[reward.num_id] = reward.count > 1 ? item + "=" + reward.count : item;
  saveSnapshot({type: 'editItemItem', args: {itemType: 'Reward', value: item, id: reward.num_id, name: active_quest.value}})
}

const editRewardType = (event, n) => {
  if (event === "GIFT") {
    props.quest.rewards[n] = "DwQuests:Gift{MinRandom:1,display:{Lore:\"\",Name:\"Гифт\"},Items:[],DropType:\"RANDOM\",Layers:[0,0],MaxRandom:1}"
  }
  else if (event === "SCRIPT") {
    props.quest.rewards[n] = "customnpcs:scripted_item"
  }
  else if (event === "DEFAULT") {
    props.quest.rewards[n] = "minecraft:dirt"
  }
  saveSnapshot({type: 'editItemType', args: {itemType: 'Reward', value: event, id: n, name: active_quest.value}})
}

const isRewardCountDisabled = (rewardString) => {
  const type = getRewardType(rewardString)
  return type === 'GIFT' || type === 'SCRIPT'
}

const editRewardCount = (event, n) => {
  let reward = props.quest.rewards[n]
  let index_count = reward.lastIndexOf("=");
  if (index_count !== -1) {
    reward = reward.slice(0, index_count)
  }
  props.quest.rewards[n] = reward + "=" + event.target.value;
  saveSnapshot({type: 'editItemCount', args: {itemType: 'Reward', value: event.target.value, id: n, name: active_quest.value}})
}

const getRewardType = (id) => {
  let type = ""

  if (id.startsWith("DwQuests:Gift")) {
    type = "GIFT"
  } else if (id.startsWith("customnpcs:scripted_item")) {
    type = "SCRIPT"
  } else {
    type = "DEFAULT"
  }

  return type;
}

const getRewardCount = (reward) => {
  let index_count = reward.lastIndexOf("=")
  if (index_count === -1) {
    return 1
  }
  return parseInt(reward.substring(index_count + 1))
}

</script>

<style scoped>


.reward-settings {
  display: grid;
  grid-row-gap: 0.5rem;
  grid-column: 1 / -1;
  margin-left: 2.25rem;
  margin-top: 1rem;
  position: relative;
  /*grid-template-columns: 40px 1fr;*/
  /*grid-template-columns: 1fr 40px;*/
}

.reward-settings::before {
  content: "";
  position: absolute;
  left: -1.5rem;
  top: -1.25rem;
  bottom: 0;
  width: 0.125rem;
  background-color: var(--secondary);
}

.sidebar-small-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--secondary);
}
</style>