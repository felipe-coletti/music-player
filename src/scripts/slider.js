const sliders = document.querySelectorAll('.slider')

export const updateRangeProgress = (slider) => {
    const value = slider.value
    const min = slider.min
    const max = slider.max

    const progress = ((value - min) / (max - min)) * 100

    const progressColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent')
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-hover')

    slider.style.background = `linear-gradient(to right, ${progressColor} ${progress}%, ${backgroundColor} ${progress}%)`
}

sliders.forEach((slider) => {
    slider.addEventListener('input', () => updateRangeProgress(slider))

    updateRangeProgress(slider)
})
