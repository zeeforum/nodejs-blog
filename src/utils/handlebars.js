const hbs = require('hbs')

hbs.registerHelper('showError', (err, fieldName) => {
	if (err && err.error && err.error[fieldName]) {
		return `<div class="text-danger">${err.error[fieldName]}</div>`
	}
})

hbs.registerHelper('flashMessage', (flash) => {
	if (flash && flash["success"]) {
		return `<div class="text-success">${flash["success"]}</div>`
	} else if (flash && flash["error"]) {
		return `<div class="text-danger">${flash["error"]}</div>`
	}
})

module.exports = hbs