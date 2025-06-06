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

const updateCover = isEmpty => {
	if (isEmpty) {
		playlistCover.src = 'src/assets/images/default-cover.jpg'

		return
	}

	const firstCover = playlistState.playlist[0]?.cover || 'src/assets/images/default-cover.jpg'
	const img = new Image()

	img.src = firstCover

	img.onload = () => (playlistCover.src = firstCover)
	img.onerror = () => (playlistCover.src = 'src/assets/images/default-cover.jpg')
}

const updateInfo = (isEmpty, currentIndex, totalTracks, totalDuration) => {
	if (isEmpty) {
		playlistInfo.textContent = '0 músicas'

		return
	}

	playlistInfo.textContent = `${currentIndex} / ${totalTracks}`

	if (totalDuration > 0) {
		playlistInfo.textContent += `, ${formatTime(totalDuration, 'long')}`
	}
}

const renderEmptyPlaylist = () => {
	playlistElement.innerHTML = '<p class="paragraph">A sua playlist está vazia. Adicione algumas músicas!</p>'
	playlistElement.classList.add('empty-playlist-message')

	updateCover(true)
	updateInfo(true, 0, 0, 0)
}

const renderTrackList = async () => {
	playlistElement.classList.remove('empty-playlist-message')

	const fragment = document.createDocumentFragment()
	let totalDuration = 0
	const durationPromises = []

	playlistState.playlist.forEach((track, idx) => {
		const listItem = document.createElement('li')

		listItem.classList.add('track')

		const isPlaying = track.id === playlistState.currentTrackId

		if (isPlaying) listItem.classList.add('playing')

		listItem.innerHTML = `
			${
				isPlaying
					? `<svg class="icon" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z"/>
						</svg>`
					: `<p class="paragraph">${idx + 1}</p>`
			}
			<div class="track-info">
				<img class="track-cover cover" loading="lazy" src="${track.cover || 'src/assets/images/default-cover.jpg'}" />
				<div class="track-text">
				<h3 class="secondary-title title">${track.name}</h3>
				<p class="paragraph">${track.artist}</p>
				</div>
			</div>
			<div class="button-group">
				<p class="paragraph track-duration"></p>
				<button type="button" class="remove-button ghost-button icon-button button">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M20.5 6h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79s-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9M9.17 4a3.001 3.001 0 0 1 5.66 0"/>
				</svg>
				</button>
			</div>
		`

		const audio = new Audio(track.src)

		durationPromises.push(
			new Promise(res => {
				audio.addEventListener('loadedmetadata', () => {
					const durEl = listItem.querySelector('.track-duration')

					durEl.textContent = formatTime(audio.duration, 'short')

					totalDuration += audio.duration

					res()
				})
			})
		)

		listItem.setAttribute('data-track-id', track.id)
		listItem.addEventListener('click', e => {
			if (!e.target.closest('.remove-button')) playTrack(track.id)
		})

		fragment.appendChild(listItem)
	})

	playlistElement.innerHTML = ''
	playlistElement.appendChild(fragment)

	await Promise.all(durationPromises)
	return totalDuration
}

export const renderPlaylist = async () => {
	const isEmpty = playlistState.playlist.length === 0

	if (isEmpty) {
		renderEmptyPlaylist()

		return
	}

	const totalTracks = playlistState.playlist.length
	const trackIndex = playlistState.playlist.findIndex(t => t.id === playlistState.currentTrackId)
	const displayIndex = trackIndex >= 0 ? trackIndex + 1 : 1
	const totalDuration = await renderTrackList()

	updateCover(false)
	updateInfo(false, displayIndex, totalTracks, totalDuration)
}

export const handleAddTrack = () => {
	if (!trackSrcInput.value || !trackNameInput.value || !artistNameInput.value) {
		alert('Preencha todos os campos obrigatórios!')
		return
	}

	const id = playlistState.playlist.length
		? (playlistState.playlist[playlistState.playlist.length - 1].id + 1) * Date.now()
		: 0

	const track = {
		id,
		src: trackSrcInput.value.replace(/^"|"$/g, ''),
		name: trackNameInput.value,
		artist: artistNameInput.value,
		cover: trackCoverInput.value || 'src/assets/images/default-cover.jpg'
	}

	addTrack(track)
	closeModal()
	renderPlaylist()

	trackCoverInput.value = ''
	trackNameInput.value = ''
	artistNameInput.value = ''
	trackSrcInput.value = ''
}

export const setupPlaylist = () => {
	document.getElementById('add-track-form').addEventListener('submit', e => {
		e.preventDefault()
		handleAddTrack()
	})

	playlistElement.addEventListener('click', e => {
		const btn = e.target.closest('.remove-button')

		if (!btn) return

		e.stopPropagation()

		const id = Number(btn.closest('.track').dataset.trackId)

		removeTrack(id)
		renderPlaylist()
	})

	renderPlaylist()
}
