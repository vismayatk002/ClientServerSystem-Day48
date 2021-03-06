window.addEventListener('DOMContentLoaded', (event) => {
    let empId = localStorage.getItem("EditId");
    if(empId){
        localStorage.removeItem("EditId");
        const getURL = "http://localhost:3000/EmployeePayroll/"+empId;
        makePromiseCall("GET", getURL, true)
            .then(responseText => {
                setFormValue(JSON.parse(responseText));
        })
        .catch(error => 
            console.log("GET Error Status : " + JSON.stringify(error))
        );
    }
});

function setFormValue(editEmpObj){
    document.querySelector('#name').value = editEmpObj.empName;
    document.querySelector("input[name='profile'][value='"+editEmpObj.profileImg+"']").checked = true;
    document.querySelector("input[name='gender'][value='"+editEmpObj.gender+"']").checked = true;
    document.querySelector('#salary').value = editEmpObj.salary;
    document.querySelector('.salary-output').textContent = editEmpObj.salary;

    let date = editEmpObj.startDate;
    let dateList = date.split('-');
    document.querySelector('#day').value = dateList[2];
    document.querySelector('#month').value = dateList[1];
    document.querySelector('#year').value = dateList[0];
    document.querySelector('#notes').value = editEmpObj.notes;
    document.querySelector('#empId').value = editEmpObj.id;
}

class Employee{

    empName;
    profileImg;
    gender;
    dept;
    salary;
    startDate;
    notes;

    set empName(empName){
        this.empName = empName;
    }
    set profileImg(profileImg){
        this.profileImg = profileImg;
    }
    set gender(gender){
        this.gender = gender;
    }
    set dept(dept){
        this.dept = dept;
    }
    set salary(salary){
        this.salary = salary;
    }
    set startDate(startDate){
        this.startDate = startDate;
    }
    set notes(notes){
        this.notes = notes;
    }
}

//UC8   
const salary = document.querySelector('#salary');
const output = document.querySelector('.salary-output');
output.textContent = salary.value;
salary.addEventListener('input',function() {
    output.textContent = salary.value;
});

function validateName(empObj){
    const empName = document.querySelector('#name');
    const nameError = document.querySelector('.name-error');
    let nameRegex = RegExp('^[A-Z]{1}[a-z]{2,}$');
    if(nameRegex.test(empName.value)){
        nameError.textContent = "";
        empObj.empName = empName.value;
    }
    else{
        throw "Name is incorrect";
    }

}

function validateDate(empObj){
    let startDate = document.querySelector('#year').value+'-'+document.querySelector('#month').value+'-'+document.querySelector('#day').value;
    let today = new Date();
    let givenDate = new Date(startDate+" 0:00:00");

    if(givenDate > today){
        throw 'Invalid date';
    }else{
        empObj.startDate = startDate;
    }
}

function saveData(empObj){
    const postURL = "http://localhost:3000/EmployeePayroll";
    makePromiseCall("POST", postURL, true, empObj)
        .then(responseText => {
            alert("Submitted Successfully !");
    })
    .catch(error => console.log("POST Error Status : " + JSON.stringify(error)));
}

function updateData(empObj,id){
   
    const putURL = "http://localhost:3000/EmployeePayroll/"+id;
    makePromiseCall("PUT", putURL, true, empObj)
        .then(responseText => {
            alert("Details Updated Successfully !");
    })
    .catch(error => console.log("PUT Error Status : " + JSON.stringify(error)));
}

function formReset() {
    document.getElementById("payrollForm").reset();
}

function onSubmit(){
    try{

        let empObj = new Employee();

        validateName(empObj);

        const profileImg = document.querySelector("input[name='profile']:checked");
        empObj.profileImg = profileImg.value;

        const gender = document.querySelector("input[name='gender']:checked");
        empObj.gender = gender.value;

        const dept = document.querySelectorAll("input[type='checkbox']:checked");
        let deptList = [];
        for (let i = 0; i < dept.length; i++) {   
            deptList.push(dept[i].value);
        }   
        empObj.dept = deptList;

        const notes = document.querySelector('#notes');
        empObj.notes = notes.value;

        validateDate(empObj);

        empObj.salary = salary.value;

        const resultId = document.querySelector('#empId').value;
        if(resultId == ''){
            saveData(empObj);
        }
        else{
            updateData(empObj,resultId);
        }

    }catch(e){
        alert(e);
        console.log(e);
    }
    return false;
}

 