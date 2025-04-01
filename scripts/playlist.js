import { isValidId, playTrack, formatTime } from './utils.js'
import { playlistState, addTrack, removeTrack } from './playlistState.js'
import { closeModal } from './modal.js'

const playlistElement = document.getElementById('playlist-content')
const playlistInfo = document.getElementById('playlist-info')
const playlistCover = document.getElementById('playlist-cover')
const modalContainer = document.getElementById('modal-container')
const trackCoverInput = document.getElementById('track-cover-input')
const trackNameInput = document.getElementById('track-name-input')
const artistNameInput = document.getElementById('artist-name-input')
const trackSrcInput = document.getElementById('track-src-input')

export const handleAddTrack = () => {
    if (!trackSrcInput.value || !trackNameInput.value || !artistNameInput.value) {
        alert('Preencha todos os campos obrigatórios!')
        return
    }

    const track = {
        id:
            playlistState.playlist.length > 0
                ? playlistState.playlist[playlistState.playlist.length - 1].id + 1 * Date.now()
                : 0,
        src: trackSrcInput.value,
        name: trackNameInput.value,
        artist: artistNameInput.value,
        cover: trackCoverInput.value,
    }

    addTrack(track)
    renderPlaylist()

    closeModal()

    trackCoverInput.value = ''
    trackNameInput.value = ''
    artistNameInput.value = ''
    trackSrcInput.value = ''
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
    let playlistDuration = 0
    const durationPromises = []

    playlistState.playlist.forEach((track, index) => {
        const listItem = document.createElement('li')
        const isPlaying = track.id === playlistState.currentTrackId

        listItem.classList.add('track')
        if (isPlaying) listItem.classList.add('playing')

        listItem.innerHTML = `
            <p class="paragraph">${isPlaying ? 'P' : index + 1}</p>
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

        listItem.querySelector('.track-cover').src = 'assets/images/default-cover.jpg'

        if (track.cover) {
            listItem.querySelector('.track-cover').src = track.cover
        }

        const audio = new Audio(track.src)

        const durationPromise = new Promise((resolve) => {
            audio.addEventListener('loadedmetadata', () => {
                const durationElement = listItem.querySelector('.track-duration')
                durationElement.textContent = formatTime(audio.duration)
                playlistDuration += audio.duration
                resolve()
            })
        })

        durationPromises.push(durationPromise)

        listItem.setAttribute('data-track-id', track.id)
        listItem.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-button')) {
                playTrack(track.id)
            }
        })

        fragment.appendChild(listItem)
    })

    playlistElement.innerHTML = ''
    playlistElement.appendChild(fragment)

    const trackIndexInPlaylist = playlistState.playlist.findIndex((track) => track.id === playlistState.currentTrackId)

    playlistInfo.textContent =
        trackIndexInPlaylist >= 0
            ? `${trackIndexInPlaylist + 1} / ${playlistState.playlist.length}`
            : `${playlistState.playlist.length}`

    Promise.all(durationPromises).then(() => {
        if (playlistDuration > 0) {
            playlistInfo.textContent += `, ${formatTime(playlistDuration)}`
        }
    })

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
