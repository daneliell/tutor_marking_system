const chatLog = document.querySelector('#chat');
//const form = document.querySelector('#message-form');
const form = document.getElementById("message-form");

//var user = firebase.auth().currentUser;
//var userName;

const db = firebase.firestore();

var url_string = window.location.href; //window.location.href
var url = new URL(url_string);
var pname = decodeURIComponent(url.searchParams.get("project"));
const projRef = db.collection("projects").doc(pname);

// create element and render chat
function renderChat(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let usermsg = document.createElement('span');

    li.setAttribute('data-id', doc.id);

    name.textContent = doc.data().name + " " + doc.data().time;
    //time.textContent = doc.data().time;
    usermsg.textContent = doc.data().usermsg;

    li.appendChild(name)
    //li.appendChild(time);
    //console.log(usermsg.textContent.length);

    li.appendChild(usermsg);
    chatLog.appendChild(li);
}

//saving data
form.addEventListener('submit', (e) => {
    e.preventDefault(); //normally when the send button is pressed it will refresh the page

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
    if (user !=null){
    userName = user.displayName
    }
    else {
    userName = "Error"
    }

    projRef.collection("comment").add({
        name: userName, // change this to current user
        time: dateTime,
        usermsg: form.usermsg.value
    })

    // Clear input after submission
    form.usermsg.value = '';

})

// real-time listener *orderBy('time')
projRef.collection('comment').orderBy('time').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        //console.log(change.doc.data())
        if (change.type == 'added') {
            renderChat(change.doc)
        } else if (change.type == 'removed') { // for admin to remove inappropriate comments
            let li = chatLog.querySelector('[data-id=' + change.doc.id + ']');
            chatLog.removeChild(li);
        }
    })
})