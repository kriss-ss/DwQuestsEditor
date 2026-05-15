<template>
  <router-view/>
</template>

<script setup>

import {onMounted} from "vue";
import {initItemsData, initItemsNamesData} from "@/utils/getItems.js";

onMounted(() => {
  initItemsData()
  initItemsNamesData()
});

let userToken = localStorage.getItem('userToken')
if (!userToken) {
  userToken = crypto.randomUUID()
  localStorage.setItem('userToken', userToken)
}

</script>