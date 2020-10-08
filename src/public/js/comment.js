function comment() {
    const chatLog = document.querySelector('#chat');
    //const form = document.querySelector('#message-form');
    const form = document.getElementById("message-form");
    const form_btn = document.getElementById("form_btn");

    //var user = firebase.auth().currentUser;
    //var userName;

    const db = firebase.firestore();

    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var pname = decodeURIComponent(url.searchParams.get("project"));
    const projRef = db.collection("projects").doc(pname);

    //Saving the any submitted comments
    form_btn.addEventListener('click', function () {
        console.log("CLICK")
        //e.preventDefault(); //normally when the send button is pressed it will refresh the page

        // For todays date;
        Date.prototype.today = function () {
            return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
        }
        // For the time now
        Date.prototype.timeNow = function () {
            return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        }

        var currentDate = new Date();
        var dateTime = currentDate.today() + ", " + currentDate.timeNow();
        var user = firebase.auth().currentUser;
        var userName;
        if (user != null) {
            userName = user.displayName
        }
        else {
            userName = "Error"
        }

        const batch = db.batch()
        batch.update(projRef, {
            chatlog: firebase.firestore.FieldValue.arrayUnion(
                {
                    name: userName, // change this to current user
                    time: dateTime,
                    usermsg: form.usermsg.value
                }
            )

        })

        batch.commit()
            .then(() => {
                console.log('Success!'),
                location.reload(); })
            .catch(err => console.log('Failed!', err));
            
        
        // Clear input after submission
        form.usermsg.value = '';
 
    })

    projRef.get().then(function (doc) {
        const chatlog_arr = doc.data().chatlog;
        if (chatlog_arr.length != 0) {
            for (l in chatlog_arr) {

                let li = document.createElement('li');
                let name = document.createElement('span');
                let usermsg = document.createElement('span');

                name.textContent = chatlog_arr[l].name + " " + chatlog_arr[l].time;
                usermsg.textContent = chatlog_arr[l].usermsg;

                li.appendChild(name)

                li.appendChild(usermsg);
                chatLog.appendChild(li);

                console.log(li)

            }
        }

    })
}

window.onload = function () {
    comment();
}