const handleResponse = (response) => {
	return response.json()
		.then((json) => {
			if (response.ok) {
				return json
			} else {
				return Promise.reject(response)
			}
		})
}

fetch('https://randomuser.me/api/?results=18')
	.then(handleResponse)
	.then((data) => {
		data.results.forEach((result) => {
			const name = result.name.first
			const user = result.login.username
			const country = result.location.country
			const boosts = result.dob.age
			const picUrl = result.picture.large
			let pronoun
			if (result.gender == 'male') {
				pronoun = 'He has'
			} else if (result.gender == 'female') {
				pronoun = 'She has'
			} else {
				pronoun = 'They have'
			}

			const carousel = document.querySelector('.carousel-inner')
			console.log(picUrl)

			const boosterDiv = document.createElement('div')
			boosterDiv.classList.add('carousel-item')
			const boosterInfo = document.createElement('p')
			boosterInfo.innerHTML = 
				`
				<h4>${name}</h4>
				<img src="${picUrl}"><br><br>
				<h6><br><i class="far fa-user"></i> <strong>${user}</strong></h6><br>
				<h6>${name} is from ${country}.<br> ${pronoun} completed <strong>${boosts}</strong> boosts.</h6><br>
				`
			boosterDiv.appendChild(boosterInfo)
			carousel.appendChild(boosterDiv)


		})
	})
	.catch((error) => {
		console.log('error', error)
  })

