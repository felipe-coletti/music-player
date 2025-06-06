import { audioPlayer, formatTime, isValidId, updateTrackInfo, updatePlayerVisibility } from './utils.js'
import { setupPlaylist } from './playlist.js'
import { playlistState, loadPlaylist } from './playlistState.js'
import { currentTimeDisplays, totalTimeDisplays, setupControlEvents, setupAudioEvents } from './controls.js'
import { setDisplayVolume, trackState } from './trackState.js'

const fetchPlaylist = () => {
	loadPlaylist()
	setupPlaylist()
}

const loadVolume = () => {
	audioPlayer.loop = trackState.isLooping

	if (!trackState.isMuted) {
		setDisplayVolume(trackState.volume)
	} else {
		setDisplayVolume(0)
	}
}

const initApp = () => {
	fetchPlaylist()
	loadVolume()
	setupControlEvents()
	setupAudioEvents()

	if (playlistState.currentTrackId !== null && isValidId(playlistState.currentTrackId)) {
		const track = playlistState.playlist.find(track => track.id === playlistState.currentTrackId)

		updateTrackInfo(track)

		if (!audioPlayer.src) {
			audioPlayer.src = track.src
		}

		currentTimeDisplays.forEach(display => {
			display.textContent = formatTime(0, 'short')
		})
		totalTimeDisplays.forEach(display => {
			display.textContent = formatTime(0, 'short')
		})

		updatePlayerVisibility()
	}
}

document.addEventListener('DOMContentLoaded', initApp)
