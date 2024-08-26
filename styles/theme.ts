import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

//#region Custom Typography Variants
declare module "@mui/material/styles" {
  interface TypographyVariants {
    header80: React.CSSProperties;
    header65: React.CSSProperties;
    header60: React.CSSProperties;
    header46: React.CSSProperties;
    header40: React.CSSProperties;
    header37: React.CSSProperties;
    header34: React.CSSProperties;
    header29: React.CSSProperties;
    header26: React.CSSProperties;
    header20: React.CSSProperties;
    header18: React.CSSProperties;
    header16: React.CSSProperties;
    body16: React.CSSProperties;
    body15: React.CSSProperties;
    body14: React.CSSProperties;
    body12: React.CSSProperties;
    body10: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    header80?: React.CSSProperties;
    header65?: React.CSSProperties;
    header60?: React.CSSProperties;
    header46?: React.CSSProperties;
    header40?: React.CSSProperties;
    header37?: React.CSSProperties;
    header34?: React.CSSProperties;
    header29?: React.CSSProperties;
    header26?: React.CSSProperties;
    header20?: React.CSSProperties;
    header18?: React.CSSProperties;
    header16?: React.CSSProperties;
    body16?: React.CSSProperties;
    body15?: React.CSSProperties;
    body14?: React.CSSProperties;
    body12?: React.CSSProperties;
    body10?: React.CSSProperties;
  }
}

// Update the Typography"s variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    header80: true;
    header65: true;
    header60: true;
    header46: true;
    header40: true;
    header37: true;
    header34: true;
    header29: true;
    header26: true;
    header20: true;
    header18: true;
    header16: true;
    body16: true;
    body15: true;
    body14: true;
    body12: true;
    body10: true;
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
      main: "#0A5D52",
      light: "#00AC95",
      dark: "#003E35",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#343434",
      light: "#BFBFBF",
      dark: "#000000",
      contrastText: "#FFFFFF",
    },
    error: {
      main: red.A400,
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F3F5F8",
    },
  },

  components: {
    // MuiDrawer: {
    //   styleOverrides: {
    //     paper: { border: 'none' } // hide thin white border
    //   }
    // }
  },

  typography: {
    fontFamily: [
      'Kanit', 'Inter', '-apple-system', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', 'sans-serif',
    ].join(','),
    fontSize: 14,

    //#region Custom Typography Variants
    header80: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 900,
      fontSize: 80
    },
    header65: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 900,
      fontSize: 65
    },
    header60: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 900,
      fontSize: 60
    },
    header46: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 900,
      fontSize: 46
    },
    header40: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 40,
      lineHeight: '44px'
    },
    header37: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 37,
      lineHeight: '44px'
    },
    header34: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 34,
      lineHeight: '44px'
    },
    header29: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 29,
      lineHeight: '138%'
    },
    header26: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: 900,
      fontSize: 26
    },
    header20: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 20
    },
    header18: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 18
    },
    header16: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: 16
    },
    body16: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 16
    },
    body15: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 15
    },
    body14: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 14
    },
    body12: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 12
    },
    body10: {
      fontFamily: ["Kanit", "sans-serif"].join(","),
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 10
    },
    //#endregion Custom Typography Variants

  },
});

theme = responsiveFontSizes(theme);

export default theme;
