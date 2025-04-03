import { audioPlayer } from './utils.js'
import { trackLoopButtons as loopButtons } from './controls.js'

const STORAGE_KEY = 'trackState'

export const trackState = {
    isLooping: false,
    volume: 1,
}

const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackState))
}

const loadState = () => {
    const savedState = localStorage.getItem(STORAGE_KEY)

    if (savedState) {
        Object.assign(trackState, JSON.parse(savedState))
    }
}

export const toggleLoop = () => {
    trackState.isLooping = !trackState.isLooping
    audioPlayer.loop = trackState.isLooping

    loopButtons.forEach((button) => {
        button.classList.toggle('active', trackState.isLooping)
    })

    saveState()
}

export const setVolume = (newVolume) => {
    trackState.volume = newVolume
    audioPlayer.volume = newVolume

    saveState()
}

loadState()
