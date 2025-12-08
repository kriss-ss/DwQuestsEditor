import { ref, onMounted, onUnmounted } from 'vue'
import { cloneDeep } from 'lodash'

export function editorHistory(initialState, options = {}) {
    const {
        maxHistory = 100,
        onStateChange = null,
        ignoreTags = ['INPUT', 'TEXTAREA', 'SELECT']
    } = options

    const history = ref([])
    const currentStep = ref(-1)
    const _keyHandler = ref(null)

    const initialize = () => {
        history.value = [cloneDeep(initialState)]
        currentStep.value = 0
        setupKeyListeners()
    }

    const setupKeyListeners = () => {
        _keyHandler.value = (e) => {
            if (shouldIgnoreKeyEvent(e)) return
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
                e.preventDefault()
                redo()
            } else if (e.ctrlKey && e.code === 'KeyZ') {
                e.preventDefault()
                undo()
            }
        }

        window.addEventListener('keydown', _keyHandler.value)
    }

    const cleanupKeyListeners = () => {
        if (_keyHandler.value) {
            window.removeEventListener('keydown', _keyHandler.value)
            _keyHandler.value = null
        }
    }

    const shouldIgnoreKeyEvent = (e) => {
        const focusedTag = e.target.tagName
        return ignoreTags.includes(focusedTag)
    }

    const saveSnapshot = (newState) => {
        history.value = history.value.slice(0, currentStep.value + 1)

        history.value.push(cloneDeep(newState))
        currentStep.value++

        if (history.value.length > maxHistory) {
            history.value.shift()
            currentStep.value--
        }

        cleanupKeyListeners()
        setupKeyListeners()
    }

    const undo = () => {
        if (currentStep.value > 0) {
            currentStep.value--
            const previousState = cloneDeep(history.value[currentStep.value])

            if (onStateChange) {
                onStateChange(previousState, 'undo')
            }

            return previousState
        }
        return null
    }

    const redo = () => {
        if (currentStep.value < history.value.length - 1) {
            currentStep.value++
            const nextState = cloneDeep(history.value[currentStep.value])

            if (onStateChange) {
                onStateChange(nextState, 'redo')
            }

            return nextState
        }
        return null
    }

    const cleanup = () => {
        cleanupKeyListeners()
        history.value = []
        currentStep.value = -1
    }

    onUnmounted(cleanup)

    return {
        history,
        currentStep,

        initialize,
        saveSnapshot,
        undo,
        redo,

        cleanup,
        cleanupKeyListeners
    }
}