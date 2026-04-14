<template>
  <router-view/>
</template>

<script setup>

let userToken = localStorage.getItem('userToken')
if (!userToken) {
  userToken = crypto.randomUUID()
  localStorage.setItem('userToken', userToken)
}

</script>