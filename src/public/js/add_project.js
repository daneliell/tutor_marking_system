let projects_list = [];
let valid_members = [];

// Function to enable the submit button once all fields are filled up
function enable_button(){
  button = document.getElementById("create_button");
  let checked = false;
  for (let i = 0; i < valid_members.length; i++){
    if (document.getElementById("list-checkbox-"+i).checked == true){
      checked = true;
    }
  }
  if (document.getElementById("project_name").value == '' || document.getElementById("unit_name").value == '' || document.getElementById("due_date").value == '' || due_date.checkValidity() == false || checked == false)
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

  if (details.project_name == '' || details.unit_name == '' || details.due_date == '' || details.members == '')
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
    var firestore = firebase.firestore();

    let project_id = details.project_name + details.unit_name;

    // Handle when no task is given
    if (details.tasks!=""){
      tasks = details.tasks.split(",");
      for (let i = 0; i < tasks.length; i++){
        tasks[i] = tasks[i].replaceAll(".",' ').trim();
      }
    }
    else{
      tasks=[]
    }

    //Creating a map to store total progress
    // Workaround when no tasks are added
    let obj={}
    if (tasks.length>0){
      tasks.forEach(e=>obj[e]=0)
    }
    firebase.auth().onAuthStateChanged(function(user) {
      // Creator/owner is always in the project
      let members = [user.email.substring(0,8)];
      // Get all the members
      for (let i = 0; i < valid_members.length; i++){
        let checked = document.getElementById("list-checkbox-"+i).checked;
        if (checked){
          members.push(valid_members[i].id);
        }
      }

      // Update their document
      for (m in members){
        let studentRef = firestore.doc("students/" + members[m]);
          studentRef.update({
            projects: firebase.firestore.FieldValue.arrayUnion(project_id)
          })
      }

        firestore.doc("projects/" + project_id).set({
          title: details.project_name,
          unit: details.unit_name,
          due_date: details.due_date,
          members: members,
          tasks: tasks,
          log:[],
          estimate:[],
          chatlog:[],
          total_progress: obj
        }).then(function(){
          window.location.replace("projects.html");
        });

    })

  }
}


window.onload = function(){
  // Gets today's date
  let today = new Date();
  let date = "";
  let year = today.getFullYear();
  let month = "";
  let day = "";
  if ((today.getMonth()+1) >= 10)
  {
    month = today.getMonth()+1
  }
  else
  {
    month = "0" + (today.getMonth()+1)
  }
  if (today.getDate() < 10)
  {
    day = "0" + today.getDate();
  }
  else
  {
    day = today.getDate();
  }
  date = year + "-" + month + "-" + day;

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

  var firestore = firebase.firestore();

  // Gets students from the database
  firestore.collection("students").orderBy("name").get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      if (doc.data().status == "student"){
        valid_members.push(doc.data());
      }
    })
  }).then(function(){
    // Creates HTML elements using DOM
    let list = document.getElementById("members");
    for (let i = 0; i < valid_members.length; i++){
      let student_name = document.createTextNode(valid_members[i].name);

      let name_span = document.createElement("span");
      name_span.setAttribute("class", "mdl-list__item-primary-content");
      name_span.appendChild(student_name);

      let input = document.createElement("input");
      input.setAttribute("id", "list-checkbox-"+i);
      input.setAttribute("class", "mdl-checkbox__input");
      input.setAttribute("type", "checkbox");

      let label = document.createElement("label");
      label.setAttribute("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect")
      label.setAttribute("for", "list-checkbox-"+i);
      label.appendChild(input);

      let check_span = document.createElement("span");
      check_span.setAttribute("class", "mdl-list__item-secondary-action");
      check_span.appendChild(label);

      let list_item = document.createElement("li");
      list_item.setAttribute("class", "mdl-list__item");
      list_item.appendChild(name_span);
      list_item.appendChild(check_span);

      list_item.appendChild(check_span);
      list.appendChild(list_item);
    }
  });
};
