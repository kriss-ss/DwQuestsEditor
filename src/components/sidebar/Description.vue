<template>
  <div class="sidebar-quest-description">
    <p class="sidebar-elem-title">Описание</p>
    <span class="quest-description-format-buttons">
            <span class="format-button bold-format" @click="wrapSelectedText('l')">Ж</span>
            <span class="format-button italic-format" @click="wrapSelectedText('o')">К</span>
            <span class="format-button underline-format" @click="wrapSelectedText('n')">Ч</span>
            <span class="format-button line-through-format" @click="wrapSelectedText('m')">М</span>
            <span class="format-button obfuscate-format" @click="wrapSelectedText('k')">k</span>
            <span class="format-colors-buttons">
              <span
                  v-for="color in Object.keys(mcColors)"
                  @click="wrapSelectedText(color)"
                  class="color-button"
                  :style="{
                    backgroundColor: mcColors[color]
                   }"
              ></span>
            </span>
          </span>

    <textarea
        class="quest-description-input"
        type="text"
        ref="textarea"

        v-model="quest.description"
        @change="saveSnapshot"

    ></textarea>

  </div>
</template>

<script setup>
import {mcColors} from "@/constants/questConstants.js";
import {inject, nextTick, onMounted, ref} from "vue";


const props = defineProps({
  quest: {
    type: Object,
    required: true
  }
})

const saveSnapshot = inject('saveSnapshot')
const textarea = ref(null)


onMounted(() => {
  setInterval(obfuscateText, 20);
})

const obfuscateText = () => {
  $('.obfuscate-format').each(function () {
    let text = $(this).text();
    let obfuscated = text.split('').map(() => getRandomChar()).join('');
    $(this).text(obfuscated);
  });
}
const getRandomChar = () => {
  let min = 160;
  let max = 255;
  return String.fromCharCode(Math.floor(Math.random() * (max - min + 1)) + min);
}


const editDescription = (event) => {
  props.quest.description = event.target.value;
  saveSnapshot()
}

const wrapSelectedText = (colorSymbol) => {

  const start = textarea.value.selectionStart;
  const end = textarea.value.selectionEnd;


  if (start === end) return; // Если ничего не выделено

  const selectedText = props.quest.description.substring(start, end);
  const wrappedText = `§${colorSymbol + selectedText}§r`;
  props.quest.description =
      props.quest.description.substring(0, start) + wrappedText + props.quest.description.substring(end);

  // Вернуть курсор на место после замены
  nextTick(() => {
    textarea.value.selectionStart = start;
    textarea.value.selectionEnd = start + wrappedText.length;
    textarea.value.focus();
  });
}

</script>

<style scoped>


.quest-description-input {
  width: 100%;
  /*min-width: 321px;*/
  height: 12rem;
  /*max-width: 1000px;*/
  background: var(--secondary);
  border-radius: 0.3125rem;
  margin-top: 0.5rem;
  display: flex;
}

.format-colors-buttons {
  position: absolute;
  top: -1.5625rem;
  left: 9.6875rem;
  background-color: var(--secondary);
  display: grid;
  grid-template-columns: repeat(8, 1.125rem);
  grid-template-rows: repeat(2, 1.125rem);

  row-gap: 0.375rem;
  column-gap: 0.1875rem;

  /*display: flex;*/
  width: 10.6875rem;
  height: 3.125rem;
  /*columns: 3px;*/
  border-radius: 5px;
  padding: 0.25rem 0.1875rem;
  /*position: relative;*/
  /*top: -25px;*/

}

.quest-description-format-buttons {
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: repeat(6, 1.875rem);
  position: relative;
}

.format-button {
  width: 1.5625rem;
  height: 1.5625rem;
  border-radius: 5px;
  border: black 1px solid;
  background-color: var(--secondary);
  text-align: center;
  cursor: pointer;
}

.color-button {
  width: 100%;
  height: 1.125rem;
  border: 1px black solid;
  border-radius: 5px;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

</style>