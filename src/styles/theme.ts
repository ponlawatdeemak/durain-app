import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { red } from '@mui/material/colors'

//#region Custom Typography Variants
declare module '@mui/material/styles' {
	interface TypographyVariants {
		header36: React.CSSProperties
		header30: React.CSSProperties
		header24: React.CSSProperties
		header22: React.CSSProperties
		header20: React.CSSProperties
		header18: React.CSSProperties
		header16: React.CSSProperties
		body16: React.CSSProperties
		body15: React.CSSProperties
		body14: React.CSSProperties
		body12: React.CSSProperties
		body10: React.CSSProperties
	}

	// allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		header36?: React.CSSProperties
		header30?: React.CSSProperties
		header24?: React.CSSProperties
		header22?: React.CSSProperties
		header20?: React.CSSProperties
		header18?: React.CSSProperties
		header16?: React.CSSProperties
		body16?: React.CSSProperties
		body15?: React.CSSProperties
		body14?: React.CSSProperties
		body12?: React.CSSProperties
		body10?: React.CSSProperties
	}
}

// Update the Typography"s variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		header36: true
		header30: true
		header24: true
		header22: true
		header20: true
		header18: true
		header16: true
		body16: true
		body15: true
		body14: true
		body12: true
		body10: true
	}
}
//#endregion Custom Typography Variants

// Create a theme instance.
// TODO - OLD
// let theme = createTheme({
//   palette: {
//     primary: {
//       main: "#121212",
//       light: "#242424",
//       dark: "#000000",
//       contrastText: "#FFFFFF",
//     },
//     secondary: {
//       main: "#74C23A",
//       light: "#94C25A",
//       dark: "#24A200",
//       contrastText: "#CCCCCC",
//     },
//     error: {
//       main: red.A400,
//       contrastText: "#FFFFFF",
//     },
//     background: {
//       default: "#F2F2F2",
//     },
//   },

// TODO - NEW, must check
let theme = createTheme({
	palette: {
		primary: {
			main: '#307a59',
			light: '#9fc2b3',
			dark: '#0c5d52',
			contrastText: '#FFFFFF',
		},
		error: {
			main: red.A400,
			contrastText: '#FFFFFF',
		},
		background: {
			default: '#FFFFFF',
		},
	},

	components: {
		// MuiDrawer: {
		//   styleOverrides: {
		//     paper: { border: 'none' } // hide thin white border
		//   }
		// }
		MuiButton: {
			styleOverrides: {
				sizeMedium: {
					height: 40,
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: '#FFFFFF',
					boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
					backgroundColor: '#2F7A59',
					'&:hover': {
						backgroundColor: '#1a4331',
					},
				},
			},
		},
	},

	typography: {
		fontFamily: ['Anuphan', 'sans-serif'].join(','),
		fontSize: 14,

		//#region Custom Typography Variants
		header36: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 600,
			fontSize: 36,
		},
		header30: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 600,
			fontSize: 30,
		},
		header24: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 600,
			fontSize: 24,
		},
		header22: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 600,
			fontSize: 22,
		},
		header20: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 600,
			fontSize: 20,
		},
		header18: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 600,
			fontSize: 18,
		},
		header16: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 600,
			fontSize: 16,
		},
		body16: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 'normal',
			fontSize: 16,
		},
		body14: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 'normal',
			fontSize: 14,
		},
		body10: {
			fontFamily: ['Anuphan', 'sans-serif'].join(','),
			fontStyle: 'normal',
			fontWeight: 'normal',
			fontSize: 10,
		},
		//#endregion Custom Typography Variants
	},
})

theme = responsiveFontSizes(theme)

export default theme
