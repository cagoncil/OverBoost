// Retrieve user data to display on account settings page
fetch('/profile')
	.then((response) => {
        if (!response.ok) {
            throw Error(response.statusText)
        }
    	return response.json()
    })
    .then((data) => {

        // Displays info depending on if data for user exists
        const display = (userData, dataId, dataName) => {
            if (userData) {
                document.getElementById(dataId).innerHTML = `<strong>${dataName}</strong>: ${userData}`
            } else {
                document.getElementById(dataId).innerHTML = `<strong>${dataName}</strong>: <em>Add details</em>`
            }
        }

        display(data.user.btag, 'battletag', 'Battle Tag')  // BattleTag
        display(data.user.server, 'server', 'Server')       // Server or region
        display(data.user.name, 'name', 'Name')             // Name
    	document.querySelector('#email').innerHTML = `<strong>Email</strong>: ${data.user.email}` // Email
        // Don't display password details for security reasons

    	console.log(data.user)
	})
    .catch(err => console.log(err))


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