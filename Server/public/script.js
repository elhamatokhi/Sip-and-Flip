const hamburger = document.getElementById('hamburger')
const navLinks = document.getElementById('nav-links')
const notification = document.getElementById('notification')

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show')
})

notification.addEventListener('click', () => {
  alert('You have 3 new notifications!')
})

document.querySelectorAll('.heart-toggle').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active')
    button.textContent = button.classList.contains('active') ? '❤️' : '🤍'
  })
})

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.heart-toggle').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active')
      button.textContent = button.classList.contains('active') ? '❤️' : '🤍'
    })
  })
})
