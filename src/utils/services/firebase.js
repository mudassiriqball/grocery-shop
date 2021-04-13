import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyAuKKO49h-w07t1bRlEuQYAYrryEwCEcCU",
    authDomain: "project-b1833.firebaseapp.com",
    projectId: "project-b1833",
    storageBucket: "project-b1833.appspot.com",
    messagingSenderId: "970634827504",
    appId: "1:970634827504:web:2b8730e5cbd9fb27245435",
    measurementId: "G-P66B8G5P4Y"
};
// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    // console.log('Fire base error:', err)
}

export default firebase;