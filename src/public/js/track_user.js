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
                        const status = docSnapShot.data().status
                        var displayStatus = status

                        if(status == "lecturer") {displayStatus = "L"} else if(status == "student") {displayStatus = "S"} else if(status == "administrator") {displayStatus = "A"}
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