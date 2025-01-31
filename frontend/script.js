url = "http://localhost:5000/api/submit";

window.onload = function() {
    updateTaskList();
};

var tasks = [];

class Task {
    constructor(id, text, isCompleted) {
        this.id = id;
        this.text = text;
        this.isCompleted = isCompleted;
    }
}

async function send_task(input_element) {
    var text = input_element.value;
    var data_received = "";

    if (text=="") {
        console.log("Nie mozna wyslac pustego tekstu!");
        return;
    }

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"action":"SEND","data":"${text}"}`
    })
    .then(response => response.json())
    .then(data => data_received = JSON.stringify(data))
    .catch(error => console.error(`Błąd: ${error}`));

    console.log(`Otrzymano dane: ${data_received}`);

    input_element.value = "";
    updateTaskList();
}

async function updateTaskList() {
    var data_received = "";

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"action":"UPDATE","data":"0"}`
    })
    .then(response => response.json())
    .then(data => data_received= JSON.stringify(data))
    .catch(error => console.error(`Błąd: ${error}`));

    console.log(`Otrzymane dane: ${data_received}`);
    tasks = converToList(JSON.parse(data_received).data);
    renderTasks();
}

function converToList(data) {
    var arr = [];
    data.forEach(row => {
        arr.push(new Task(
            parseInt(row.id), 
            row.text, 
            true ? row.isCompleted == "True" : false
        ))
    });
    return arr;
}

async function removeTask(taskID) {
    var data_received = "";

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"action":"DELETE","data":"${taskID}"}`
    })
    .then(response => response.json())
    .then(data => data_received = JSON.stringify(data))
    .catch(error => console.error(`Błąd: ${error}`));

    console.log(`Otrzymane dane: ${data_received}`);
    updateTaskList()
}

async function updateTaskStatus(taskID) {
    var data_received = "";

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: `{"action":"STATUS","data":"${taskID}"}`
    })
    .then(response => response.json())
    .then(data => data_received = JSON.stringify(data))
    .catch(error => console.error(`Błąd: ${error}`));

    console.log(`Otrzymane dane: ${data_received}`);
    updateTaskList();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');

        const statusBox = document.createElement('input');
        statusBox.type = 'checkbox';
        statusBox.checked = task.isCompleted;
        statusBox.classList.add('status-checkbox');
        statusBox.onclick = () => updateTaskStatus(task.id);

        const taskContent = document.createElement('span');
        taskContent.textContent = task.text;
        taskContent.classList.add('task-content');

        if (task.isCompleted) {
            taskContent.classList.add('completed');
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => removeTask(task.id);

        li.appendChild(statusBox);
        li.appendChild(taskContent);
        li.appendChild(deleteButton);

        if (task.isCompleted) {
            li.classList.add('completed');
        }

        taskList.appendChild(li);
    });
}
