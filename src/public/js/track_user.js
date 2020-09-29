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
                docID = user.email.substr(0, 8),
                db = firebase.firestore(),
                studentRef = db.collection("students").doc(docID);

            displayUserUI.textContent = String(user.displayName)
            studentRef.get()
                .then((docSnapShot) => {
                    if (docSnapShot.exists) {
                        // Display Status beside display name
                        var status = docSnapShot.data().status
                        if(status == "lecturer") {status = "L"} else if(status == "student") {status = "S"} else if(status == "administrator") {status = "A"}
                        displayUserUI.textContent = displayUserUI.textContent + String(" (" + status + ")")
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