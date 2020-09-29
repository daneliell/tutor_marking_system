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
                displayStatusUI = document.getElementById("displayStatusUI")
                displayIDUI = document.getElementById("displayIDUI"),
                userName = user.displayName,
                userEmail = user.email,
                docID = userEmail.substr(0, 8),
                db = firebase.firestore(),
                studentRef = db.collection("students").doc(docID)

            displayUserUI.textContent = String(userName)
            displayNameUI1.textContent = String(userName)
            displayNameUI2.textContent = String(userName)   
            displayEmailUI.textContent = String(userEmail)

            studentRef.get()
                .then((docSnapShot) => {
                    if (docSnapShot.exists) {
                        const status = docSnapShot.data().status
                        if(status == "lecturer" || status == "administrator"){
                            document.getElementById("lecturerTokenInput").hidden = true;
                            document.getElementById("updateStatusButton").hidden = true;
                        }
                        displayStatusUI.textContent = status
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

function updateStatus(){
    const
        db = firebase.firestore(),
        docId = document.getElementById("displayIDUI").textContent,
        lecturerTokenInput = document.getElementById("lecturerTokenInput").value,
        studentRef = db.collection("students").doc(docId),
        tokenRef = db.collection("lecturerTokens").doc("tokens");

        tokenRef.get()
                .then((docSnapShot) => {
                    if (docSnapShot.exists) {
                        var tokenArray = docSnapShot.data().token;  //Get array of tokens
                        if(tokenArray.includes(lecturerTokenInput)){
                            var tokenIndex = tokenArray.indexOf(lecturerTokenInput)
                            tokenArray[tokenIndex] = makeid(8) //Delete and create new token
                            tokenRef.update({token: tokenArray})
                                .then(function() {
                                    console.log("Updated Token Doc");
                                })
                                .catch(function(error) {
                                    // The document probably doesn't exist.
                                    console.error("Error updating document: ", error);
                                });
                            studentRef.update({status: "lecturer"})
                                .then(function() {
                                    console.log("Updated student's status");
                                })
                                .catch(function(error) {
                                    // The document probably doesn't exist.
                                    console.error("Error updating document: ", error);
                                });

                            console.log('Transaction success!');
                            window.location.reload(true)

                        } else {
                            console.log('Token Invalid!' );
                            document.getElementById("lecturerTokenInput").value = 'Token Invalid!'
                        }
                    } else {
                        console.log("Document doesn't exists!")
                    }
                })
    
}


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }