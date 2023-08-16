async function initAddTask() {
    await includeHTML();
    setURL("http://127.0.0.1:8000/add_task/");
    await loadAllTasks();
    activeAddTaskNavLink();
}


async function loadAllTasks() {
    const response = await fetch("http://127.0.0.1:8000/add_task/");
    allTasks = await response.json();
}


async function saveAllTasks(task) {
    const response = await fetch("http://127.0.0.1:8000/add_task/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    const data = await response.json();
if (response.status === 400) {
    
}
    return data;
}


let allTasks = [];
let currentTaskPrio;

let urgent = false;
let medium = false;
let low = false


async function addTask(e) {
    e.preventDefault();

    let taskTitle = document.getElementById('taskTitle');
    let taskDescription = document.getElementById('taskDescription');
    let taskCategory = document.getElementById('taskCategory');
    let taskAssignedTo = document.getElementById('taskAssignedTo');
    let taskDueDate = document.getElementById('taskDueDate');

    addTaskPrio();

    task = {
        'title': taskTitle.value,
        'description': taskDescription.value,
        'category': taskCategory.value,
        'assigned': taskAssignedTo.value,
        'dueDate': taskDueDate.value,
        'prio': currentTaskPrio,
        'status': 'todo',
    };

    const savedTask = await saveAllTasks(task);
    allTasks.push(savedTask);
    clearAddTaskForm();
    addTaskNotification();
    return false;
};


function activateUrgentButton() {
    let urgentButton = document.getElementById('urgent-button');
    let mediumButton = document.getElementById('medium-button');
    let lowButton = document.getElementById('low-button');

    urgentButton.classList.toggle('prio-button-active');
    mediumButton.classList.remove('prio-button-active');
    lowButton.classList.remove('prio-button-active');

    urgent = true;
    medium = false;
    low = false;
}


function activateMediumButton() {
    let urgentButton = document.getElementById('urgent-button');
    let mediumButton = document.getElementById('medium-button');
    let lowButton = document.getElementById('low-button');

    urgentButton.classList.remove('prio-button-active');
    mediumButton.classList.toggle('prio-button-active');
    lowButton.classList.remove('prio-button-active');

    urgent = false;
    medium = true;
    low = false;
}


function activateLowButton() {
    let urgentButton = document.getElementById('urgent-button');
    let mediumButton = document.getElementById('medium-button');
    let lowButton = document.getElementById('low-button');

    urgentButton.classList.remove('prio-button-active');
    mediumButton.classList.remove('prio-button-active');
    lowButton.classList.toggle('prio-button-active');

    urgent = false;
    medium = false;
    low = true;
}


async function deleteAllTasks() {
    const response = await fetch("http://127.0.0.1:8000/delete_all_tasks/", {
        method: 'DELETE',
    });

    if (response.status !== 204) {
        console.error('Failed to delete tasks:', await response.text());
    }
}



function addTaskPrio() {
    let urgentBtn = document.getElementById('urgent-button');
    let mediumBtn = document.getElementById('medium-button');
    let lowBtn = document.getElementById('low-button');

    let urgentBtnVal = urgentBtn.value;
    let mediumBtnVal = mediumBtn.value;
    let lowBtnVal = lowBtn.value;

    if (urgent == true) {
        currentTaskPrio = urgentBtnVal;
    } else {
        if (medium == true) {
            currentTaskPrio = mediumBtnVal;
        } else {
            if (low == true) {
                currentTaskPrio = lowBtnVal;
            }
        }
    }
}


function activeAddTaskNavLink() {
    document.getElementById('addtask-link').classList.add('active-link');
    document.getElementById('addtask-link-mobile').classList.add('active-link');
}


function clearAddTaskForm() {
    let taskTitle = document.getElementById('taskTitle');
    let taskDescription = document.getElementById('taskDescription');
    let taskCategory = document.getElementById('taskCategory');
    let taskAssignedTo = document.getElementById('taskAssignedTo');
    let taskDueDate = document.getElementById('taskDueDate');

    taskTitle.value = '';
    taskDescription.value = '';
    taskCategory.value = '';
    taskAssignedTo.value = '';
    taskDueDate.value = '';

    deactivatePrioButtons();
}


function deactivatePrioButtons() {
    let urgentButton = document.getElementById('urgent-button');
    let mediumButton = document.getElementById('medium-button');
    let lowButton = document.getElementById('low-button');

    urgentButton.classList.remove('prio-button-active');
    mediumButton.classList.remove('prio-button-active');
    lowButton.classList.remove('prio-button-active');
}


function addTaskNotification() {
    let notificationContainer = document.getElementById('at-notification-cnt');

    if (notificationContainer) {
        notificationContainer.classList.remove('d-none');
        setTimeout(function () {
            notificationContainer.classList.add('d-none')
        }, 3000)
    } else {
        window.location.href = '../html/board.html';
    }
}
