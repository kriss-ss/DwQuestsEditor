<template>
  <div class="sidebar-quest-description">
    <div class="sidebar-elem-title">
      <p>Описание</p>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="title-icon">
        <title>Для использования модификаторов выделите часть текста</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 17l0 .01" />
        <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />
      </svg>
    </div>

    <span class="quest-description-format-buttons">
            <span class="format-button bold-format" @click="wrapSelectedText('l')" title="Полужирный">Ж</span>
            <span class="format-button italic-format" @click="wrapSelectedText('o')" title="Курсив">К</span>
            <span class="format-button underline-format" @click="wrapSelectedText('n')" title="Подчеркнутый">Ч</span>
            <span class="format-button line-through-format" @click="wrapSelectedText('m')" title="Зачеркнутый">М</span>
            <span class="format-button obfuscate-format" @click="wrapSelectedText('k')" title="Обфускация">k</span>
            <span class="format-colors-buttons">
              <span
                  v-for="color in mcColors"
                  :key="color.key"
                  @click="wrapSelectedText(color.key)"
                  class="color-button"
                  :style="{
                    backgroundColor: color.value
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
    saveSnapshot()
  });
}

</script>

<style scoped>

.title-icon {
  transition: all 0.2s ease;
}

.title-icon:hover {
  stroke: var(--special);
}

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