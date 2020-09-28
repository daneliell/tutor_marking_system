function details(){
    const slider = document.getElementById("current_progress");
    const percent = document.getElementById("percent");
    const namelist = document.getElementById("namelist")
    const taskslist = document.getElementById("taskslist")
    const hours = document.getElementById("hours")
    const btn_submit = document.getElementById("submit_progress")
    const tables_area = document.getElementById("tables_area")

    const db = firebase.firestore()
    //todo: get name from projects, this is just a static project col
    let pname="TESTFIT1001"
    const projRef = db.collection("projects").doc(pname)

    // firebase.auth().onAuthStateChanged(function(user) {
    // if (user) {
    //     console.log(user.email)
    // } else {
    //     // No user is signed in.
    // }
    // });

    // console.log(localStorage.getItem("projectName"))
    
    // create member option using DOM
    projRef.get().then(function(doc) {
        if (doc.exists) {
            //Get member list
            let members = doc.data().members
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
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    });
        
    
    // const taskRef = projRef.collection("tasks")
    projRef.get().then(function(doc) {
        // console.log(doc.id(doc title), " => ", doc.data()(details));
        // Get tasks list 
        let task_arr = doc.data().tasks
        for (t in task_arr){
            const newOption = document.createElement('option');
            const optionText = document.createTextNode(task_arr[t]);
            // set option text
            newOption.appendChild(optionText);
            // and option value
            newOption.setAttribute('value',task_arr[t]);
            // add the option to the select box
            taskslist.appendChild(newOption);


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
    })
    .catch(function(error) {
        console.log("Error getting document:", error);
    });

    //Print the tables
    projRef.get().then(function(doc) {
        const log_arr=doc.data().log
        // querySnapshot.forEach(function(doc) {
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
 
    })    
    
    // taskRef.get().then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         const logRef = taskRef.doc(doc.id).collection("log").orderBy("time")
    //         const current_table = document.getElementById(doc.id)
    //         logRef.get().then(function(querySnapshot) {
    //             querySnapshot.forEach(function(doc) {
    //                 const row = current_table.insertRow(1)
    //                 const cell1 = row.insertCell(0);
    //                 cell1.setAttribute("class", "mdl-data-table__cell--non-numeric")
    //                 cell1.innerHTML=doc.data().time
    //                 const cell2 = row.insertCell(1);
    //                 cell2.setAttribute("class", "mdl-data-table__cell--non-numeric")
    //                 cell2.innerHTML=doc.data().name
    //                 const cell3 = row.insertCell(2);
    //                 cell3.innerHTML=doc.data().progress
    //                 const cell4 = row.insertCell(3);
    //                 cell4.innerHTML=doc.data().hours
    //             })
    //         })
    // })


    // Update the current slider value (each time you drag the slider handle)
    percent.innerHTML = slider.value+"%"; // Change the slider value dynamically
    slider.addEventListener("input", function() {
        percent.innerHTML = this.value+"%";
    })

    btn_submit.addEventListener("click", function(){
        let in_percent=Number(slider.value)
        let in_hours = Number(hours.value)
        let in_member = namelist.value
        let in_task = taskslist.value

        //Create new map in log array
        const now = new Date()
        projRef.update({
            "log":firebase.firestore.FieldValue.arrayUnion({
                time: now.toLocaleString(),
                name:in_member,
                progress:in_percent,
                hours:in_hours,
                task:in_task
            })

        })
        // const logRef = projRef.doc(in_task).collection("log")
        // logRef.add({
        //     name: in_member,
        //     progress: in_percent,
        //     hours:in_hours,
        //     time: now.toLocaleString()
        // })

        
    })
}

window.onload = function(){
    details();
}