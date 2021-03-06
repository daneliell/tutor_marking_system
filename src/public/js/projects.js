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
        else if (doc.data().status == "lecturer")
        {
          if (doc.data().projects.length == 0){
            let help_text = document.createTextNode("You have no active projects.");
            let title = document.createElement("h5");
            title.appendChild(help_text);
            area.innerHTML += "<br>";
            area.appendChild(title);
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


function generate_html(status)
{
  if (projects_list.length == 0){
    let help_text = document.createTextNode("You have no active projects.");
    let title = document.createElement("h5");
    title.appendChild(help_text);
    area.innerHTML += "<br>";
    area.appendChild(title);
    area.innerHTML += "<br>";
  }
  else
  {
    let list = document.createElement("ul");
    list.setAttribute("class","mdc-list mdc-list--two-line");
    let grid = document.createElement("div");
    grid.setAttribute("class","mdc-layout-grid")
    let grid_inner = document.createElement("div");
    grid_inner.setAttribute("class", "mdc-layout-grid__inner");

    grid.appendChild(grid_inner);
    list.appendChild(grid);
    area.appendChild(list);

    for (let i = 0; i < projects_list.length; i++){
      let project_name = document.createTextNode(projects_list[i].title);
      let primary_text = document.createElement("span");
      primary_text.setAttribute("class","mdc-list-item__primary-text");
      primary_text.appendChild(project_name);

      let due_date = document.createTextNode("Due Date: " + projects_list[i].due_date);
      let secondary_text = document.createElement("span");
      secondary_text.setAttribute("class","mdc-list-item__secondary-text");
      secondary_text.appendChild(due_date);

      let text = document.createElement("span");
      text.setAttribute("class","mdc-list-item__text");
      text.append(primary_text);
      text.append(secondary_text);

      let ripple = document.createElement("span");
      ripple.setAttribute("class", "mdc-list-item__ripple");

      let div = document.createElement("div");
      div.innerHTML += "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;";
      div.innerHTML += "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;";
      if (status == 1){
        let ripple_button = document.createElement("div");
        ripple_button.setAttribute("class", "mdc-button__ripple")

        let icon = document.createElement("i");
        icon.setAttribute("class", "material-icons");
        let del_icon = document.createTextNode("delete");
        icon.appendChild(del_icon);

        let button = document.createElement("button");
        button.setAttribute("class", "mdc-button mdc-button--raised")
        button.addEventListener("click", function(){
          const warning = confirm("This project will be deleted permanently!\nAre you sure you want to delete this project?")
          if (warning){
            del_item(i)
          }
          else{
            console.log("Not deleted")
          }
        });
        button.appendChild(ripple_button);
        button.appendChild(icon);

        div.appendChild(button);
      }

      let link = document.createElement("a");
      link.setAttribute("href", "details.html?project="+encodeURIComponent(projects_list[i].title+projects_list[i].unit));
      link.setAttribute("style", "text-decoration:none;color: black;")
      link.appendChild(text);

      let new_item = document.createElement("li");
      new_item.setAttribute("class","mdc-list-item")
      new_item.appendChild(link);
      new_item.appendChild(ripple);
      new_item.appendChild(div);

      let cell = document.createElement("div");
      cell.setAttribute("class", "mdc-layout-grid__cell");
      cell.setAttribute("id", "item"+i);
      cell.appendChild(new_item);

      grid_inner.appendChild(cell);
    }
  }
}

function del_item(i){
  var firestore = firebase.firestore();
  let item = projects_list.splice(i,1); //[{project data}]
  firestore.doc("projects/" + item[0].title + item[0].unit).get().then(function(doc){
    const members = doc.data().members
    for (m in members){
      const studentRef = firestore.doc("students/" + members[m])
      studentRef.update({
        projects: firebase.firestore.FieldValue.arrayRemove(item[0].title + item[0].unit)
      })
    }

    firestore.doc("projects/" + item[0].title + item[0].unit).delete().then(function() {
          document.location.reload();
      }).catch(function(error) {
          console.error("Error removing document: ", error);
    });
  })
}
