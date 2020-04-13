document.addEventListener('click', (event) => { // Listen for all clicks on the document
	if (!event.target.closest('.navbar-toggler')) {
	// If a click happened on/inside the ACTIVE .navbar-collapse, don't run code to exit out of navbar
	    if (event.target.closest('.navbar-collapse')) return

	    // Otherwise, run code, which exits out of active navbar
	    $('.navbar-collapse').collapse('hide')
	}
}, false)


// Prevents form resubmission on refresh/back buttons. But not necessary with the PRG pattern
// if ( window.history.replaceState ) {
//     window.history.replaceState( null, null, window.location.href )
// }
