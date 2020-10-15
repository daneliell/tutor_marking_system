function details(){
    // HTML elements in Tasks Log
    const slider = document.getElementById("current_progress");
    const percent = document.getElementById("percent");
    const namelist = document.getElementById("namelist")
    const taskslist = document.getElementById("taskslist")
    const hours = document.getElementById("hours")
    const btn_submit = document.getElementById("submit_progress")
    const tables_area = document.getElementById("tables_area")
    const projecttitle = document.getElementById("project_title")

    // HTML elements in estimation
    const e_slider = document.getElementById("e_current_progress");
    const e_percent = document.getElementById("e_percent");
    const e_namelist = document.getElementById("e_namelist")
    const e_taskslistname = document.getElementsByName("e_tasklistname")[0]
    const e_taskslist = document.getElementById("e_taskslist")
    const submit_est = document.getElementById("submit_est")
    const est_table = document.getElementById("est-table")

    const db = firebase.firestore()

    // Get project ID from URL passed from add_projects.js
    var url_string = window.location.href;
    var url = new URL(url_string);
    var pname = decodeURIComponent(url.searchParams.get("project"));
    // Get current project document
    const projRef = db.collection("projects").doc(pname)

    projRef.get().then(function(doc) {
        if (doc.exists) {
            //Write project title on top
            let u = doc.data().unit
            let t = doc.data().title
            projecttitle.innerHTML = u + ": "+ t
            // create member option using DOM
            let members = doc.data().members

            // EST section: Puts student list as option for every member except lecturer/owner
            for (m in members){
                let studentDoc = db.collection("students").doc(members[m])
                studentDoc.get().then(function(doc){
                    if (doc.data().status!="lecturer"){
                        const newOption = document.createElement('option');
                        const optionText = document.createTextNode(doc.data().name);
                        // set option text
                        newOption.appendChild(optionText);
                        // and option value
                        newOption.setAttribute('value',doc.data().name);
                        // add the option to the select box
                        e_namelist.appendChild(newOption);
                    }
                })
                
            }
            
            // LOG section: Puts student list as option for every member except lecturer/owner
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

                //EST section: Put all tasks as option unconditionally
                const newOption = document.createElement('option');
                // const optionText = document.createTextNode(task_arr[t]);
                // set option text
                // newOption.appendChild(optionText);
                // and option value
                newOption.setAttribute('value',task_arr[t]);
                // add the option to the select box
                e_taskslist.appendChild(newOption);

                // LOG section: Put task as option only if the total progress is less than 100
                if (progress!=undefined && progress[task_arr[t]]<100 ){
                    const newOption = document.createElement('option');
                    const optionText = document.createTextNode(task_arr[t]);
                    // set option text
                    newOption.appendChild(optionText);
                    // and option value
                    newOption.setAttribute('value',task_arr[t]);
                    // add the option to the select box
                    taskslist.appendChild(newOption);
                }

                //LOG section: Draw tables based on the number of tasks
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

            //LOG section: Draw table contents
            const log_arr=doc.data().log
            if (log_arr.length>0){
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

            let est_arr = doc.data().estimate.sort(compare)
            if (est_arr.length>0){
                for(e in est_arr){
                    const row = est_table.insertRow(-1)
                    const cell1 = row.insertCell(0);
                    cell1.setAttribute("class", "mdl-data-table__cell--non-numeric")
                    cell1.innerHTML=est_arr[e].task
                    const cell2 = row.insertCell(1);
                    cell2.setAttribute("class", "mdl-data-table__cell--non-numeric")
                    cell2.innerHTML=est_arr[e].member
                    const cell3 = row.insertCell(2);
                    cell3.innerHTML=est_arr[e].percent

                }
            }

            function compare(a,b){
                const t1 = a.task
                const t2 = b.task

                let comparison = 0;
                if (t1 > t2) {
                    comparison = 1;
                } else if (t1 < t2) {
                    comparison = -1;
                }
                return comparison;
            }

            function getEstforTask(t){
                let est_arr = doc.data().estimate
                return est_arr.filter(e=>(e.task==t))
            }

            
            //Boundary check on input fields, disable submit buttons if there exist invalid values
            //Enables button when conditions are met
            function enable_button(){
                const due = doc.data().due_date
                const now = new Date()
				// LOG section
                if (Number(slider.value)>0 && Number(hours.value)>0 && taskslist.value!="" || Date.parse(due)<now){
                    btn_submit.disabled=false
                }
                else{
                    btn_submit.disabled=true
                }
				
				// EST section
				// Users are allowed to submit 0 as percent
                if (e_taskslist.value!="" || Date.parse(due)<now){
                    submit_est.disabled=false
                }
                else{
                    submit_est.disabled=true
                }
            }

            // Update the current slider value (each time you drag the slider handle)
            // Check if button should be enabled when there is input at progress field
            percent.innerHTML = slider.value+"%"; // Change the slider value dynamically
            slider.addEventListener("input", function() {
                percent.innerHTML = this.value+"%";
                enable_button();
            })
            
            // EST section: slider
            e_percent.innerHTML = e_slider.value+"%"; // Change the slider value dynamically
            e_slider.addEventListener("input", function() {
                e_percent.innerHTML = this.value+"%";
                enable_button();
            })
               

            //Check if button should be enabled when there is input at hours field
            hours.addEventListener("input", function(){
                enable_button();
            })

            // LOG section
            taskslist.addEventListener("input",function(){
                enable_button();
            })

            // EST section
            e_taskslist.addEventListener("input",function(){
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

    function update_est(){
        let in_percent=Number(e_slider.value)
        let in_member = e_namelist.value
        let in_task = e_taskslistname.value
        let acc_percent=0 
        let est = {}
        
        projRef.get().then(function(doc){

            const estimate_list = doc.data().estimate
            // Add new task in tasks list if not exist
            projRef.update({
                tasks: firebase.firestore.FieldValue.arrayUnion(in_task)
            })

            for (e in estimate_list){
                 // Accumulate the total estimated contribution on task, not stored
                 if (estimate_list[e].task==in_task && estimate_list[e]!=est){
                    acc_percent+=estimate_list[e].percent
                 }
            }

            // If the entry will make total>100, make it so that it is within 100
            if (acc_percent+in_percent>100){
                in_percent = 100 - acc_percent
            }

            // If this is a new task created by student, add a new field in total progress
            if (doc.data().total_progress[in_task]==undefined){ 
                projRef.update({
                    ["total_progress." + in_task]: 0
                })
            }

            
            for (e in estimate_list){
                // Look for existing member+task combination
                if (estimate_list[e].task == in_task && estimate_list[e].member==in_member){
                    est = estimate_list[e];
                    break;
                }
                
            }

            
            // Updates will only be done when the actual in_percent is more than 0
            // If the student is already contributing (means he wants to update his contribution)
            // Update the record by deleting the old one then add a new record in place
            // else just add the new record 
            if (est.task!=undefined){
                projRef.update({
                    estimate: firebase.firestore.FieldValue.arrayRemove(est)
                })
            }

            projRef.update({
                estimate: firebase.firestore.FieldValue.arrayUnion(
                    {
                        task: in_task,
                        member: in_member,
                        percent: in_percent
                    }
                )
            }).then(()=>{
                window.location.reload()
            })
                
        })

    }

    // Create confirm box before any operation is done when submit button is clicked
    btn_submit.addEventListener("click", function(){
        const warning = confirm("You cannot edit/delete your log later!\nDo you want to submit your progress?")
        if (warning){
            update_log();
        }
    })

    //Submit estimate 
    submit_est.addEventListener("click",function(){
        const warning = confirm("You can still update (but NOT delete) your log later!\nDo you want to submit the data?")
        if (warning){
            update_est();
        }
    })
}


window.onload = function(){
    details();
}
