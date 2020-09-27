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
    var firestore = firebase.firestore();

    /*let members = details.members.split(",");
    let valid_members = [];
    let tasks = details.tasks.split(",");
    let exist = true;

    firestore.collection("students").get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        valid_members.push(doc.data());
      })
    });
    console.log(valid_members);

    for (let i = 0; i < members.length; i++){
      let member = members[i];
      for (let j = 0; i < valid_members.length; j++){
        if (member == valid_members[j]){
          console.log(valid_members[j]);
        }
      }
    }*/

    /*firestore.doc("projects/" + details.project_name + details.unit_name).set({
      title: details.project_name,
      unit: details.unit_name,
      due_date: details.due_date,
      members: members,
    }).then(function(){
      for (let i = 0; i < tasks.length; i++)
      {
        firestore.doc("projects/" + details.project_name + details.unit_name + "/tasks/" + tasks[i]).set({
          total_progress: "",
          total_time: "",
          members_involved: "",
        }).then(function(){
          window.location.replace("projects.html");
        }).catch(function(error){
          console.log("Error");
        })
      }
    }).catch(function(error){
      console.log("Error");
    });*/



    /*projectsRef.doc("Test Project 1FIT2101").delete().then(function() {
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });*/

    /*setTimeout(function(){
    }, 1000);*/
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
  let valid_members = [];

  firestore.collection("students").get().then(function(querySnapshot){
    querySnapshot.forEach(function(doc){
      valid_members.push(doc.data());
    })
  }).then(function(){
    for (let i = 0; i < valid_members; i++){
      
    }
  });
};
