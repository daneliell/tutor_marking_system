// For storing in local storage. Use database once implemented
projects_list = [];

function create_project(){
  let details = {
      project_name: document.getElementById("project_name").value,
      unit_name: document.getElementById("unit_name").value,
      due_date: document.getElementById("due_date").value,
      members: document.getElementById("members").value,
      tasks: document.getElementById("tasks").value,
    }
  if (details.project_name == '' || details.unit_name == '' || details.due_date == '' || details.members == '' || details.tasks == '')
  {
    // If any of the fields are empty, display a snackbar
    document.querySelector('.mdl-js-snackbar');
    let notification = document.querySelector('.mdl-js-snackbar');
    let data = {
      message: "One or more fields are empty!",
      actionHandler: function(event) {},
      actionText: ' ',
      timeout: 2000
    };
    notification.MaterialSnackbar.showSnackbar(data);
  }
  else
  {
    // If not, upload to database
    // For now, using local storage
    add_local(details);
    window.location.replace("projects.html");
  }
}

function add_local(details)
{
  projects_list.push(details);
  if(typeof(Storage) !== "undefined")
  {
  	localStorage.setItem("PROJECTS",JSON.stringify(details));
  }
  else
  {
      alert("Local storage is not supported in current browser");
  }
}


// For storing in local storage. Use database once implemented
window.onload = function(){
  if(typeof(Storage) !== "undefined")
  {
    projects = JSON.parse(localStorage.getItem("PROJECTS"));
    for (let i = 0; i < projects.length ; i++)
    {
      let project = projects[i];
      projects_list.push(project);
    }
  }
  else
  {
      alert("Local storage is not supported in current browser");
  }
};
