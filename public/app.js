// ======================================================
// ======================= CLIENT ======================= 
// ======================================================

alert('test')

// force page scroll position to top upon page refresh
window.onbeforeunload = function () {
	window.scrollTo(0,0)
}

// ========= Navbar Functionality ========= 

// changes scrollbar background color when scrolling down at least 10 pixels
$(window).scroll(function(){
  $('nav').toggleClass('scrolled', $(this).scrollTop() > 10)
})

// clicking outside open navbar closes the navbar
	// Listen for all clicks on the document
	document.addEventListener('click', function (event) {
		if (!event.target.closest('.navbar-toggler')) {
		// If a click happened on/inside the ACTIVE .navbar-collapse, don't run code to exit out of navbar
		    if (event.target.closest('.navbar-collapse')) return;

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
regNav.addEventListener('click', function(){
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
	logModal.classList.remove('fadeOut');
	logModal.classList.add('fadeIn');
	logContent.classList.remove('fadeOutUpBig', 'slow');
	logContent.classList.add('slideInDown');
})

// clicking x exits out of modal
closeReg.onclick = fadeOutModal
closeLog.onclick = fadeOutModal

// clicking outside content div exits out of modal
window.onclick = function(event) {
  if (event.target == regModal) {
    fadeOutModal()
  } else if (event.target == logModal) {
  	fadeOutModal()
  }
}

function fadeOutModal() {
	restorePosition()
	regContent.classList.remove('slideInDown')
	regContent.classList.add('fadeOutUpBig', 'slow')
	logContent.classList.remove('slideInDown')
	logContent.classList.add('fadeOutUpBig', 'slow')
	setTimeout(function(){ 
		regModal.classList.remove('fadeIn')
		regModal.classList.add('fadeOut')
		logModal.classList.remove('fadeIn')
		logModal.classList.add('fadeOut')
	}, 300)
}

function preventBodyScroll(){
	document.querySelector('nav').style.background = '#0a0a0a'
	document.body.style.top = '-' + window.scrollY + 'px'
	document.body.style.position = 'fixed'
}

function restorePosition(){
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
		e.preventDefault()
	}
})
