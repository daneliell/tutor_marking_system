projects_list = [];

window.onload = function(){
  var firestore = firebase.firestore();
  let i = 0;
  firestore.collection("projects").get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      projects_list.push(doc.data());
    })
  }).then(function(){
    if (projects_list.length == 0){
      let help_text = document.createTextNode("You have no active projects.");
      let title = document.createElement("h5");
      title.appendChild(help_text);
      area.appendChild(title);
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
        ripple.setAttribute("class", "mdc-list-item__ripple")

        let ripple_button = document.createElement("div");
        ripple_button.setAttribute("class", "mdc-button__ripple")

        let icon = document.createElement("i");
        icon.setAttribute("class", "material-icons");
        let del_icon = document.createTextNode("delete");
        icon.appendChild(del_icon);

        let button = document.createElement("button");
        button.setAttribute("class", "mdc-button mdc-button--raised mdl-js-button mdl-button--fab")
        button.setAttribute("type", "button");
        button.addEventListener("click", function(){
          del_item(i);
        });
        button.appendChild(ripple_button);
        button.appendChild(icon);

        let link = document.createElement("a");
        link.setAttribute("href", "details.html?project="+encodeURIComponent(projects_list[i].title+projects_list[i].unit));
        link.setAttribute("style", "text-decoration:none;color: black;")
        link.appendChild(text);

        let new_item = document.createElement("li");
        new_item.setAttribute("class","mdc-list-item")
        new_item.appendChild(link);
        new_item.appendChild(ripple);
        new_item.appendChild(button);

        let cell = document.createElement("div");
        cell.setAttribute("class", "mdc-layout-grid__cell");
        cell.setAttribute("id", "item"+i);
        cell.appendChild(new_item);

        grid_inner.appendChild(cell);
      }
    }
  });
};

  /*if(typeof(Storage) !== "undefined")
  {
    let projects = JSON.parse(localStorage.getItem("PROJECTS"));
    let area = document.getElementById("area");


    if (projects.length == 0)
    {
      let help_text = document.createTextNode("You have no active projects.");
      let title = document.createElement("h5");
      title.appendChild(help_text);
      area.appendChild(title);
    }

    else
    {
      for (let i = 0; i < projects.length ; i++)
      {
        let project = projects[i];
        projects_list.push(project);
      }
      console.log(projects_list);

      let list = document.createElement("ul");
      list.setAttribute("class","mdc-list mdc-list--two-line");
      let grid = document.createElement("div");
      grid.setAttribute("class","mdc-layout-grid")
      let grid_inner = document.createElement("div");
      grid_inner.setAttribute("class", "mdc-layout-grid__inner");

      grid.appendChild(grid_inner);
      list.appendChild(grid);
      area.appendChild(list);

      for (let i = 0; i < projects.length; i++){
        let project_name = document.createTextNode(projects[i].title);
        let primary_text = document.createElement("span");
        primary_text.setAttribute("class","mdc-list-item__primary-text");
        primary_text.appendChild(project_name);

        let due_date = document.createTextNode("Due Date: " + projects[i].due_date);
        let secondary_text = document.createElement("span");
        secondary_text.setAttribute("class","mdc-list-item__secondary-text");
        secondary_text.appendChild(due_date);

        let text = document.createElement("span");
        text.setAttribute("class","mdc-list-item__text");
        text.append(primary_text);
        text.append(secondary_text);


        let ripple = document.createElement("span");
        ripple.setAttribute("class", "mdc-list-item__ripple")

        let ripple_button = document.createElement("div");
        ripple_button.setAttribute("class", "mdc-button__ripple")


        let icon = document.createElement("i");
        icon.setAttribute("class", "material-icons");
        let del_icon = document.createTextNode("delete");
        icon.appendChild(del_icon);

        let button = document.createElement("button");
        button.setAttribute("class", "mdc-button mdc-button--raised mdl-js-button mdl-button--fab")
        button.setAttribute("type", "button");
        button.addEventListener("click", function(){
          del_item(i);
        });
        button.appendChild(ripple_button);
        button.appendChild(icon);

        let link = document.createElement("a");
        link.setAttribute("href", "details.html");
        link.setAttribute("style", "text-decoration:none;color: black;")
        link.appendChild(text);

        let new_item = document.createElement("li");
        new_item.setAttribute("class","mdc-list-item")
        new_item.appendChild(link);
        new_item.appendChild(ripple);
        new_item.appendChild(button);

        let cell = document.createElement("div");
        cell.setAttribute("class", "mdc-layout-grid__cell");
        cell.setAttribute("id", "item"+i);
        cell.appendChild(new_item);

        grid_inner.appendChild(cell);
        grid_inner.addEventListener("click", function(){
          localStorage.setItem("projectName",projects[i].project_name);
          window.location.href = "details.html"


        })
      }
    }
  }
  else
  {
      alert("Local storage is not supported in current browser");
  }*/

function del_item(i){
  var firestore = firebase.firestore();
  let item = projects_list.splice(i,1);
  firestore.doc("projects/" + item[0].title + item[0].unit).delete().then(function() {
        document.location.reload();
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}
