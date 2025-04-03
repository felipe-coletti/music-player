import { updatePlayerVisibility } from './utils.js'
import { shuffleButtons, playlistLoopButton as loopButton } from './controls.js'

const STORAGE_KEY = 'playlistState'

export const playlistState = {
    playlist: [],
    currentTrackId: null,
    playlistOrder: [],
    isLooping: false,
    isShuffle: false,
}

export const savePlaylist = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlistState))
}

export const loadPlaylist = () => {
    const savedState = localStorage.getItem(STORAGE_KEY)

    if (savedState) {
        Object.assign(playlistState, JSON.parse(savedState))
    }
}

export const setPlaylist = (newPlaylist) => {
    playlistState.playlist = newPlaylist
    playlistState.playlistOrder = newPlaylist.map((track) => track.id)

    savePlaylist()
}

export const setCurrentTrackId = (newId) => {
    playlistState.currentTrackId = newId

    savePlaylist()
}

export const setPlaylistOrder = (newPlaylistOrder) => {
    playlistState.playlistOrder = newPlaylistOrder

    savePlaylist()
}

export const toggleShuffle = () => {
    playlistState.isShuffle = !playlistState.isShuffle

    shuffleButtons.forEach((button) => {
        button.classList.toggle('active', playlistState.isShuffle)
    })

    savePlaylist()
}

export const toggleLoop = () => {
    playlistState.isLooping = !playlistState.isLooping

    loopButton.classList.toggle('active', playlistState.isLooping)

    savePlaylist()
}

export const addTrack = (track) => {
    if (playlistState.playlist.some((existingTrack) => existingTrack.id === track.id)) {
        console.error('Track with this ID already exists.')
        return
    }

    if (!track.src || !track.name || !track.artist) {
        console.error('Invalid track data.')
        return
    }

    playlistState.playlist.push(track)
    playlistState.playlistOrder.push(track.id)

    savePlaylist()
}

export const removeTrack = (trackId) => {
    playlistState.playlist = playlistState.playlist.filter((track) => track.id !== trackId)
    playlistState.playlistOrder = playlistState.playlistOrder.filter((id) => id !== trackId)

    if (playlistState.currentTrackId === trackId) {
        playlistState.currentTrackId = null
        audioPlayer.src = ''
        updateTrackInfo(null)
        updatePlayerVisibility()
    }

    savePlaylist()
}

loadPlaylist()
