let projects_list = [];
let valid_members = [];

function enable_button(){
  button = document.getElementById("create_button");
  let checked = false;
  for (let i = 0; i < valid_members.length; i++){
    if (document.getElementById("list-checkbox-"+i).checked == true){
      checked = true;
    }
  }
  if (document.getElementById("project_name").value == '' || document.getElementById("unit_name").value == '' || document.getElementById("due_date").value == '' ||  document.getElementById("tasks").value == '' || due_date.checkValidity() == false || checked == false)
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
    var firestore = firebase.firestore();

    let project_id = details.project_name + details.unit_name;

    let tasks = details.tasks.split(",");
    for (let i = 0; i < tasks.length; i++){
      tasks[i] = tasks[i].trim();
    }

    let members = [];
    for (let i = 0; i < valid_members.length; i++){
      let checked = document.getElementById("list-checkbox-"+i).checked;
      if (checked == true){
        members.push(valid_members[i].id);
        let studentRef = firestore.doc("students/" + valid_members[i].id);
        let projects_array = [];
        studentRef.get().then(function(doc){
          if (doc.exists){
            projects_array = doc.data() ;
          }
        })
        projects_array.push(project_id);
        studentRef.update({
          projects: projects_array
        })
      }
    }

    firestore.doc("projects/" + project_id).set({
      title: details.project_name,
      unit: details.unit_name,
      due_date: details.due_date,
      members: members,
      tasks: tasks,
      log:[]
    }).then(function(){
      window.location.replace("projects.html");
    });
  }
}


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

  var firestore = firebase.firestore();

  firestore.collection("students").get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      valid_members.push(doc.data());
    })
  }).then(function(){
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
