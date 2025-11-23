<template>
  <canvas id="drawLine"/>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, inject } from 'vue';
import {
  scaleField,
  iconSize,
  lineWidth,
  questRarities,
  questNodesOffset,
  canvasSizes,
  canvasCenter
} from "@/constants/questConstants.js";

const props = defineProps({
  quests: {
    type: Object,
    required: true
  },
  saveSnapshot: {
    type: Function,
    required: true
  }
})


const canvas = ref(null)
const ctx = ref(null)
const isDrawing = ref(false)
const drawX = ref(0)
const drawY = ref(0)
const drawStartQuestID = ref("")

const _drawQueued = ref(false)


onMounted(() => {
  canvas.value = document.getElementById('drawLine')
  ctx.value = canvas.value.getContext('2d')
  setupCanvas()
  canvasLines()
})

const setupCanvas = () => {
  canvas.value.width = canvasSizes
  canvas.value.height = canvasSizes
  canvas.value.style.position = 'absolute'
  canvas.value.style.left = `-${canvasCenter}px`
  canvas.value.style.top = `-${canvasCenter}px`
}



// watch([
//   () => props.quests,
// ], () => {
//   nextTick(() => {
//     canvasLines()
//   })
// }, {deep: true})


const canvasLines = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  Object.keys(props.quests).forEach(key => {
    let lines = getParentLines(props.quests[key])
    if (lines.length === 0) return;
    let quest_coords = [props.quests[key].displayX, props.quests[key].displayY, "DEFAULT"]
    lines.forEach((line) => {
      if (line[2] === "HIDDEN") {
        ctx.value.globalAlpha = 0.15
        ctx.value.lineWidth = 2
        drawLine(quest_coords, line, ["#FFCBDB", "#FFCBDB"], "STRAIGHT");
      } else {
        ctx.value.globalAlpha = 1
        ctx.value.lineWidth = lineWidth
        let colors = [questRarities[props.quests[key].rarity || "UNCOMMON"], questRarities[line[3]]]
        drawLine(quest_coords, line, colors, line[4]);
      }
    })
  })
}

const drawLine = (point1, point2, colors, lineType) => {
  const [x1, y1] = [point1[0] * scaleField + iconSize / 2 + canvasCenter + questNodesOffset, point1[1] * scaleField + iconSize / 2 + canvasCenter + questNodesOffset];
  const [x2, y2] = [point2[0] * scaleField + iconSize / 2 + canvasCenter + questNodesOffset, point2[1] * scaleField + iconSize / 2 + canvasCenter + questNodesOffset];
  if (typeof colors[0] == 'undefined' || typeof colors[1] == 'undefined') return 0;
  const grad = ctx.value.createLinearGradient(x1,y1, x2,y2);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(1, colors[1]);
  ctx.value.beginPath();
  ctx.value.moveTo(x1,y1);
  let direction = false;
  if (lineType === "STRAIGHT") {
    ctx.value.lineTo(x2, y2);
  } else {
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    if ((angle >= 45 && angle <= 135) ||
        (angle < 0 && angle > -45) ||
        (angle < -135 && angle > -180)) {
      direction = true;
    }
    if (lineType === "INVERTED") direction = !direction;
    const controlX = (x1 + x2) / 2;
    const controlY = direction ? Math.min(y1, y2) : Math.max(y1, y2);
    ctx.value.quadraticCurveTo(controlX, controlY, x2, y2);
  }
  ctx.value.strokeStyle = grad;
  ctx.value.stroke();
}

const getParentLines = (quest) => {
  let lines = [];

  if (!(quest["parents"])) return [];

  quest["parents"].forEach(parent => {
    const parentQuest = props.quests[parent["questID"]]
    if (parentQuest === undefined) return

    let parentType = parent.parentType || "DEFAULT";
    let lineType = parent.lineType || "DEFAULT";
    let color = parentQuest.rarity || "UNCOMMON";
    let displayX = parentQuest.displayX
    let displayY = parentQuest.displayY
    lines.push([displayX, displayY, parentType, color, lineType]);
  })
  return lines;
}

// const getWindowResolution = () => {
//   let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
//
//   for (const { displayX, displayY } of Object.values(this.tab.quests)) {
//     minX = Math.min(minX, displayX);
//     minY = Math.min(minY, displayY);
//     maxX = Math.max(maxX, displayX);
//     maxY = Math.max(maxY, displayY);
//   }
//
//   let width = Math.ceil((-minX + maxX) * scaleContainer) + iconSize
//   let height = Math.ceil ((-minY + maxY) * scaleContainer) + iconSize
//
//   let offsetX = -minX * scaleContainer
//   let offsetY = -minY * scaleContainer
//
//   // console.log(width, height, offsetX, offsetY)
//   return [width * 0, height * 0, offsetX * 0, offsetY * 0]
// }

const lineDraw = (x1, y1, x2, y2) => {
  ctx.value.beginPath();
  ctx.value.strokeStyle = 'lightgray';
  ctx.value.lineWidth = 2;
  ctx.value.moveTo(x1, y1);
  ctx.value.lineTo(x2, y2);
  ctx.value.stroke();
  ctx.value.closePath();
}

const draw = (e) => {
  if(isDrawing.value && e.target.id === "drawLine") {

    lineDraw(drawX.value, drawY.value, e.offsetX, e.offsetY);
    drawX.value = e.offsetX;
    drawY.value = e.offsetY;
  }
}

const beginDrawing = (e) => {
  if (e.target.classList[0] === 'quest') {
    ctx.value.globalAlpha = 1
    drawX.value = e.target.parentElement.x;
    drawY.value = e.target.parentElement.y;
    isDrawing.value = true;
    drawStartQuestID.value = e.target.id;
  }
}

const stopDrawing = (e) => {
  if (isDrawing.value) {
    drawX.value = 0;
    drawY.value = 0;
    isDrawing.value = false;

    if (e.target.id !== "drawLine" && e.target.id !== drawStartQuestID.value) {
      props.quests[e.target.id].parents.push({"questID": drawStartQuestID.value});
      props.saveSnapshot()
    }
    canvasLines()
  }
}

defineExpose({
  canvasLines,
  draw,
  beginDrawing,
  stopDrawing,
})

</script>


<style scoped>

</style>