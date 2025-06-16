const hamburger = document.getElementById('hamburger')
const navLinks = document.getElementById('nav-links')
const notification = document.getElementById('notification')

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show')
})

notification.addEventListener('click', () => {
  alert('You have 3 new notifications!')
})
