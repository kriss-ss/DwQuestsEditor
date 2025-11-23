<template>
  <select
      @change="emit('changeSelect', $event.target.value)"
      @mousewheel.passive="scrollValues"
      @mousewheel.prevent
  >
    <option
        ref="option"
        v-for="item in Object.keys(items)"
        :value="item"
        :selected="item === selected"
    >
      {{ items[item] }}
    </option>
  </select>
</template>


<script setup>

import {ref} from "vue";

const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
  selected: {
    // type: String,
    required: true,
  }
})

const option = ref(null)

const emit = defineEmits(["changeSelect"]);


const scrollValues = (event) => {
  const currentValue = Object.keys(props.items).indexOf(event.target.value)
  const itemsLength = Object.keys(props.items).length;
  let newValue;

  if (event.deltaY > 0) {
    newValue = (currentValue + 1) % itemsLength;
  } else {
    newValue = (currentValue - 1 + (itemsLength)) % itemsLength
  }

  const value = Object.keys(props.items)[newValue]
  emit('changeSelect', value)
}

</script>


<style scoped>

</style>