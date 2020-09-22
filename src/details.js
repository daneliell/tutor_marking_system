function details(){
    const slider = document.getElementById("current_progress");
    const percent = document.getElementById("percent");
    const namelist = document.getElementById("namelist")
    const taskslist = document.getElementById("taskslist")
    const hours = document.getElementById("hours")
    const btn_submit = document.getElementById("submit_progress")
    const tables_area = document.getElementById("tables_area")

    //This should be replaced by info from db
    let tasks_list = ["Task 1", "Task 2","Task 3"]
    let members = ["A","B","C","D"]
    let stat_objects=[]

    
    //Create tables labelled with tasks
    for (t in tasks_list){
        let headers = ["Time", "Member","Progress (%)","Time Spent (hours)"]
        //Create new title
        const task_text = document.createTextNode(tasks_list[t])
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
        new_body.setAttribute("id",tasks_list[t])
        //Create a blank row so we can add records dynamically later
        const blank_row = document.createElement("tr")
        new_body.appendChild(blank_row)
        //Append body to table
        new_table.appendChild(new_body)
        
        //Append body to the area and set break line
        tables_area.appendChild(new_table)
        tables_area.appendChild(document.createElement("br"))
    }

    // create member option using DOM
    for (m in members){
        const newOption = document.createElement('option');
        const optionText = document.createTextNode(members[m]);
        // set option text
        newOption.appendChild(optionText);
        // and option value
        newOption.setAttribute('value',members[m]);
        // add the option to the select box
        namelist.appendChild(newOption);
    }

    // create task option using DOM
    for (t in tasks_list){
        const newOption = document.createElement('option');
        const optionText = document.createTextNode(tasks_list[t]);
        // set option text
        newOption.appendChild(optionText);
        // and option value
        newOption.setAttribute('value',tasks_list[t]);
        // add the option to the select box
        taskslist.appendChild(newOption);
    }
    
    class Stats{
        constructor(name, progress, hours, num_of_tasks){
            this.name = name;
            this.progress = new Array(num_of_tasks).fill(0);
            this.hours = new Array(num_of_tasks).fill(0);
        }
        updateProgress(p,task_number){
            this.progress[task_number]+=p
        }
        updateHours(h,task_number){
            this.hours[task_number]+=h
        }
        
    }
    
    // Update the current slider value (each time you drag the slider handle)
    percent.innerHTML = slider.value+"%"; // Change the slider value dynamically
    slider.addEventListener("input", function() {
        percent.innerHTML = this.value+"%";
    } )

    //Outputs correct information to the tables, return updated objects
    btn_submit.addEventListener("click", function(){
        
        let in_name=namelist.value
        let in_percent=Number(slider.value)
        let in_hours = Number(hours.value)
        let in_task = taskslist.value
        let in_task_index = tasks_list.indexOf(in_task)
        let i=0
        
        //Check if hours input is a valid number
        if (isNaN(in_hours)||in_hours<0){
            alert("Hours input is not a valid number")
        }
        else{
            //Check if there is an object associated with the name
           while (i<stat_objects.length){
               //If true, update the member's information
               if (stat_objects[i].name==in_name){
                   console.log(i)
                   stat_objects[i].updateHours(in_hours, in_task_index)
                   stat_objects[i].updateProgress(in_percent, in_task_index)
                   updateCurrentProgress(i, in_task, in_task_index)
                   break
               }
               else
                    i++;
           }
           //If false, create new object of the member
           if (i==stat_objects.length){
               
                stat_objects.push(new Stats(in_name, in_percent, in_hours, tasks_list.length))
                stat_objects[stat_objects.length-1].updateHours(in_hours, in_task_index)
                stat_objects[stat_objects.length-1].updateProgress(in_percent, in_task_index)
                updateCurrentProgress(stat_objects.length-1, in_task, in_task_index)
                
           }
        }
    })
    
    function updateCurrentProgress(index, task, taskindex){
        const current_table = document.getElementById(task)
        const row = current_table.insertRow(1)
        const cell1 = row.insertCell(0);
        cell1.setAttribute("class", "mdl-data-table__cell--non-numeric")
        const cell2 = row.insertCell(1);
        cell2.setAttribute("class", "mdl-data-table__cell--non-numeric")
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        
        let currentDate = new Date();
        // Add some text to the new cells:
        cell1.innerHTML = currentDate.toLocaleString();
        cell2.innerHTML = stat_objects[index].name;
        cell3.innerHTML = stat_objects[index].progress[taskindex]; 
        cell4.innerHTML = stat_objects[index].hours[taskindex]; 
            
        
    }

}

window.onload = function(){
    details();
}