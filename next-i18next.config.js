const { Languages } = require('./config/app.config')

module.exports = {
	i18n: {
		defaultLocale: Languages.EN,
		locales: [Languages.TH, Languages.EN],
		localeDetection: true,
	},
}
