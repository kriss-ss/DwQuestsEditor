<template>
  <main
      @dragover.prevent
      @drop="dropFileTab"
      class="index-page">
    <img src="/src/assets/img/bg.png" class="index-bg" alt="">
    <div class="index-container">
      <div class="index-menu">

        <span
            @click="addNewTab"
            class="index-menu-new">

          <svg height="3rem" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.4585 18.5H34.5418" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.5 2.4585V34.5418" stroke="#1C1C1C" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </span>

        <span
            @click="openFilePicker"
            class="index-menu-file">
          <svg height="3rem" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.9998 2.3335H4.99984C4.11578 2.3335 3.26794 2.68469 2.64281 3.30981C2.01769 3.93493 1.6665 4.78277 1.6665 5.66683V32.3335C1.6665 33.2176 2.01769 34.0654 2.64281 34.6905C3.26794 35.3156 4.11578 35.6668 4.99984 35.6668H24.9998C25.8839 35.6668 26.7317 35.3156 27.3569 34.6905C27.982 34.0654 28.3332 33.2176 28.3332 32.3335V10.6668L19.9998 2.3335Z" stroke="var(--primary)" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3335 2.3335V9.00016C18.3335 9.88422 18.6847 10.7321 19.3098 11.3572C19.9349 11.9823 20.7828 12.3335 21.6668 12.3335H28.3335" stroke="var(--primary)" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 19V29" stroke="var(--primary)" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 24L15 19L10 24" stroke="var(--primary)" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </span>

        <input
            type="file"
            ref="fileInput"
            @change="FromFileTab"
            style="display: none;"
            accept="application/json,.json,.txt"
        />

        <span
            @click="RecentTab"
            class="index-menu-insert">
          <svg height="3rem" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.0002 3.3335H15.0002C14.5581 3.3335 14.1342 3.50909 13.8217 3.82165C13.5091 4.13421 13.3335 4.55814 13.3335 5.00016V8.3335C13.3335 9.3335 14.0002 10.0002 15.0002 10.0002H25.0002C26.0002 10.0002 26.6668 9.3335 26.6668 8.3335V5.00016C26.6668 4.00016 26.0002 3.3335 25.0002 3.3335Z" stroke="var(--primary)" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3332 6.6665H9.99984C9.11578 6.6665 8.26794 7.01769 7.64281 7.64281C7.01769 8.26794 6.6665 9.11578 6.6665 9.99984V33.3332C6.6665 34.2172 7.01769 35.0651 7.64281 35.6902C8.26794 36.3153 9.11578 36.6665 9.99984 36.6665H29.9998C30.8839 36.6665 31.7317 36.3153 32.3569 35.6902C32.982 35.0651 33.3332 34.2172 33.3332 33.3332M26.6665 6.6665H29.9998C30.8839 6.6665 31.7317 7.01769 32.3569 7.64281C32.982 8.26794 33.3332 9.11578 33.3332 9.99984V13.3332M18.3332 23.3332H34.9998" stroke="var(--primary)" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28.3335 16.6665L35.0002 23.3332L28.3335 29.9998" stroke="var(--primary)" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </span>
      </div>
      <div class="index-nickname">Made by /krissss/</div>
    </div>
  </main>
</template>
<script setup>
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();
const fileInput = ref(null)

const readFile = (file) => {
  if (!file.name.endsWith('.json') && !file.name.endsWith('.txt')) {
    alert('Пожалуйста, выберите правильный файл');
    return;
  }
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (e) => {
    const content = e.target.result;
    const parsedData = JSON.parse(content);
    if (!isValidTabStructure(parsedData)) {
      alert('Неверная структура файла');
      return;
    }
    localStorage.setItem("current-tab", content);
    router.push('/editor')
  }
}

const isValidTabStructure = (data) => {
  const default_tab = {
    tabID: "",
    iconItem: "",
    sortIndex: 0,
    quests: {}
  };

  const requiredFields = Object.keys(default_tab);
  const dataFields = Object.keys(data);

  return requiredFields.every(field => dataFields.includes(field));
}

const dropFileTab = (event) => {
  event.preventDefault();
  readFile(event.dataTransfer.files[0])
}

const addNewTab = () => {
  let default_tab = {
    tabID: "Новый таб",
    iconItem: "minecraft:bedrock",
    sortIndex: 1,
    quests: {}
  }
  localStorage.setItem("current-tab", JSON.stringify(default_tab));
  router.push('/editor')
}

const openFilePicker = () => {
  if (fileInput.value) fileInput.value.click();
}

const FromFileTab = (event) => {
  readFile(event.target.files[0])
}

const RecentTab = () => {
  router.push('/editor')
}

const FromClipboardTab = async () => {
  navigator.clipboard.readText().then(text => {
    localStorage.setItem("current-tab", text);
    router.push('/editor')
  });
}
</script>

<style scoped>
.index-nickname {
  position: absolute;
  background: initial;
  top: 90%;
  left: 50%;
  transform: translateX(-50%);
  color: #42AAFF;
  font-size: 20px;
  font-family: minecraft, sans-serif;
  letter-spacing: 4px;
  padding: 4px 12px 4px 20px;
  z-index: 2;
}

.index-page {
  position: relative;
  background-color: var(--primary);
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.index-bg {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  filter: brightness(45%);
}

.index-menu {
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: 3rem;
}

.index-menu-new, .index-menu-file, .index-menu-insert {
  display: flex;
  width: 6rem;
  height: 6rem;
  background: #42AAFF;
  border-radius: 0.25rem;
  justify-content: center;
  align-items: center;

  box-shadow: 0 1.5rem 1.5rem rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: transform 0.2s;
}

.index-menu-new:hover,
.index-menu-file:hover,
.index-menu-insert:hover {
  transform: scale(1.08);
}

</style>