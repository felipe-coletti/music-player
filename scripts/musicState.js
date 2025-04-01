import { audioPlayer } from './utils.js'

const STORAGE_KEY = 'musicState'

const loopButton = document.getElementById('track-loop-button')

export const musicState = {
    isLooping: false,
    volume: 1,
}

const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(musicState))
}

const loadState = () => {
    const savedState = localStorage.getItem(STORAGE_KEY)

    if (savedState) {
        Object.assign(musicState, JSON.parse(savedState))
    }
}

export const toggleLoop = () => {
    musicState.isLooping = !musicState.isLooping
    audioPlayer.loop = musicState.isLooping

    loopButton.classList.toggle('active', musicState.isLooping)

    saveState()
}

export const setVolume = (newVolume) => {
    musicState.volume = newVolume
    audioPlayer.volume = newVolume

    saveState()
}

loadState()
