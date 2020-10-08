function details(){
    const slider = document.getElementById("current_progress");
    const percent = document.getElementById("percent");
    const namelist = document.getElementById("namelist")
    const taskslist = document.getElementById("taskslist")
    const hours = document.getElementById("hours")
    const btn_submit = document.getElementById("submit_progress")
    const tables_area = document.getElementById("tables_area")
    const projecttitle = document.getElementById("project_title")

    const db = firebase.firestore()
    
    // Get project ID from URL passed from add_projects.js
    var url_string = window.location.href; 
    var url = new URL(url_string);
    var pname = decodeURIComponent(url.searchParams.get("project"));
    // Get current project document
    const projRef = db.collection("projects").doc(pname)
    const studentRef = db.collection("students")

    // console.log(localStorage.getItem("projectName"))
    
    
    projRef.get().then(function(doc) {
        if (doc.exists) {
            //Write project title on top
            let u = doc.data().unit
            let t = doc.data().title
            projecttitle.innerHTML = u + ": "+ t
            // create member option using DOM
            let members = doc.data().members
            firebase.auth().onAuthStateChanged(function(user) {
                const id = user.email.substring(0,8)
                if (members.includes(id)){
                    members = [id]
                }
                else{
                    console.log("Are you an admin?")
                }
                for (m in members){
                    let studentDoc = db.collection("students").doc(members[m])
                    studentDoc.get().then(function(doc){
                        const newOption = document.createElement('option');
                        const optionText = document.createTextNode(doc.data().name);
                        // set option text
                        newOption.appendChild(optionText);
                        // and option value
                        newOption.setAttribute('value',doc.data().name);
                        // add the option to the select box
                        namelist.appendChild(newOption);
                    })
                }
            });
            
            // Get tasks list 
            let task_arr = doc.data().tasks
            let progress = doc.data().total_progress
            for (t in task_arr){
                if (progress[task_arr[t]]<100){
                    const newOption = document.createElement('option');
                    const optionText = document.createTextNode(task_arr[t]);
                    // set option text
                    newOption.appendChild(optionText);
                    // and option value
                    newOption.setAttribute('value',task_arr[t]);
                    // add the option to the select box
                    taskslist.appendChild(newOption);
                }

                //Create new title
                const task_text = document.createTextNode(task_arr[t])
                const new_title = document.createElement("h4")
                new_title.appendChild(task_text)
                tables_area.appendChild(new_title)

                //Create new table
                const new_table =  document.createElement("table")
                new_table.setAttribute("class","mdl-data-table mdl-js-data-table mdl-shadow--2dp")
                const new_header = document.createElement("thead")
                const new_hrow = document.createElement("tr")

                // Time header
                const time_header = document.createElement("th")
                time_header.setAttribute("class","mdl-data-table__cell--non-numeric")
                const time_text = document.createTextNode("Time")
                time_header.appendChild(time_text)
                new_hrow.appendChild(time_header)
                
                //Add Member column
                //HTML code: <th class="mdl-data-table__cell--non-numeric">Member</th>
                const member_header = document.createElement("th")
                member_header.setAttribute("class","mdl-data-table__cell--non-numeric")
                const member_text = document.createTextNode("Member")
                member_header.appendChild(member_text)
                new_hrow.appendChild(member_header)
                
                //Add Progess column
                //HTML code:<th>Progress (%)</th>
                const progress_header = document.createElement("th")
                const progress_text = document.createTextNode("Progress (%)")
                progress_header.appendChild(progress_text)
                new_hrow.appendChild(progress_header)
                
                //Add Time spent column
                //HTML code: <th>Time Spent (hours)</th>
                const spent_header = document.createElement("th")
                const spent_text = document.createTextNode("Time Spent (hours)")
                spent_header.appendChild(spent_text)
                new_hrow.appendChild(spent_header)
                
                //Append the header row to header atb
                new_header.appendChild(new_hrow)
                //Append header row w/ titles to the table
                new_table.appendChild(new_header)
                
                //Create body
                const new_body = document.createElement("tbody")
                new_body.setAttribute("id",task_arr[t])
                //Create a blank row so we can add records dynamically later
                const blank_row = document.createElement("tr")
                new_body.appendChild(blank_row)
                //Append body to table
                new_table.appendChild(new_body)
                
                //Append body to the area and set break line
                tables_area.appendChild(new_table)
                tables_area.appendChild(document.createElement("br"))

            }

            //Draw table contents
            const log_arr=doc.data().log
            if (log_arr.length!=0){
                for (l in log_arr){
                    const current_table = document.getElementById(log_arr[l].task)
                    const row = current_table.insertRow(1)
                    const cell1 = row.insertCell(0);
                    cell1.setAttribute("class", "mdl-data-table__cell--non-numeric")
                    cell1.innerHTML=log_arr[l].time
                    const cell2 = row.insertCell(1);
                    cell2.setAttribute("class", "mdl-data-table__cell--non-numeric")
                    cell2.innerHTML=log_arr[l].name
                    const cell3 = row.insertCell(2);
                    cell3.innerHTML=log_arr[l].progress
                    const cell4 = row.insertCell(3);
                    cell4.innerHTML=log_arr[l].hours
                }
            }

            //Enables button when conditions are met
            function enable_button(){
                const due = doc.data().due_date
                const now = new Date()
                if (Number(slider.value)>0 && Number(hours.value)>0 && taskslist.value!="" || Date.parse(due)<now){
                    btn_submit.disabled=false
                }
                else{
                    btn_submit.disabled=true
                }
            }

            // Update the current slider value (each time you drag the slider handle)
            // Check if button should be enabled when there is input at progress field
            percent.innerHTML = slider.value+"%"; // Change the slider value dynamically
            slider.addEventListener("input", function() {
                percent.innerHTML = this.value+"%";
                enable_button();
            })
            
            //Check if button should be enabled when there is input at hours field
            hours.addEventListener("input", function(){
                enable_button();
            })

            taskslist.addEventListener("input",function(){
                enable_button();
            })
            
        } 
        else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });

    
    function update_log(){
        let in_percent=Number(slider.value)
        let in_hours = Number(hours.value)
        let in_member = namelist.value
        let in_task = taskslist.value

        // Sanitize percent inputs
        // By limiting total progress to 100, if the total exceed 100, minus the excess
        projRef.get().then(function(doc){
            const current_progress = doc.data().total_progress[in_task]
            let next = current_progress+in_percent
            if (next>100){
                in_percent=in_percent-(next-100)
            }

        //Updates the list of logs and update the total progress map at the same time
        const now = new Date()
        const batch = db.batch()
        batch.update(projRef, {
            log:firebase.firestore.FieldValue.arrayUnion(
                {
                    time: now.toLocaleString(),
                    name:in_member,
                    progress:in_percent,
                    hours:in_hours,
                    task:in_task
                }
            )
        })

        batch.update(projRef, {
            ["total_progress." + in_task]: firebase.firestore.FieldValue.increment(in_percent)
        });

        batch.commit()
        .then(() => {
            console.log('Success!')
            window.location.reload()
        })
        .catch(err => console.log('Failed!', err));
        })

    }

    // Create confirm box before any operation is done when submit button is clicked
    btn_submit.addEventListener("click", function(){
        const warning = confirm("You cannot edit/delete your log later!\nDo you want to submit your progress?")
        if (warning){
            update_log();
        }
    })
}

window.onload = function(){
    details();
}