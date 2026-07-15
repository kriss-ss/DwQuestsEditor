<template>
  <Transition name="slide-fade">
    <div
        v-if="data.visible"
        class="notifications">
      <div class="line"
           :style="{color: getStatusColor(data.status)}"
      ></div>
      <div class="icon"
           v-html="data.icon">
      </div>
      <div class="text">
        <p class="text-body">{{ data.text }}</p>
      </div>
    </div>
  </Transition>
</template>


<script setup>

import {onUnmounted, ref, watch} from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})

let timer = null;

const getStatusColor = (status) => {
  switch (status) {
    case "success":
      return "green";
    case "error":
      return "red";
    case "info":
      return "yellow";
    default:
      return "white";
  }
}


watch(() => props.data.visible, () => {
  timer = setTimeout(() => {
    props.data.visible = false;
    clearTimeout(timer);
  }, 3000)
})


</script>


<style scoped>

.notifications {
  display: grid;
  grid-template-columns: 5px 60px auto;
  grid-gap: 10px;
  height: 100px;
  width: 300px;
  background: black;

  padding-right: 10px;

  position: fixed;
  top: 10%;
  right: 0;

  opacity: 0.85;

  z-index: 9;
}

.line {
  background: greenyellow;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.text {
  display: flex;
  gap: 8px;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  font-family: Inter, sans-serif;
}

.text-body {

}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(90%);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

</style>