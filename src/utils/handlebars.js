const hbs = require('hbs')

hbs.registerHelper('showError', (err, fieldName) => {
	if (err && err.error && err.error[fieldName]) {
		return `<div class="text-danger">${err.error[fieldName]}</div>`
	}
})

module.exports = hbs