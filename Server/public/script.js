document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('drinkModal')
  const closeModal = document.getElementById('closeModal')
  const modalName = document.getElementById('modalName')
  const modalDescription = document.getElementById('modalDescription')
  const modalPrice = document.getElementById('modalPrice')
  const modalImage = document.getElementById('modalImage')
  const modalAmountInput = document.getElementById('modalAmountInput')
  const modalImageInput = document.getElementById('modalImageInput')
  const modalNameInput = document.getElementById('modalNameInput')
  const drinkPop = document.querySelector('.drink-pop')

  const hamburger = document.getElementById('hamburger')
  const navLinks = document.getElementById('nav-links')

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show')
  })

  // Show modal on drink click
  document.querySelectorAll('.random-drink').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.name
      const description = card.dataset.description
      const price = card.dataset.price
      const image = card.dataset.image

      // Set background image here
      drinkPop.style.backgroundImage = `url(${image})`

      modalName.textContent = name
      modalDescription.textContent = description
      modalPrice.textContent = '€' + price

      // Form fields
      modalNameInput.value = name
      modalImageInput.value = image
      modalAmountInput.value = 1

      modal.classList.remove('hidden')
    })
  })

  // Close modal
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden')
    })
  }
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden')
      }
    })
  }
  const errorBox = document.getElementById('reserve-error')
  if (errorBox) {
    setTimeout(() => {
      errorBox.classList.add('fade-out')
    }, 1000) // hides after 2 seconds
  }
})
