import { playTrack, formatTime } from './utils.js'
import { playlistState, addTrack, removeTrack } from './playlistState.js'
import { closeModal } from './modal.js'

const playlistElement = document.getElementById('playlist-container')
const playlistInfo = document.getElementById('playlist-info')
const playlistCover = document.getElementById('playlist-cover')
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
		id: playlistState.playlist.length > 0 ? (playlistState.playlist[playlistState.playlist.length - 1].id + 1) * Date.now() : 0,
		src: trackSrcInput.value.replace(/^"|"$/g, ''),
		name: trackNameInput.value,
		artist: artistNameInput.value,
		cover: trackCoverInput.value || 'src/assets/images/default-cover.jpg'
	}

	addTrack(track)
	renderPlaylist()
	closeModal()

	trackCoverInput.value = ''
	trackNameInput.value = ''
	artistNameInput.value = ''
	trackSrcInput.value = ''
}

document.getElementById('add-track-form').addEventListener('submit', e => {
	e.preventDefault()

	handleAddTrack()
})

const updatePlaylistCover = () => {
	if (playlistState.playlist.length > 0) {
		const firstTrack = playlistState.playlist[0]
		const image = new Image()

		image.src = firstTrack.cover || 'src/assets/images/default-cover.jpg'

		image.onload = () => {
			playlistCover.src = image.src
		}

		image.onerror = () => {
			console.warn('Capa inválida')
			playlistCover.src = 'src/assets/images/default-cover.jpg'
		}
	} else {
		playlistCover.src = 'src/assets/images/default-cover.jpg'
	}
}

export const renderPlaylist = () => {
	const isEmpty = playlistState.playlist.length === 0

	playlistElement.classList.toggle('empty-playlist-message', isEmpty)

	if (isEmpty) {
		playlistElement.innerHTML = '<p class="paragraph">A sua playlist está vazia. Adicione algumas músicas!</p>'
		updatePlaylistCover()

		return
	}

	const fragment = document.createDocumentFragment()
	let playlistDuration = 0
	const durationPromises = []

	playlistState.playlist.forEach((track, index) => {
		const listItem = document.createElement('li')
		const isPlaying = track.id === playlistState.currentTrackId

		listItem.classList.add('track')

		if (isPlaying) listItem.classList.add('playing')

		listItem.innerHTML = `
            ${
				isPlaying
					? `
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" />
                        </svg>
                    `
					: `<p class="paragraph">${index + 1}</p>`
			}
            <div class="track-info">
                <img class="track-cover cover" loading="lazy" />
                <div class="track-text">
                    <h3 class="secondary-title title">${track.name}</h3>
                    <p class="paragraph">${track.artist}</p>
                </div>
            </div>
            <div class="button-group">
                <p class="paragraph track-duration"></p>
                <button type="button" class="remove-button ghost-button icon-button button" onclick="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M20.5 6h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79s-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9M9.17 4a3.001 3.001 0 0 1 5.66 0" />
                    </svg>
                </button>
            </div>
        `

		listItem.querySelector('.track-cover').src = 'src/assets/images/default-cover.jpg'

		if (track.cover) {
			listItem.querySelector('.track-cover').src = track.cover
		}

		const audio = new Audio(track.src)

		const durationPromise = new Promise(resolve => {
			audio.addEventListener('loadedmetadata', () => {
				const durationElement = listItem.querySelector('.track-duration')

				durationElement.textContent = formatTime(audio.duration, 'short')

				playlistDuration += audio.duration

				resolve()
			})
		})

		durationPromises.push(durationPromise)

		listItem.setAttribute('data-track-id', track.id)
		listItem.addEventListener('click', e => {
			if (!e.target.closest('.remove-button')) {
				playTrack(track.id)
			}
		})

		fragment.appendChild(listItem)
	})

	playlistElement.innerHTML = ''
	playlistElement.appendChild(fragment)

	const trackIndexInPlaylist = playlistState.playlist.findIndex(track => track.id === playlistState.currentTrackId)

	playlistInfo.textContent = !isEmpty ? `${trackIndexInPlaylist + 1} / ${playlistState.playlist.length}` : `${playlistState.playlist.length} músicas`

	Promise.all(durationPromises).then(() => {
		if (playlistDuration > 0) {
			playlistInfo.textContent += `, ${formatTime(playlistDuration, 'long')}`
		}
	})

	updatePlaylistCover()
}

playlistElement.addEventListener('click', e => {
	if (e.target.closest('.remove-button')) {
		e.stopPropagation()

		const trackIdToRemove = Number(e.target.closest('.track').dataset.trackId)

		removeTrack(trackIdToRemove)
		renderPlaylist()
	}
})
