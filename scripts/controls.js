import { audioPlayer, isValidId, playCurrentTrack, formatTime, volumeControl, playTrack } from './utils.js'
import { renderPlaylist } from './playlist.js'
import { playlistState, setPlaylistOrder, toggleShuffle, toggleLoop as loopPlaylist } from './playlistState.js'
import { trackState, toggleLoop as loopTrack, setVolume } from './trackState.js'
import { updateRangeProgress } from './slider.js'

const playButtons = document.querySelectorAll('.play-button')
const playPlaylistButton = document.getElementById('playlist-play-button')
const playTrackButtons = document.querySelectorAll('.track-play-button')
const previousButtons = document.querySelectorAll('.previous-button')
const nextButtons = document.querySelectorAll('.next-button')
export const shuffleButtons = document.querySelectorAll('.shuffle-button')
export const playlistLoopButton = document.getElementById('playlist-loop-button')
export const trackLoopButtons = document.querySelectorAll('.track-loop-button')
const trackSliders = document.querySelectorAll('.track-slider')
const trackProgressInner = document.getElementById('track-progress-inner')
export const currentTimeDisplays = document.querySelectorAll('.current-time')
export const totalTimeDisplays = document.querySelectorAll('.total-time')

const playPlaylist = () => {
    if (isValidId(playlistState.currentTrackId)) {
        play()
    } else if (playlistState.playlistOrder.length > 0) {
        const firstTrackId = playlistState.playlistOrder[0]
        playTrack(firstTrackId)
    }
}

const updatePlayButtons = (isPaused) => {
    playButtons.forEach((button) => {
        button.textContent = isPaused ? 'Play' : 'Pause'
    })
}

const play = () => {
    if (!audioPlayer.src) {
        if (isValidId(playlistState.currentTrackId)) {
            playCurrentTrack()
        }
    } else {
        if (audioPlayer.paused) {
            audioPlayer.play()
            updatePlayButtons(false)
        } else {
            audioPlayer.pause()
            updatePlayButtons(true)
        }
    }
}

const previous = () => {
    const currentTrackIndex = playlistState.playlistOrder.indexOf(playlistState.currentTrackId)

    if (currentTrackIndex > 0) {
        const previousTrackId = playlistState.playlistOrder[currentTrackIndex - 1]
        playTrack(previousTrackId)
    }
}

const next = () => {
    const currentTrackIndex = playlistState.playlistOrder.indexOf(playlistState.currentTrackId)

    if (currentTrackIndex === playlistState.playlistOrder.length - 1) {
        if (playlistState.isLooping) {
            const firstTrackId = playlistState.playlistOrder[0]
            playTrack(firstTrackId)
        } else {
            return
        }
    } else {
        const nextTrackId = playlistState.playlistOrder[currentTrackIndex + 1]
        playTrack(nextTrackId)
    }
}

const shuffle = () => {
    toggleShuffle()

    if (playlistState.isShuffle) {
        if (isValidId(playlistState.currentTrackId)) {
            setPlaylistOrder(
                playlistState.playlist
                    .map((track) => track.id)
                    .filter((id) => id !== playlistState.currentTrackId)
                    .sort(() => Math.random() - 0.5)
            )

            playlistState.playlistOrder.unshift(playlistState.currentTrackId)
        } else {
            setPlaylistOrder(playlistState.playlist.map((track) => track.id).sort(() => Math.random() - 0.5))
        }
    } else {
        setPlaylistOrder(playlistState.playlist.map((track) => track.id))
    }

    renderPlaylist()
}

export const setupControlEvents = () => {
    playPlaylistButton.addEventListener('click', playPlaylist)
    playTrackButtons.forEach((button) => {
        button.addEventListener('click', play)
    })
    previousButtons.forEach((button) => {
        button.addEventListener('click', previous)
    })
    nextButtons.forEach((button) => {
        button.addEventListener('click', next)
    })
    shuffleButtons.forEach((button) => {
        button.addEventListener('click', shuffle)
    })
    playlistLoopButton.addEventListener('click', loopPlaylist)
    trackLoopButtons.forEach((button) => {
        button.addEventListener('click', loopTrack)
    })
}

export const setupAudioEvents = () => {
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeDisplays.forEach((display) => {
            display.textContent = formatTime(audioPlayer.duration)
        })
    })

    audioPlayer.addEventListener('timeupdate', () => {
        if (!audioPlayer.duration) return

        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100
        trackSliders.forEach((slider) => {
            slider.value = progress
        })
        trackProgressInner.style.width = `${progress}%`

        currentTimeDisplays.forEach((display) => {
            display.textContent = formatTime(audioPlayer.currentTime)
        })
        totalTimeDisplays.forEach((display) => {
            display.textContent = formatTime(audioPlayer.duration)
        })

        trackSliders.forEach((slider) => {
            updateRangeProgress(slider)
        })
    })

    trackSliders.forEach((slider) => {
        slider.addEventListener('input', (e) => {
            const seekTime = (e.target.value / 100) * audioPlayer.duration
            audioPlayer.currentTime = seekTime
        })
    })

    volumeControl.addEventListener('input', (e) => setVolume(e.target.value / 100))

    audioPlayer.addEventListener('ended', () => {
        const currentTrackIndex = playlistState.playlistOrder.indexOf(playlistState.currentTrackId)

        if (trackState.isLooping) {
            audioPlayer.play()
        } else if (currentTrackIndex < playlistState.playlistOrder.length - 1) {
            next()
        } else if (playlistState.isLooping) {
            const firstTrack = playlistState.playlistOrder[0]
            playTrack(firstTrack)
        }
    })
}
