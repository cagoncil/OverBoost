// Retrieve user data to display on account settings page
fetch('/profile')
	.then((response) => {
    	response.json()
    .then((data) => {

    	// Displays info depending on if data for user exists
    	if (data.user.btag) {
    		document.querySelector('#battletag').innerHTML = `<strong>Battle Tag</strong>: ${data.user.btag}`
    	} else {
    		document.querySelector('#battletag').innerHTML = `<strong>Battle Tag</strong>: <em>Add details</em>`
    	}

    	if (data.user.server) {
    		document.querySelector('#server').innerHTML = `<strong>Server</strong>: ${data.user.server}`
    	} else {
    		document.querySelector('#server').innerHTML = `<strong>Server</strong>: <em>Add details</em>`
    	}
    	
    	if (data.user.name) {
    		document.querySelector('#name').innerHTML = `<strong>Name</strong>: ${data.user.name}`
    	} else {
    		document.querySelector('#name').innerHTML = `<strong>Name</strong>: <em>Add details</em>`
    	}
    	
    	document.querySelector('#email').innerHTML = `<strong>Email</strong>: ${data.user.email}`
    	console.log(data.user)
	})
})

// Edit button functions
const buttonClick = (linkId, editId) => {
	document.getElementById(linkId).addEventListener('click', function () {
		if (this.innerText = '🖉') {
			this.innerText = '✕'
		} 

		document.getElementById(editId).classList.toggle('hidden')

		if (document.getElementById(editId).classList.contains('hidden')) {
			this.innerText = '🖉'
		}
	})
}

buttonClick('btagLink', 'btagEdit')
buttonClick('serverLink', 'serverEdit')
buttonClick('nameLink', 'nameEdit')
buttonClick('emailLink', 'emailEdit')
buttonClick('passLink', 'passEdit')

document.querySelector('#deleteLink').addEventListener('click', function () {
	document.getElementById('deleteWarning').classList.remove('hidden')
	this.innerText = 'Confirm Account Deletion'

	this.addEventListener('click', function () {
		if (this.innerText = 'Confirm Account Deletion') {
			document.getElementById('deleteWarning').innerHTML = ''
			this.innerText = 'Deleted'
		}
	})
	
})