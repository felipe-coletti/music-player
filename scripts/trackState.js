import { audioPlayer } from './utils.js'

const STORAGE_KEY = 'trackState'

const loopButton = document.getElementById('track-loop-button')

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

    loopButton.classList.toggle('active', trackState.isLooping)

    saveState()
}

export const setVolume = (newVolume) => {
    trackState.volume = newVolume
    audioPlayer.volume = newVolume

    saveState()
}

loadState()
