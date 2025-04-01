import { audioPlayer, volumeControl } from './utils.js'
import { renderPlaylist } from './playlist.js'
import { loadPlaylist } from './playlistState.js'
import { setupControlEvents, setupAudioEvents } from './controls.js'
import { musicState } from './musicState.js'

const fetchPlaylist = () => {
    loadPlaylist()
    renderPlaylist()
}

const initApp = () => {
    fetchPlaylist()

    audioPlayer.volume = musicState.volume
    volumeControl.value = musicState.volume * 100
    audioPlayer.loop = musicState.isLooping

    updateRangeProgress(volumeControl)
    setupControlEvents()
    setupAudioEvents()
}

document.addEventListener('DOMContentLoaded', initApp)
