var app_fireBase = {};

/**
 * Self contained function that initialize the firebase
 * To invoke the firebase, use app_firebase in your js
 */
(function(){

    var firebaseConfig = {
        apiKey: "AIzaSyDJ-VDlMHMSElloOCkkdZqxeRXg7mGKWhw",
        authDomain: "fit2101-b74c7.firebaseapp.com",
        databaseURL: "https://fit2101-b74c7.firebaseio.com",
        projectId: "fit2101-b74c7",
        storageBucket: "fit2101-b74c7.appspot.com",
        messagingSenderId: "940278553873",
        appId: "1:940278553873:web:59d88f2202ba62e96080b0",
        measurementId: "G-MN3Q8ZKBPZ"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    app_fireBase = firebase;
})()