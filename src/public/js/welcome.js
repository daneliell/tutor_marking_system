var mainApp = {};


(function(){
    var firebase = app_fireBase;
    var userId = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            userId = user;
            const displayUserUI = document.getElementById("displayUserUI")
            const displayNameUI = document.getElementById("displayNameUI")
            const displayEmailUI = document.getElementById("displayEmailUI")
            displayUserUI.textContent = String(user.displayName)
            displayNameUI.textContent = String(user.displayName)
            displayEmailUI.textContent = String(user.email)

        }else{
            userId = null;
            // Redirect back to Login page
<<<<<<< HEAD:src/public/js/welcome.js
            window.location.replace("index.html");
=======
            window.location.replace("login.html");
>>>>>>> ef4059f3fa7dd6c4f20f3e1af989a42f552d3f33:src/js/track_user.js
        }
    });

    function logOut(){
        firebase.auth().signOut();
    }

    mainApp.logOut = logOut;

})()