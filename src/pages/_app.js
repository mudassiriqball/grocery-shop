import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-phone-input-2/lib/style.css'
import "react-multi-carousel/lib/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import '../utils/styles/styles.css';

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp


// // Small devices (landscape phones, 576px and up)
// @media(min - width: 576px) {

// }

// // Medium devices (tablets, 768px and up)
// @media(min - width: 768px) {

// }

// // Large devices (desktops, 992px and up)
// @media(min - width: 992px) {

// }

// // Extra large devices (large desktops, 1200px and up)
// @media(min - width: 1200px) {

// }

// // Extra large devices (large desktops, 1200px and up)
// @media(min - width: 1200px) {

// }