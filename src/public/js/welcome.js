var mainApp = {};


(function(){
    var firebase = app_fireBase;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            const 
                displayUserUI = document.getElementById("displayUserUI"),
                displayNameUI = document.getElementById("displayNameUI"),
                displayEmailUI = document.getElementById("displayEmailUI"),

                userName = user.displayName,
                userEmail = user.email,
                docID = userEmail.substr(0, 8),
                db = firebase.firestore(),
                studentRef = db.collection("students").doc(docID)

            displayUserUI.textContent = String(user.displayName)
            displayNameUI.textContent = String(user.displayName)
            displayEmailUI.textContent = String(user.email)

            studentRef.get()
                .then((docSnapShot) => {
                    if (docSnapShot.exists) {
                        console.log("document already exists!")
                        //do nothing
                    } else {
                        // create new data
                        studentRef.set({
                            id: docID,
                            name: userName,
                            email: userEmail,
                            status: "student",
                            projects: []
                        }, {merge: true})
                        .then(function() {
                            console.log("Document successfully written!");
                        })
                        .catch(function(error) {
                            console.error("Error writing document: ", error);
                        });
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