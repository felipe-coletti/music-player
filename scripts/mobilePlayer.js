const player = document.getElementById('player')
const mobilePlayer = document.getElementById('mobile-player')
const closeModalButton = document.getElementById('close-mobile-player')

const openModal = () => {
    mobilePlayer.classList.add('open')
}

export const closeModal = () => {
    mobilePlayer.classList.remove('open')
}

const handlePlayerClick = () => {
    if (window.matchMedia('(max-width: 800px)').matches) {
        player.addEventListener('click', openModal)
    } else {
        player.removeEventListener('click', openModal)
    }
}

const stopPropagation = (event) => {
    event.stopPropagation()
}

document.querySelectorAll('#player button').forEach((button) => {
    button.addEventListener('click', stopPropagation)
})

handlePlayerClick()

window.addEventListener('resize', handlePlayerClick)

closeModalButton.addEventListener('click', closeModal)
