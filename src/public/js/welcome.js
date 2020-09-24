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
            window.location.replace("index.html");
        }
    });

    function logOut(){
        firebase.auth().signOut();
    }

    mainApp.logOut = logOut;

})()