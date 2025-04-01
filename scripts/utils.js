import { renderPlaylist } from './playlist.js'
import { musicState } from './musicState.js'
import { playlistState, setCurrentTrackId } from './playlistState.js'

export const audioPlayer = document.getElementById('audio-player')
const player = document.getElementById('player')
const trackCover = document.querySelector('#player .track-cover')
const musicName = document.getElementById('music-name')
const artistName = document.getElementById('artist-name')
export const volumeControl = document.getElementById('volume-control')

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}

export const isValidId = (id) => playlistState.playlistOrder.includes(id)

export const playCurrentTrack = () => playTrack(playlistState.currentTrackId)

export const updateTrackInfo = (track) => {
    const image = new Image()
    image.src = track.cover || 'assets/images/default-cover.jpg'

    image.onload = () => {
        trackCover.src = image.src
    }

    image.onerror = () => {
        console.warn('Capa inválida')
        trackCover.src = 'assets/images/default-cover.jpg'
    }

    musicName.textContent = track.name
    artistName.textContent = track.artist
}

export const playTrack = (trackId) => {
    setCurrentTrackId(trackId)
    updatePlayerVisibility()

    const track = playlistState.playlist.find((track) => track.id === trackId)
    if (!track) return

    audioPlayer.src = track.src
    audioPlayer.volume = musicState.volume

    updateTrackInfo(track)

    audioPlayer.load()
    audioPlayer.play().catch((error) => console.error('Erro ao tentar tocar a música:', error))

    renderPlaylist()
}

const updatePlayerVisibility = () => {
    if (isValidId(playlistState.currentTrackId)) {
        player.classList.add('open')
    } else {
        player.classList.remove('open')
    }
}
