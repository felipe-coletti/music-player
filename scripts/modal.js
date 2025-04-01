const modalContainer = document.getElementById('modal-container')
const openModalButton = document.getElementById('open-modal')
const closeModalButton = document.getElementById('close-modal')

const openModal = () => {
    modalContainer.classList.add('open')
}

export const closeModal = () => {
    modalContainer.classList.remove('open')
}

openModalButton.addEventListener('click', openModal)
closeModalButton.addEventListener('click', closeModal)
