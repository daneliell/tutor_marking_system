function details(){
    const slider = document.getElementById("current_progress");
    const percent = document.getElementById("percent");
    const namelist = document.getElementById("namelist")
    const hours = document.getElementById("hours")
    const btn_submit = document.getElementById("submit_progress")
    const current_table = document.getElementById("current_table")

    let members = ["A","B","C","D"]
    let stat_objects=[]
    let total_progress=0
    let total_hours=0
    

    // create option using DOM
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
    
    class Stats{
        constructor(name, progress, hours){
            this.name = name;
            this.progress = progress;
            this.hours = hours;
        }
        updateProgress(p){
            this.progress+=p
        }
        updateHours(h){
            this.hours+=h
        }
        
    }
    
    // Update the current slider value (each time you drag the slider handle)
    percent.innerHTML = slider.value+"%"; // Change the slider value dynamically
    slider.oninput = function() {
        percent.innerHTML = this.value+"%";
    } 

    //Outputs correct information to the tables, return updated objects
    btn_submit.onclick = function(){
        
        let in_name=namelist.value
        let in_percent=Number(slider.value)
        let in_hours = Number(hours.value)
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
                   stat_objects[i].updateHours(in_hours)
                   total_hours+=in_hours
                   stat_objects[i].updateProgress(in_percent)
                   total_progress+=in_percent
                   console.log(total_progress)
                   break
               }
               else
                    i++;
           }
           //If false, create new object of the member
           if (i==stat_objects.length){
                stat_objects.push(new Stats(in_name, in_percent, in_hours))
                
           }
           updateCurrentProgress()
           updateSummary()
        }
    }
    
    function updateCurrentProgress(){
        for (i in stat_objects){
            const row = current_table.insertRow(1)
            const cell1 = row.insertCell(0);
            cell1.setAttribute("class", "mdl-data-table__cell--non-numeric")
            const cell2 = row.insertCell(1);
            cell2.setAttribute("class", "mdl-data-table__cell--non-numeric")
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);

            let currentDate = new Date();
            // Add some text to the new cells:
            cell1.innerHTML = currentDate.getDate()+"/"+currentDate.getMonth()+"/"+currentDate.getFullYear()+ " "+ currentDate.getHours()+":"+currentDate.getMinutes();
            cell2.innerHTML = stat_objects[i].name;
            cell3.innerHTML = stat_objects[i].progress; 
            cell4.innerHTML = stat_objects[i].hours; 
            
        }
    }


}

window.onload = function(){
    details();
}