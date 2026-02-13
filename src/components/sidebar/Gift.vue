<!--
Имя:
Лор:
Тип:
  - Все предметы
  - Случайно:
      От скольки до скольки (ex. 1-2)
      Если одно значение n => MinRandom=MaxRandom=n
      Если m-n => MinRandom=m;MaxRandom=n (MinRandom > 0)
-->


<template>
<!--        <textarea-->
<!--            class="reward-gift-nbt"-->
<!--            :value="reward.id"-->
<!--            @change="editGiftNbt($event, reward)"-->
<!--        ></textarea>-->
    <div class="gift-info">
        <div class="gift-name">
          <p>Имя:</p>
          <input type="text"
                 class="gift-input-field"
                 :value="getGiftName()"
                 @change="editGiftName($event, reward)"
          >
        </div>
        <div class="gift-lore">
          <p>Лор:</p>
          <textarea type="text"
                 class="gift-input-field"
                 :value="getGiftLore()"
                 @change="editGiftLore($event, reward)"
          ></textarea>
        </div>
        <div class="gift-type">
          <p>Тип:</p>
          <div class="gift-type-buttons">
          <SelectButton
              class="button-gift-type center"
              :items="giftTypes"
              :selected="getGiftType()"
              @change-select="editGiftType($event, reward)"
              title="Тип гифта"
          />
          <div class="gift-type-random"
               v-if="getGiftType() === 'RANDOM'">
              <div class="gift-type-random-input">
                <p>От:</p>
                <input
                    class="sidebar-small-button quest-task-count center"
                    type="text"
                    :value="getGiftRandomValues().MinRandom"
                    @change="editGiftRandom($event, reward, 'min')"
                    title="Минимальное количество"
                />
              </div>
              <div class="gift-type-random-input">
                <p>До:</p>
                <input
                    class="sidebar-small-button quest-task-count center"
                    type="text"
                    :value="getGiftRandomValues().MaxRandom"
                    @change="editGiftRandom($event, reward, 'max')"
                    title="Максимальное количество"
                />
              </div>
            </div>
          </div>



        </div>
    </div>
        <span
            class="reward-gift-item"
            v-for="item in getGiftItems()"
        >
          <span
              class="reward-item-data"
              @contextmenu.prevent
              @click.right.shift.stop="deleteGiftItem(item)"
          >
        <img loading="lazy" class="sidebar-item-icon"
             :src="iconById(item.id)"
             @click="showItemPicker($event, editGiftItem, item)"
             alt=""/>
        <p class="sidebar-item-name" :title="item.id">{{ item.name }}</p>
      </span>
          <input class="sidebar-small-button quest-reward-count center"
                 type="text" :value="item.count"
                 @change="editGiftItem(item, item.id, $event.target.value)"
                 title="Количество предметов"
          />
        </span>
                  <span class="sidebar-add-button reward-add center"
                        @click="addGiftItem()"
                        title="Добавить предмет"
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
import {giftTypes} from "@/constants/questConstants.js";
import SelectButton from "@/components/ui/SelectButton.vue";

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

const getGiftName = () => {
  let giftID = props.reward.id
  let giftNBT = giftStringToObject(giftID)
  return giftNBT.display.Name
}

const editGiftName = (event, reward) => {
  let giftID = props.quest.rewards[reward.num_id]
  let giftNBT = giftStringToObject(giftID)

  let finalGift = giftID.slice(0, giftID.indexOf("{"));
  giftNBT.display.Name = event.target.value

  finalGift = finalGift + customStringify(giftNBT)
  props.quest.rewards[reward.num_id] = finalGift
  saveSnapshot()
}

const getGiftLore = () => {
  let giftID = props.reward.id
  let giftNBT = giftStringToObject(giftID)
  return giftNBT.display.Lore
}

const editGiftLore = (event, reward) => {
  let giftID = props.quest.rewards[reward.num_id]
  let giftNBT = giftStringToObject(giftID)

  let finalGift = giftID.slice(0, giftID.indexOf("{"));
  giftNBT.display.Lore = event.target.value

  finalGift = finalGift + customStringify(giftNBT)
  props.quest.rewards[reward.num_id] = finalGift
  saveSnapshot()
}

const getGiftType = () => {
  let giftID = props.reward.id
  let giftNBT = giftStringToObject(giftID)
  return giftNBT.DropType
}

const editGiftType = (event, reward) => {
  let giftID = props.quest.rewards[reward.num_id]
  let giftNBT = giftStringToObject(giftID)

  let finalGift = giftID.slice(0, giftID.indexOf("{"));
  giftNBT.DropType = event

  if (event === "RANDOM") {
    giftNBT.MinRandom = 1
    giftNBT.MaxRandom = 1
  } else if (event === "DEFAULT") {
    delete giftNBT.MinRandom
    delete giftNBT.MaxRandom
  }

  finalGift = finalGift + customStringify(giftNBT)
  props.quest.rewards[reward.num_id] = finalGift
  saveSnapshot()
}

const getGiftRandomValues = () => {
  let giftID = props.reward.id
  let giftNBT = giftStringToObject(giftID)
  return {
    MinRandom: giftNBT.MinRandom.value || 1,
    MaxRandom: giftNBT.MaxRandom.value || 1,
  }
}

const editGiftRandom = (event, reward, type) => {
  let giftID = props.quest.rewards[reward.num_id]
  let giftNBT = giftStringToObject(giftID)

  let finalGift = giftID.slice(0, giftID.indexOf("{"));

  if (type === 'min') {
    giftNBT.MinRandom = parseInt(event.target.value)
  } else if (type === 'max') {
    giftNBT.MaxRandom = parseInt(event.target.value)
  }

  finalGift = finalGift + customStringify(giftNBT)
  props.quest.rewards[reward.num_id] = finalGift
  saveSnapshot()
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

.gift-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}

.gift-info:hover {
  background-color: var(--primary-hover);
  box-shadow: 0 0 0.25rem var(--special);
}

.gift-name, .gift-lore, .gift-type {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.gift-name p, .gift-lore p, .gift-type > p:first-child {
  width: 2rem;
  flex-shrink: 0;
}

.gift-input-field,
.gift-type-buttons {
  flex: 1
}

.gift-type-buttons {
  display: flex;
  gap: 1rem;
}

.gift-type-random {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.5625rem;
}

.gift-type-random-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
}

.gift-input-field {
  width: 100%;
  border-radius: 0.25rem;
}

.button-gift-type {
  padding: 0;
  background: var(--secondary);
  border-radius: 5px;
  border: black solid 1px;
  width: 8rem;
  height: 2rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: scale 0.2s ease;
}

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
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.reward-gift-item:hover {
  background: var(--primary-hover);
  box-shadow: 0 0 0.25rem var(--special);
}

</style>