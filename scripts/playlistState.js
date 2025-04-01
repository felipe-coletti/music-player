const STORAGE_KEY = 'playlistState'

const shuffleButtons = document.querySelectorAll('.shuffle-button')
const loopButton = document.getElementById('playlist-loop-button')

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
    const trackIndex = playlistState.playlist.findIndex((track) => track.id === parseInt(trackId))

    if (trackIndex !== -1) {
        playlistState.playlist.splice(trackIndex, 1)

        playlistState.playlistOrder = playlistState.playlistOrder.filter((id) => id !== trackId)

        savePlaylist()
    }
}

loadPlaylist()
