fetch('/profile')
	.then((response) => {
    	response.json()
    .then((data) => {
    	if (data.user.btag) {
    		document.querySelector('#message').innerHTML = `Welcome back, <strong>${data.user.btag}</strong>!`
    	}

        else if (data.user.name) {
            document.querySelector('#message').innerHTML = `Welcome back, <strong>${data.user.name}</strong>!`
        }

    	document.querySelector('#subLink').addEventListener('click', () => {
    		document.querySelector('#message').innerHTML = '<p><em>Subscribed! You will be receiving our newsletter shortly.</em></p>'
    	})

    	document.querySelector('#unsubLink').addEventListener('click', () => {
    		document.querySelector('#message').innerHTML = '<em>You have successfully unsubscribed from our mailing list.</em>'
    	})

	})
})