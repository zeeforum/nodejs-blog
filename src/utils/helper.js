const getValidationMessages = (error) => {
	const err = {}
	Object.keys(error.errors).forEach(key => err[key] = error.errors[key].message)
	return err
}

const parseErrorMessage = (res, err) => {
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

	return res.status(500).json({
		error: "Server error! "
	})
}

module.exports = {
	getValidationMessages,
	parseErrorMessage
}