<template>
  <div class="sidebar-quest-rewards">
    <p class="sidebar-elem-title">Награды</p>

    <span class="quest-rewards-items">
            <span class="quest-reward-item"
                  v-for="reward in getQuestRewards(quest)"
                  :key="reward"
                  :class="'reward-item-' + reward.num_id"
                  @contextmenu.prevent
                  @click.right.shift="sidebarDeleteReward(reward.num_id)"
            >
              <span
                  class="reward-item-data"
              >
                <img class="sidebar-item-icon" @click="showItemPicker($event, editRewardItem, reward)" :src="iconById(reward.id)" alt=""/>
                <p class="sidebar-item-name">{{ reward.name }}</p>
              </span>
              <SelectButton
                  class="sidebar-medium-button quest-reward-type center"
                  :items="rewardTypes"
                  :selected="getRewardType(reward.id)"
                  @change-select="editRewardType($event, reward.num_id)"
              />
              <!--              <span class="sidebar-medium-button quest-reward-type">{{getRewardTypeWord(reward.id)}}</span>-->
              <input class="sidebar-small-button quest-reward-count center" type="text"
                     :value="getRewardCount(quest.rewards[reward.num_id])"
                     @change="editRewardCount($event, reward.num_id)"/>

              <span
                  class="reward-settings"
                  v-if="getRewardType(reward.id) === 'GIFT'"
              >
                <Gift :reward="reward" :quest="quest" :item-selector="itemSelector" />
                </span>
              <span
                  class="reward-settings"
                  v-if="getRewardType(reward.id) === 'SCRIPT'"
              >
                <Script :reward="reward" :quest="quest"/>
              </span>
            </span>
          </span>

    <span class="sidebar-add-button reward-add center"
          @click="sidebarAddReward()"
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
import {getQuestRewards} from "@/utils/getQuestData.js";
import {iconById} from "@/utils/getIcon.js";
import {rewardTypes} from "@/constants/questConstants.js";
import Gift from "@/components/sidebar/Gift.vue";
import {inject} from "vue";
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

const sidebarAddReward = () => {
  props.quest.rewards.push("minecraft:dirt")
  saveSnapshot()
}
const sidebarDeleteReward = (id) => {
  props.quest.rewards.splice(id, 1)
  saveSnapshot()
}

const showItemPicker = (event, func, data) => {
  props.itemSelector.open(event, (selectedId) => {
    func(data, selectedId);
  });
}

const editRewardItem = (reward, item) => {
  props.quest.rewards[reward.num_id] = reward.count > 1 ? item + "=" + reward.count : item;
  saveSnapshot()
}

const editRewardType = (event, n) => {

}

const editRewardCount = (event, n) => {
  let reward = props.quest.rewards[n]
  let index_count = reward.lastIndexOf("=");
  if (index_count !== -1) {
    reward = reward.slice(0, index_count)
  }
  props.quest.rewards[n] = reward + "=" + event.target.value;
  saveSnapshot()
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
</style>