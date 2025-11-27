import {ref, onMounted, onUnmounted, provide} from 'vue'

export function dragField() {
    const offset = ref({ x: 0, y: 0 })
    const scale = ref(1)
    const isDragging = ref(false)
    const startDragPosition = ref({ x: 0, y: 0 })

    provide('scale', scale)
    provide("offset", offset)

    const config = {
        minScale: 0.5,
        maxScale: 2,
        zoomFactor: 0.1,
    }

    const startDrag = (event, isEdit) => {
        const isLeftClick = event.which === 1;
        if (isLeftClick && isEdit) return;
        if (event.target.closest('.quest')) return;

        isDragging.value = true;
        startDragPosition.value = { x: event.clientX - offset.value.x, y: event.clientY - offset.value.y };
    }

    const onDrag = (event) => {
        if (isDragging.value) {
            offset.value.x = event.clientX - startDragPosition.value.x;
            offset.value.y = event.clientY - startDragPosition.value.y;
        }
    }

    const endDrag = () => {
        isDragging.value = false;
    }

    const onZoom = (event) => {

        const zoomFactor = config.zoomFactor;
        const newScale = scale.value * (event.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor);
        const clampedScale = Math.min(Math.max(newScale, config.minScale), config.maxScale);

        const rect = document.querySelector(".quests-field").getBoundingClientRect();
        const mouseX = event.clientX - rect.left - 40;
        const mouseY = event.clientY - rect.top - 40;

        const scaleRatio = clampedScale / scale.value;
        offset.value.x = mouseX - (mouseX - offset.value.x) * scaleRatio;
        offset.value.y = mouseY - (mouseY - offset.value.y) * scaleRatio;

        scale.value = clampedScale;

        if (isDragging.value) {
            startDrag(event)
        }
    }

    const getTransform = () => {
        return `translate(${offset.value.x}px, ${offset.value.y}px) scale(${scale.value})`
    }

    return {
        startDrag,
        endDrag,
        onDrag,
        onZoom,
        getTransform,
        offset,
        scale
    }
}