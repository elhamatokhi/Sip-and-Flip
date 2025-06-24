const modal = document.getElementById('order-modal')
const modalImage = document.getElementById('modal-image')
const modalName = document.getElementById('modal-name')
const modalDescription = document.getElementById('modal-description')
const modalPrice = document.getElementById('modal-price')
const quantityDisplay = document.getElementById('quantity')
const closeBtn = document.querySelector('.close-btn')
const heartBtn = document.querySelector('.heart-btn')

let currentQuantity = 1

document.querySelectorAll('.view-details').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault()
    currentQuantity = 1
    quantityDisplay.textContent = currentQuantity

    modalImage.src = link.dataset.image
    modalName.textContent = link.dataset.name
    modalDescription.textContent = link.dataset.description
    modalPrice.textContent = parseFloat(link.dataset.price).toFixed(2)

    modal.classList.remove('hidden')
  })
})

document.getElementById('increase').onclick = () => {
  currentQuantity++
  quantityDisplay.textContent = currentQuantity
}

document.getElementById('decrease').onclick = () => {
  if (currentQuantity > 1) {
    currentQuantity--
    quantityDisplay.textContent = currentQuantity
  }
}

closeBtn.addEventListener('click', () => modal.classList.add('hidden'))

heartBtn.addEventListener('click', () => {
  heartBtn.classList.toggle('favorited')
})
