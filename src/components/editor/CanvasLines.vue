<template>
  <canvas id="drawLine" ref="canvas" class="lines-canvas"/>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick, inject, onBeforeUnmount} from 'vue';
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


const scale = inject("scale")
const offset = inject("offset")


onMounted(() => {
  ctx.value = canvas.value.getContext("2d")
  resizeCanvas()
  canvasLines()

  window.addEventListener("resize", () => {
    resizeCanvas()
    canvasLines()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeCanvas)
})

const resizeCanvas = () => {
  const container = document.querySelector(".quests-container")
  if (!container || !canvas.value) return

  canvas.value.width = container.clientWidth
  canvas.value.height = container.clientHeight
}

const toScreen = (x, y) => {
  return {
    x: (x * scaleField + iconSize / 2 + questNodesOffset * 2) * scale.value + offset.value.x,
    y: (y * scaleField + iconSize / 2 + questNodesOffset) * scale.value + offset.value.y
  }
}

const canvasLines = () => {
  if (!ctx.value || !canvas.value) return

  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  Object.keys(props.quests).forEach(key => {
    const quest = props.quests[key]

    const parentLines = getParentLines(quest)
    if (!parentLines.length) return

    const p1 = toScreen(quest.displayX, quest.displayY)
    const questRarity = quest.rarity || "UNCOMMON"

    parentLines.forEach(line => {
      const p2 = toScreen(line[0], line[1])
      const isHidden = line[2] === "HIDDEN"

      const colors = isHidden ? ["#FFCBDB", "#FFCBDB"] : [questRarities[questRarity], questRarities[line[3]]]


      const angle = Math.atan2(line[1] - quest.displayY, line[0] - quest.displayX) * (180 / Math.PI)
      let direction =
          (angle >= 45 && angle <= 135) ||
          (angle < 0 && angle > -45) ||
          (angle < -135 && angle > -180)

      if (line[4] === "INVERTED") direction = !direction

      drawLine(
          p1,
          p2,
          colors,
          line[4],
          isHidden,
          direction
      )
    })
  })
}


const drawLine = (p1, p2, colors, lineType, isHidden, direction) => {

  ctx.value.beginPath()

  const grad = ctx.value.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
  grad.addColorStop(0, colors[0] || "#ffffff")
  grad.addColorStop(1, colors[1] || "#ffffff")

  ctx.value.strokeStyle = grad
  ctx.value.globalAlpha = isHidden ? 0.15 : 1
  ctx.value.lineWidth = isHidden ? 1 : 2

  if (lineType === "STRAIGHT") {
    ctx.value.moveTo(p1.x, p1.y)
    ctx.value.lineTo(p2.x, p2.y)
  } else {

    const controlX = (p1.x + p2.x) / 2
    const controlY = direction ? Math.min(p1.y, p2.y) : Math.max(p1.y, p2.y)

    ctx.value.moveTo(p1.x, p1.y)
    ctx.value.quadraticCurveTo(controlX, controlY, p2.x, p2.y)
  }

  ctx.value.stroke()
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

watch([offset, scale, () => props.quests], () => {
  nextTick(() => canvasLines())
}, { deep: true })

const draw = (e) => {

  if (isDrawing.value && e.target.id === "") {
    lineDraw(drawX.value, drawY.value, e.pageX, e.pageY);
    drawX.value = e.pageX;
    drawY.value = e.pageY;
  }
}

const lineDraw = (x1, y1, x2, y2) => {
  ctx.value.beginPath();
  ctx.value.moveTo(x1, y1);
  ctx.value.lineTo(x2, y2);
  ctx.value.stroke();
}

const beginDrawing = (e) => {
  if (e.target.classList[0] === 'quest') {
    ctx.value.globalAlpha = 1
    ctx.value.strokeStyle = 'lightgray';
    ctx.value.lineWidth = 2;
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
    if (e.target.classList[0] === "quest" && e.target.id !== drawStartQuestID.value) {
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
.lines-canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>