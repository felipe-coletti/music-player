import { audioPlayer, volumeControl, formatTime, isValidId, updateTrackInfo, updatePlayerVisibility } from './utils.js'
import { renderPlaylist } from './playlist.js'
import { playlistState, loadPlaylist } from './playlistState.js'
import { currentTimeDisplays, totalTimeDisplays, setupControlEvents, setupAudioEvents } from './controls.js'
import { trackState } from './trackState.js'
import { updateRangeProgress } from './slider.js'

const fetchPlaylist = () => {
    loadPlaylist()
    renderPlaylist()
}

const loadVolume = () => {
    audioPlayer.volume = trackState.volume
    volumeControl.value = trackState.volume * 100
    audioPlayer.loop = trackState.isLooping

    updateRangeProgress(volumeControl)
}

const initApp = () => {
    fetchPlaylist()
    loadVolume()
    setupControlEvents()
    setupAudioEvents()

    if (playlistState.currentTrackId && isValidId(playlistState.currentTrackId)) {
        const track = playlistState.playlist.find((track) => track.id === playlistState.currentTrackId)

        updateTrackInfo(track)

        if (!audioPlayer.src) {
            audioPlayer.src = track.src
        }

        currentTimeDisplays.forEach((display) => {
            display.textContent = formatTime(0)
        })
        totalTimeDisplays.forEach((display) => {
            display.textContent = formatTime(0)
        })
        updatePlayerVisibility()
    }
}

document.addEventListener('DOMContentLoaded', initApp)
