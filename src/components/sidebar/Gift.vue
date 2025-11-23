<template>
        <textarea
            class="reward-gift-nbt"
            :value="reward.id"
            @change="editGiftNbt($event, reward)"
        ></textarea>
        <span
            class="reward-gift-item"
            v-for="item in getGiftItems()"
        >
          <span
              class="reward-item-data"
              @contextmenu.prevent
              @click.right.shift="deleteGiftItem(item)"
              @click="showItemPicker($event, editGiftItem, item)"
          >
        <img class="sidebar-item-icon" :src="iconById(item.id)" alt=""/>
        <p class="sidebar-item-name">{{ item.name }}</p>
      </span>
          <input class="sidebar-small-button quest-reward-count center" type="text" :value="item.count"
                 @change="editGiftItem(item, item.id, $event.target.value)"/>
        </span>
                  <span class="sidebar-add-button reward-add center"
                        @click="addGiftItem()"
                  ><svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
    <path d="M1.6665 11H20.3332" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round"
          stroke-linejoin="round"/>
    <path d="M11 1.6665V20.3332" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round"
          stroke-linejoin="round"/>
  </svg>
  </span>
</template>

<script setup>
import {iconById} from "@/utils/getIcon.js";
import {parse} from "nbt-ts";
import {getRusNameFromId} from "@/utils/getRusNameFromId.js";
import {giftStringToObject, customStringify} from "@/utils/giftParser.js";
import {inject} from "vue";
import {nbtParser} from "@/utils/nbtParser.js";

const props = defineProps({
  reward: {
    type: Object,
    required: true,
  },
  itemSelector: {
    type: Object,
    required: true,
  },
  quest: {
    type: Object,
    required: true,
  }
})

const saveSnapshot = inject('saveSnapshot')

const showItemPicker = (event, func, data) => {
  props.itemSelector.open(event, (selectedId) => {
    func(data, selectedId);
  });
}

const getGiftItems = () => {
  let giftID = props.reward.id
  let gift_items = []

  let nbt = giftID.slice(giftID.indexOf("{"), giftID.lastIndexOf("}") + 1);
  if (~nbt.indexOf("DropType")) {
    nbt = nbtParser(nbt)
    let count = 0
    Object.values(nbt.Items).forEach(item => {
      let itemID = item.ID
      let itemName = item.Tag?.display.Name
      let itemCount = 1
      if (item.ID.lastIndexOf("=") !== -1) {
        itemID = item.ID.slice(0, item.ID.lastIndexOf("="));
        itemCount = item.ID.slice(item.ID.lastIndexOf("=") + 1);
      }
      gift_items.push({
        id: itemID,
        num_id: count++,
        reward_id: props.reward.num_id,
        name: itemName || getRusNameFromId(itemID),
        count: itemCount,
      })
      // items += "&emsp;- " + (itemName || this.getRusNameFromId(itemID)) + "§7 x" + itemCount + "\n"
    })
    // let itemsCount = ""
    // if (typeof nbt.MaxRandom?.value === "undefined") {
    //   itemsCount = "Содержит все предметы"
    // } else if (nbt.MaxRandom.value === 1) {
    //   itemsCount = "Содержит 1 случайный предмет"
    // } else {
    //   itemsCount = `Содержит от ${nbt.MinRandom?.value} до ${nbt.MaxRandom?.value} случайных предметов`
    // }
    // gift_items['items_count'] = itemsCount

    return gift_items;
  }
  return ""
}

const editGiftNbt = (event, reward) => {
  props.quest.rewards[reward.num_id] = event.target.value;
  saveSnapshot()
}

const editGiftItem = (reward, item, count = undefined) => {
  let giftID = props.quest.rewards[reward.reward_id]
  let giftNBT = giftStringToObject(giftID)
  let item_count = reward.count
  if (count !== undefined && count !== null) {
    item_count = count
  }
  let finalGift = giftID.slice(0, giftID.indexOf("{"));
  giftNBT.Items[reward.num_id].ID = item_count > 1 ? item + '=' + item_count : item
  finalGift = finalGift + customStringify(giftNBT)
  props.quest.rewards[reward.reward_id] = finalGift;
  saveSnapshot()
}

const addGiftItem = () => {
  let giftID = props.quest.rewards[props.reward.num_id]
  let giftNBT = giftStringToObject(giftID)
  if (giftID.indexOf("{") === -1) giftID += "{}"
  let finalGift = giftID.slice(0, giftID.indexOf("{"));
  giftNBT.Items[Object.keys(giftNBT.Items).length] = {
    "Slot": {
      "value": Object.keys(giftNBT.Items).length
    },
    "ID": "minecraft:dirt=1"
  }
  finalGift = finalGift + customStringify(giftNBT)
  props.quest.rewards[props.reward.num_id] = finalGift;
  saveSnapshot()
}

const deleteGiftItem = (item) => {
  let giftID = props.quest.rewards[item.reward_id]
  let giftNBT = giftStringToObject(giftID)
  let finalGift = giftID.slice(0, giftID.indexOf("{"));

  let newGiftItems = {}
  let count = 0
  for (const [key, value] of Object.entries(giftNBT.Items)) {
    if (key === item.num_id.toString()) continue;
    newGiftItems[count++] = value
  }

  giftNBT.Items = newGiftItems;
  finalGift = finalGift + customStringify(giftNBT)
  props.quest.rewards[item.reward_id] = finalGift;
  saveSnapshot()
}
</script>

<style scoped>

.reward-gift-nbt {
  height: 6.25rem;
  background: var(--secondary);
  border-radius: 5px;
  margin-bottom: 0.5rem;
  padding: 0.25rem;
}

.reward-gift-item {
  display: grid;
  grid-template-columns: 1fr 2.5rem;
  align-items: center;
  padding: 0.125rem;
}

.reward-gift-item:hover {
  background: var(--primary);
  transition: background-color 0.2s ease;
}

</style>