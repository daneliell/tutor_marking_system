/*const delete1 = document.getElementById("delete1")
const delete2 = document.getElementById("delete2")
const delete3 = document.getElementById("delete3")

function remove1(){
  document.getElementById("example1").remove()
}
function remove2(){
  document.getElementById("example2").remove()
}
function remove3(){
  document.getElementById("example3").remove()
}

delete1.addEventListener("click", remove1)
delete2.addEventListener("click", remove2)
delete3.addEventListener("click", remove3)*/

// For storing in local storage. Use database once implemented
projects_list = [];

// For storing in local storage. Use database once implemented
window.onload = function(){

  if(typeof(Storage) !== "undefined")
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
        let project_name = document.createTextNode(projects[i].project_name);
        let primary_text = document.createElement("span");
        primary_text.setAttribute("class","mdc-list-item__primary-text");
        primary_text.appendChild(project_name);

        let due_date = document.createTextNode("Due date: " + projects[i].due_date);
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

        let new_item = document.createElement("li");
        new_item.setAttribute("class","mdc-list-item")
        new_item.append(ripple);
        new_item.appendChild(text);
        new_item.appendChild(button);

        let cell = document.createElement("div");
        cell.setAttribute("class", "mdc-layout-grid__cell");
        cell.setAttribute("id", "item"+i);
        cell.appendChild(new_item);

        grid_inner.appendChild(cell);
      }
    }
  }
  else
  {
      alert("Local storage is not supported in current browser");
  }
};

function del_item(i){
  projects_list.splice(i,1);
  localStorage.setItem("PROJECTS",JSON.stringify(projects_list));
  document.location.reload();
}
