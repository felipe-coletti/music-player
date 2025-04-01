import { audioPlayer, volumeControl } from './utils.js'
import { renderPlaylist } from './playlist.js'
import { loadPlaylist } from './playlistState.js'
import { setupControlEvents, setupAudioEvents } from './controls.js'
import { trackState } from './trackState.js'

const fetchPlaylist = () => {
    loadPlaylist()
    renderPlaylist()
}

const initApp = () => {
    fetchPlaylist()

    audioPlayer.volume = trackState.volume
    volumeControl.value = trackState.volume * 100
    audioPlayer.loop = trackState.isLooping

    updateRangeProgress(volumeControl)
    setupControlEvents()
    setupAudioEvents()
}

document.addEventListener('DOMContentLoaded', initApp)
