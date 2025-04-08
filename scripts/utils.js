import { renderPlaylist } from './playlist.js'
import { trackState } from './trackState.js'
import { playlistState, setCurrentTrackId } from './playlistState.js'
import { updatePlayButtons } from './controls.js'

export const audioPlayer = document.getElementById('audio-player')
const player = document.getElementById('player')
const currentTrackCovers = document.querySelectorAll('.current-track-cover')
const trackNames = document.querySelectorAll('.track-name')
const artistNames = document.querySelectorAll('.artist-name')
export const volumeControl = document.getElementById('volume-control')

export const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const isValidId = (id) => playlistState.playlistOrder.includes(id)

export const playCurrentTrack = () => playTrack(playlistState.currentTrackId)

export const updateTrackInfo = (track) => {
    const image = new Image()
    image.src = track.cover || 'assets/images/default-cover.jpg'

    image.onload = () => {
        currentTrackCovers.forEach((trackCover) => {
            trackCover.src = image.src
        })
    }

    image.onerror = () => {
        console.warn('Capa inválida')
        currentTrackCovers.forEach((trackCover) => {
            trackCover.src = 'assets/images/default-cover.jpg'
        })
    }

    trackNames.forEach((trackName) => {
        trackName.textContent = track.name
    })
    artistNames.forEach((artistName) => {
        artistName.textContent = track.artist
    })
}

export const playTrack = (trackId) => {
    setCurrentTrackId(trackId)
    updatePlayerVisibility()

    const track = playlistState.playlist.find((track) => track.id === trackId)
    if (!track) return

    audioPlayer.src = track.src
    audioPlayer.volume = trackState.volume

    updateTrackInfo(track)

    audioPlayer.load()
    audioPlayer.play().catch((error) => console.error('Erro ao tentar tocar a música:', error))
    updatePlayButtons(false)

    renderPlaylist()
}

export const updatePlayerVisibility = () => {
    player.classList.toggle('open', isValidId(playlistState.currentTrackId))
}
