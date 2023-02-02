const getValidationMessages = (error) => {
	const err = {}
	Object.keys(error.errors).forEach(key => err[key] = error.errors[key].message)
	return err
}

const parseErrorMessage = (res, err) => {
	if (err) {
		if (err.errors) {
			return res.status(422).json({
				error: getValidationMessages(err)
			})
		} else if (err.code === 11000) {
			return res.status(422).json({
				error: {
					[Object.keys(err.keyPattern)[0]]: `Duplicate key for ${Object.keys(err.keyPattern)[0]}`
				}
			})
		}
	}

	return res.status(500).json({
		error: "Server error! "
	})
}

const makeErrorCookies = (res, err, redirectUrl) => {
	if (err && err.response && err.response.status === 422) {
		return res.cookie('errors', err.response.data).redirect(redirectUrl)
	}

	return res.redirect(redirectUrl)
}

const setSuccess = (req, msg) => {
	req.flash("info_success", msg)
}

const setError = (req, msg) => {
	req.flash("info_error", msg)
}

const getSuccess = (req) => {
	let success = req.flash("info_success")
	if (success && success[0]) {
		return success[0]
	}
}

const getError = (req) => {
	let error = req.flash("info_error")
	if (error && error[0]) {
		return success[0]
	}
}

module.exports = {
	getValidationMessages,
	parseErrorMessage,
	makeErrorCookies,
	setSuccess,
	getSuccess,
	setError,
	getError
}