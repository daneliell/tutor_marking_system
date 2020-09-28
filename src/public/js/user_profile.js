var mainApp = {};


(function(){
    var firebase = app_fireBase;
    var userId = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            userId = user;
            const 
                displayUserUI = document.getElementById("displayUserUI"),
                displayNameUI1 = document.getElementById("displayNameUI1"),
                displayNameUI2 = document.getElementById("displayNameUI2"),
                displayEmailUI = document.getElementById("displayEmailUI"),
                displayIDUI = document.getElementById("displayIDUI"),
                userName = user.displayName,
                userEmail = user.email,
                docID = userEmail.substr(0, 8),
                db = firebase.firestore(),
                studentRef = db.collection("students").doc(docID)

            displayUserUI.textContent = String(userName)
            displayNameUI1.textContent = String(user.displayName)
            displayNameUI2.textContent = String(user.displayName)
            displayEmailUI.textContent = String(userEmail)

            studentRef.get()
                .then((docSnapShot) => {
                    if (docSnapShot.exists) {
                        displayStatusUI.textContent = docSnapShot.data().status
                        displayIDUI.textContent = docSnapShot.data().id
                    } else {
                        console.log("Document doesn't exists!")
                    }
                })
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