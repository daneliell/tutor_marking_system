projects_list = [];
var firestore = firebase.firestore();

window.onload = function(){
  // Check if a user is logged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // If logged in, get the user's ID
      let id = user.email.substring(0,8);

      firestore.doc("students/" + id).get().then(function(doc){
        if (doc.data().status == "student")
        {
          if (doc.data().projects.length == 0){
            let help_text = document.createTextNode("You have no active projects.");
            let title = document.createElement("h5");
            title.appendChild(help_text);
            area.innerHTML += "<br>";
            area.appendChild(title);
            area.innerHTML += "<br>";
          }
          else{
            for (let i = 0; i < doc.data().projects.length; i++)
            {
              // Pushes every project student is involved into array
              firestore.doc("projects/" + doc.data().projects[i]).get().then(function(project) {
                if (project.data() != undefined) {
                  projects_list.push(project.data());
                }
              }).then(function(){
                // If statement to only allow function to be called once after
                // all projects have been added
                if (i == (doc.data().projects.length-1))
                {
                  generate_html("0");
                }
              });
            }
          }
        }
        else if (doc.data().status == "lecturer")
        {
          if (doc.data().projects.length == 0){
            let help_text = document.createTextNode("You have no active projects.");
            let title = document.createElement("h5");
            title.appendChild(help_text);
            title.style.textAlign = "center";
            area.appendChild(title);
            area.innerHTML += "<br>";
            area.innerHTML += "<br>";
          }
          else {
            for (let i = 0; i < doc.data().projects.length; i++)
            {
              // Pushes every project student is involved into array
              firestore.doc("projects/" + doc.data().projects[i]).get().then(function(project) {
                if (project.data() != undefined) {
                  projects_list.push(project.data());
                }
              }).then(function(){
                // If statement to only allow function to be called once after
                // all projects have been added
                if (i == (doc.data().projects.length-1))
                {
                  generate_html("1");
                }
              });
            }
          }
        }
        else
        {
          // Pushes all available projects into projects_list
          firestore.collection("projects").get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
              projects_list.push(doc.data());
            })
          }).then(function(){
            generate_html("1");
          });
        }
      });
    }
    else {
      console.log("No user is signed in.");
    }
  });
}

// Function to generate HTML using DOM
function generate_html(status)
{
  // Creates cards for each project and appends them to the HTML area
  let grid = document.getElementById("area")
  for (let i = 0; i < projects_list.length; i++){
    let h2 = document.createElement("h2");
    h2.setAttribute("class","mdl-card__title-text");
    h2.innerHTML += projects_list[i].title

    let title = document.createElement("div");
    title.setAttribute("class", "mdl-card__title");
    title.appendChild(h2);

    let text = document.createElement("div");
    text.setAttribute("class", "mdl-card__supporting-text");
    text.innerHTML += "Unit name: " + projects_list[i].unit + "<br>";
    text.innerHTML += "Due Date: " + projects_list[i].due_date + "<br>";
    text.innerHTML += "Team Members: ";

    for (let j = 0; j < projects_list[i].members.length; j++){
      firestore.doc("students/" + projects_list[i].members[j]).get().then(function(doc){
        // Prevents lecturers name from appearing in team members
        if (doc.data().status != "lecturer"){
          if (j == projects_list[i].members.length - 1) {
            text.innerHTML += doc.data().name + "<br>";
          }
          else {
            text.innerHTML += doc.data().name + ", ";
          }
        }
      });
    }
    let a = document.createElement("a");
    a.setAttribute("class", "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect");
    a.setAttribute("href", "details.html?project="+encodeURIComponent(projects_list[i].title+projects_list[i].unit))
    a.innerHTML += "Details";

    let border = document.createElement("div");
    border.setAttribute("class", "mdl-card__actions mdl-card--border");
    border.appendChild(a);

    let card = document.createElement("div");
    card.setAttribute("class", "demo-card-wide mdl-card mdl-shadow--2dp");
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(border);

    // If lecturer
    if (status == 1){
      let i_elem = document.createElement("i");
      i_elem.setAttribute("class", "material-icons");
      i_elem.innerHTML = "delete";

      let button = document.createElement("button");
      button.setAttribute("class","mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect");
      button.addEventListener("click", function(){
        const warning = confirm("This project will be deleted permanently!\nAre you sure you want to delete this project?");
        if (warning){
          del_item(i);
        }
        else{
          console.log("Not deleted");
        }
      });
      button.appendChild(i_elem);

      let menu = document.createElement("div");
      menu.setAttribute("class","mdl-card__menu");
      menu.appendChild(button);
      card.appendChild(menu);
    }

    let cell = document.createElement("div");
    cell.setAttribute("class", "mdl-cell mdl-cell--4-col");
    cell.appendChild(card);

    grid.appendChild(cell);
  }
}

// Function to delete a project from the database
function del_item(i){
  var firestore = firebase.firestore();
  let item = projects_list.splice(i,1); //[{project data}]
  firestore.doc("projects/" + item[0].title + item[0].unit).get().then(function(doc){
    const members = doc.data().members
    for (m in members){
      const studentRef = firestore.doc("students/" + members[m])
      // Removes project from respective student
      studentRef.update({
        projects: firebase.firestore.FieldValue.arrayRemove(item[0].title + item[0].unit)
      })
    }
    // Deletes entire project
    firestore.doc("projects/" + item[0].title + item[0].unit).delete().then(function() {
          document.location.reload();
      }).catch(function(error) {
          console.error("Error removing document: ", error);
    });
  })
}
