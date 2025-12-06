<template>
  <textarea
      class="reward-script-nbt"
      :value="reward.id"
  ></textarea>
</template>

<script setup>

const props = defineProps({
  reward: {
    type: Object,
    required: true,
  },
  quest: {
    type: Object,
    required: true,
  }
})
</script>

<style scoped>

.reward-script-nbt {
  height: 6.25rem;
  background: var(--secondary);
  border-radius: 5px;
  margin-bottom: 0.5rem;
  padding: 0.25rem;
}

</style>