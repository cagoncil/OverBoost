// ======================================================
// ======================= CLIENT ======================= 
// ======================================================

// only display loader until all static files are fully loaded
document.onreadystatechange = () => {
	const state = document.readyState
	if (state === 'interactive') {
		return false
  	} else if (state === 'complete') {
  		setTimeout(() => {
        	document.querySelector('.loader').style.display = 'none'
        	document.querySelector('#fully-loaded').classList.remove('hide')
    	}, 500)
  	}
}

// force page scroll position to top upon page refresh
window.onbeforeunload = () => {
	window.scrollTo(0,0)
}

// ========= Navbar Functionality ========= 

// changes scrollbar background color when scrolling down at least 10 pixels
$(window).scroll(() => {
  $('nav').toggleClass('scrolled', $(this).scrollTop() > 10)
})

// clicking outside open navbar closes the navbar
document.addEventListener('click', (event) => { // Listen for all clicks on the document
	if (!event.target.closest('.navbar-toggler')) {
	// If a click happened on/inside the ACTIVE .navbar-collapse, don't run code to exit out of navbar
	    if (event.target.closest('.navbar-collapse')) return

	    // Otherwise, run code, which exits out of active navbar
	    $('.navbar-collapse').collapse('hide')
	}
}, false)

// ========= Register/Login Modal ========= 

// navbar buttons
const regNav = document.querySelector('#navbarRegister')
const logNav = document.querySelector('#navbarLogin')

// modals
const regModal = document.querySelector('#register-modal')
const logModal = document.querySelector('#login-modal')
const regContent = document.querySelector('#register-content')
const logContent = document.querySelector('#login-content')

// x button
const closeReg = document.querySelector('#register-close')
const closeLog = document.querySelector('#login-close')

// buttons inside modal
const regBtn = document.querySelector('#register-btn')
const logBtn = document.querySelector('#login-btn')

// open register modal if "sign up" button is clicked
regNav.addEventListener('click', () => {
	// if "sign up/login" buttons are clicked, exit out of expanded navbar
	$('.navbar-collapse').collapse('hide')

	// clicking on reg/log btn exits out of other modal, if other modal is open
	if (logModal.classList.contains('fadeIn')) {
		fadeOutModal()
	}

	// prevent scrolling while modal is open
	preventBodyScroll()

	// trigger modal
	regModal.classList.remove('fadeOut')
	regModal.classList.add('fadeIn')
	regContent.classList.remove('fadeOutUpBig', 'slow')
	regContent.classList.add('slideInDown')

	// if server sent back error message in search query, display message on modal
	if (window.location.search) {
		if (!window.location.search.includes('Invalid')) {
			const message = document.querySelector('#reg-message')
			message.innerText = 'Error: ' + decodeURI(window.location.search).replace(/[^a-zA-Z ]/g, "") + '.'
		}
	}

})

// open login modal if "login" link is clicked
logNav.addEventListener('click', (event) => {
	// needed to prevent jumping to top of page from link click
	event.preventDefault()

	// if "sign up/login" buttons are clicked, exit out of expanded navbar
	$('.navbar-collapse').collapse('hide')

	// clicking on reg/log btn exits out of other modal, if other modal is open
	if (regModal.classList.contains('fadeIn')) {
		fadeOutModal()
	}

	// prevent scrolling while modal is open
	preventBodyScroll()

	// trigger modal
	logModal.classList.remove('fadeOut')
	logModal.classList.add('fadeIn')
	logContent.classList.remove('fadeOutUpBig', 'slow')
	logContent.classList.add('slideInDown')

	// if server sent back error message in search query, display message on modal
	if (window.location.search) {
		if (window.location.search.includes('Invalid')) {
			const message = document.querySelector('#log-message')
			message.innerHTML = 'Error: ' + decodeURI(window.location.search).replace(/[^a-zA-Z ]/g, "") + '. Please try again.<br>'
		}
	}

})

// clicking x exits out of modal
closeReg.onclick = () => fadeOutModal() 
closeLog.onclick = () => fadeOutModal() 

// clicking outside content div exits out of modal
window.onclick = (event) => {
  if (event.target == regModal) {
    fadeOutModal()
  } else if (event.target == logModal) {
  	fadeOutModal()
  }
}

const fadeOutModal = () => {
	restorePosition()
	regContent.classList.remove('slideInDown')
	regContent.classList.add('fadeOutUpBig', 'slow')
	logContent.classList.remove('slideInDown')
	logContent.classList.add('fadeOutUpBig', 'slow')
	setTimeout(() => { 
		regModal.classList.remove('fadeIn')
		regModal.classList.add('fadeOut')
		logModal.classList.remove('fadeIn')
		logModal.classList.add('fadeOut')
	}, 300)
}

const preventBodyScroll = () => {
	document.querySelector('nav').style.background = '#0a0a0a'
	document.body.style.top = '-' + window.scrollY + 'px'
	document.body.style.position = 'fixed'
}

const restorePosition = () => {
	const scrollY = document.body.style.top
	document.body.style.position = ''
	document.body.style.top = ''
	window.scrollTo(0, parseInt(scrollY || '0') * -1)
	document.querySelector('nav').style.background = ''
}

regBtn.addEventListener('click', (e) => {
	const passField1 = document.querySelector('#reg-password')
	const passField2 = document.querySelector('#confirm')
	const message = document.querySelector('#reg-message')
	if (passField1.value !== passField2.value) {
		message.innerText = 'Error: Password fields do not match!'
		passField1.value = ''
        passField2.value = ''
		e.preventDefault()
	} 
})

// If there is a search query in the URL, open modal to display error message
if (window.location.search) {
	if (window.location.search.includes('Invalid')) {
		// Open login modal
		logNav.click()
	} else if (!window.location.search.includes('Invalid')) {
		// Open register modal
		regNav.click()
	} 
}
