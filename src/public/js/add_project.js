// For storing in local storage. Use database once implemented
projects_list = [];

function enable_button(){
  button = document.getElementById("create_button");
  if (document.getElementById("project_name").value == '' || document.getElementById("unit_name").value == '' || document.getElementById("due_date").value == '' || document.getElementById("members").value == '' || document.getElementById("tasks").value == '' || due_date.checkValidity() == false)
  {
    button.disabled = true;
  }
  else
  {
    button.disabled = false;
  }
}

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
  else if (due_date.checkValidity() == false)
  {
    // If any of the fields are empty, display a snackbar
    document.querySelector('.mdl-js-snackbar');
    let notification = document.querySelector('.mdl-js-snackbar');
    let data = {
      message: "Due date must be a future date",
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
    //add_local(details);
    var firestore = firebase.firestore();

    const projectsRef = firestore.collection("projects");
    projectsRef.doc(details.project_name + details.unit_name).set({
      title: details.project_name,
      unit: details.unit_name,
      due_date: details.due_date,
      members: details.members,
      tasks: details.tasks
    }).then(function(){
      console.log("Status saved");
    }).catch(function (error) {
      console.log("Error");
    });

    projectsRef.doc("eNGDieHAnyFC7vicjQy7").delete().then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

    setTimeout(function(){
      window.location.replace("projects.html");
    }, 1000);
  }
}

function add_local(details)
{
  projects_list.push(details);
  if(typeof(Storage) !== "undefined")
  {
  	localStorage.setItem("PROJECTS",JSON.stringify(projects_list));
  }
  else
  {
      alert("Local storage is not supported in current browser");
  }
}


// For storing in local storage. Use database once implemented
window.onload = function(){
  // Gets today's date
  let today = new Date();
  let date = today.getFullYear() + "-0" + (today.getMonth()+1) + "-" + today.getDate();
  // Provides an error if due date is in the past
  let due_date = document.getElementById("due_date");
  due_date.setAttribute("min", date);

  // Sets input listeners to enable create button once all forms are filled
  let project_name = document.getElementById("project_name");
  let unit_name = document.getElementById("unit_name");
  let members = document.getElementById("members");
  let tasks = document.getElementById("tasks");

  project_name.addEventListener('input', function () {
      enable_button();
  });
  unit_name.addEventListener('input', function () {
      enable_button();
  });
  due_date.addEventListener('input', function () {
      enable_button();
  });
  members.addEventListener('input', function () {
      enable_button();
  });
  tasks.addEventListener('input', function () {
      enable_button();
  });


  /*if(typeof(Storage) !== "undefined")
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
  }*/
};
