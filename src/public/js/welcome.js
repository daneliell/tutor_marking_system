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
                displayStatusUI = document.getElementById("displayStatusUI")

                userName = user.displayName,
                userEmail = user.email,
                docID = userEmail.substr(0, 8),
                db = firebase.firestore(),
                studentRef = db.collection("students").doc(docID)

            displayUserUI.textContent = String(user.displayName)
            displayNameUI.textContent = String(user.displayName)
            displayEmailUI.textContent = "Email: " +  String(user.email)

            studentRef.get()
                .then((docSnapShot) => {
                    if (docSnapShot.exists) {
                        console.log("Document already exists!")

                        // Display Status beside display name
                        const status = docSnapShot.data().status
                        var displayStatus = status

                        if(status == "lecturer") {displayStatus = "L"} else if(status == "student") {displayStatus = "S"} else if(status == "administrator") {displayStatus = "A"}
                        displayStatusUI.textContent = "Status: " + status
                        displayUserUI.textContent = displayUserUI.textContent + String(" (" + displayStatus + ")")

                        // Show items depending of status
                        if(status == "lecturer"){
                            $(".lect-only").attr("style", "display: inline !important");
                        }
                        else if(status == "administrator") {
                            $(".admin-only").attr("style", "display: inline !important");
                        }
                        else if(status == "student") {
                            $(".student-only").attr("style", "display: inline !important");
                        } else {
                            console.log("unknown status")
                        }
                    } else {
                        // create new data
                        displayStatusUI.textContent = "Status: Student"
                        studentRef.set({
                            id: docID,
                            name: userName,
                            email: userEmail,
                            status: "student",
                            projects: []
                        }, {merge: true})
                        .then(function() {
                            console.log("Document successfully created!");
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