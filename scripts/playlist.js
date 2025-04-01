import { isValidId, playTrack, formatTime } from './utils.js'
import { playlistState, addTrack, removeTrack } from './playlistState.js'

const playlistElement = document.getElementById('playlist-content')
const playlistInfo = document.getElementById('playlist-info')
const playlistCover = document.getElementById('playlist-cover')
const modalContainer = document.getElementById('modal-container')
const musicCoverInput = document.getElementById('music-cover-input')
const musicNameInput = document.getElementById('music-name-input')
const artistNameInput = document.getElementById('artist-name-input')
const musicSrcInput = document.getElementById('music-src-input')

export const handleAddTrack = () => {
    if (!musicSrcInput.value || !musicNameInput.value || !artistNameInput.value) {
        alert('Preencha todos os campos obrigatórios!')
        return
    }

    const track = {
        id:
            playlistState.playlist.length > 0
                ? playlistState.playlist[playlistState.playlist.length - 1].id + 1 * Date.now()
                : 0,
        src: musicSrcInput.value,
        name: musicNameInput.value,
        artist: artistNameInput.value,
        cover: musicCoverInput.value,
    }

    addTrack(track)
    renderPlaylist()

    if (modalContainer.classList.contains('open')) {
        modalContainer.classList.remove('open')
    }

    musicCoverInput.value = ''
    musicNameInput.value = ''
    artistNameInput.value = ''
    musicSrcInput.value = ''
}

document.getElementById('add-track-form').addEventListener('submit', (e) => {
    e.preventDefault()
    handleAddTrack()
})

const updatePlaylistCover = () => {
    if (playlistState.playlist.length > 0) {
        const firstTrack = playlistState.playlist[0]
        const image = new Image()
        image.src = firstTrack.cover || 'assets/images/default-cover.jpg'

        image.onload = () => {
            playlistCover.src = image.src
        }

        image.onerror = () => {
            console.warn('Capa inválida')
            playlistCover.src = 'assets/images/default-cover.jpg'
        }
    } else {
        playlistCover.src = 'assets/images/default-cover.jpg'
    }
}

export const renderPlaylist = () => {
    const fragment = document.createDocumentFragment()

    playlistState.playlist.forEach((track, index) => {
        const listItem = document.createElement('li')

        listItem.classList.add('track')
        track.id === playlistState.currentTrackId && listItem.classList.add('playing')

        listItem.innerHTML = `
            <p class="paragraph">${index + 1}</p>
            <div class="track-info">
                <img class="track-cover cover" loading="lazy" />
                <div class="track-text">
                    <h3 class="secondary-title title">${track.name}</h3>
                    <p class="paragraph">${track.artist}</p>
                </div>
            </div>
            <div class="button-group">
                <p class="paragraph track-duration"></p>
                <button type="button" class="remove-button ghost-button icon-button button" onclick="">Remove</button>
            </div>
        `

        const audio = new Audio(track.src)

        audio.addEventListener('loadedmetadata', () => {
            const durationElement = listItem.querySelector('.track-duration')
            durationElement.textContent = formatTime(audio.duration)
        })

        listItem.setAttribute('data-track-id', track.id)
        listItem.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-button')) {
                playTrack(track.id)
            }
        })

        listItem.querySelector('.track-cover').src = 'assets/images/default-cover.jpg'

        if (track.cover) {
            listItem.querySelector('.track-cover').src = track.cover
        }

        fragment.appendChild(listItem)
    })

    playlistElement.innerHTML = ''
    playlistElement.appendChild(fragment)

    const trackIndexInPlaylist = playlistState.playlist.findIndex((track) => track.id === playlistState.currentTrackId)

    playlistInfo.textContent =
        trackIndexInPlaylist >= 0
            ? `${trackIndexInPlaylist + 1} / ${playlistState.playlist.length}`
            : `${playlistState.playlist.length}`

    updatePlaylistCover()
}

playlistElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-button')) {
        e.stopPropagation()

        const trackIdToRemove = e.target.closest('.track').dataset.trackId

        removeTrack(trackIdToRemove)
        renderPlaylist()
    }
})
