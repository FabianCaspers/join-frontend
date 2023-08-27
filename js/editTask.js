let currentEditedTaskId = null;

async function loadTasksFromBackend() {
    const response = await fetch('https://fabiancaspersdjango.pythonanywhere.com/task/');
    if (response.ok) {
        allTasks = await response.json();
    } else {
        console.error("Fehler beim Laden der Tasks:", await response.text());
    }
}


function editTask(taskId) {
    currentEditedTaskId = taskId;
    let editTitle = document.getElementById('task-title-edit');
    let editDescription = document.getElementById('task-description-edit');
    let editDueDate = document.getElementById('task-duedate-edit');
    let editAssignedTo = document.getElementById('task-assigned-edit');

    addEditTaskPrio();

    let editTask = {
        'title': editTitle.value,
        'description': editDescription.value,
        'dueDate': editDueDate.value,
        'assigned': editAssignedTo.value
    };

    updateCurrentTask(taskId, editTask);
}



async function updateCurrentTask(taskId, editTask) {
    console.log(taskId, "updateCurrentTask aufgerufen");
    console.log("taskId:", taskId);
    console.log("allTasks:", allTasks);

    let taskToUpdate = allTasks.find(task => task.id === taskId);

    if (!taskToUpdate) {
        console.error(`Task mit ID ${taskId} nicht gefunden.`);
        return;
    }

    taskToUpdate.title = editTask['title'];
    taskToUpdate.description = editTask['description'];
    taskToUpdate.dueDate = editTask['dueDate'];
    taskToUpdate.assigned = editTask['assigned'];
    taskToUpdate.prio = currentTaskPrio;

    const response = await fetch(`https://fabiancaspersdjango.pythonanywhere.com/task/${taskId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(taskToUpdate)
    });

    console.log(taskId);

    if (response.ok) {
        console.log("Task erfolgreich aktualisiert!");
    } else {
        console.error("Fehler beim Aktualisieren des Tasks:", await response.text());
    }

    renderTasks();
    closeDetailTaskDialog();
}


function activateUrgentEditButton() {
    let urgentButton = document.getElementById('urgent-button-edit');
    let mediumButton = document.getElementById('medium-button-edit');
    let lowButton = document.getElementById('low-button-edit');

    urgentButton.classList.toggle('prio-button-active');
    mediumButton.classList.remove('prio-button-active');
    lowButton.classList.remove('prio-button-active');

    urgent = true;
    medium = false;
    low = false;
}


function activateMediumEditButton() {
    let urgentButton = document.getElementById('urgent-button-edit');
    let mediumButton = document.getElementById('medium-button-edit');
    let lowButton = document.getElementById('low-button-edit');

    urgentButton.classList.remove('prio-button-active');
    mediumButton.classList.toggle('prio-button-active');
    lowButton.classList.remove('prio-button-active');

    urgent = false;
    medium = true;
    low = false;
}


function activateLowEditButton() {
    let urgentButton = document.getElementById('urgent-button-edit');
    let mediumButton = document.getElementById('medium-button-edit');
    let lowButton = document.getElementById('low-button-edit');

    urgentButton.classList.remove('prio-button-active');
    mediumButton.classList.remove('prio-button-active');
    lowButton.classList.toggle('prio-button-active');

    urgent = false;
    medium = false;
    low = true;
}


function addEditTaskPrio() {
    let urgentBtn = document.getElementById('urgent-button-edit');
    let mediumBtn = document.getElementById('medium-button-edit');
    let lowBtn = document.getElementById('low-button-edit');

    let urgentBtnVal = urgentBtn.value;
    let mediumBtnVal = mediumBtn.value;
    let lowBtnVal = lowBtn.value;

    if (urgent == true) {
        currentTaskPrio = urgentBtnVal;
    } else {
        if (medium == true) {
            currentTaskPrio = mediumBtnVal;
        } else {
            if (low = true) {
                currentTaskPrio = lowBtnVal;
            }
        }
    }
}


function clearEditTaskForm() {
    let taskTitle = document.getElementById('task-title-edit');
    let taskDescription = document.getElementById('task-description-edit');
    let taskAssignedTo = document.getElementById('task-assigned-edit');
    let taskDueDate = document.getElementById('task-duedate-edit');

    taskTitle.value = '';
    taskDescription.value = '';
    taskAssignedTo.value = '';
    taskDueDate.value = '';

    deactivatePrioButtons();
}


function checkActivatedPrioButton(id) {
    if (allTasks[id]['prio'] == 'urgent') {
        activateUrgentEditButton();
    } else if (allTasks[id]['prio'] == 'medium') {
        activateMediumEditButton();
    } else if (allTasks[id]['prio'] == 'low') {
        activateLowEditButton();
    }
}


function renderEditTaskDialog(id) {
    let taskDialog = document.getElementById('detail-task-dialog');

    taskDialog.innerHTML = /*html*/ `
        <div class="edit-task-cnt">
            <form onsubmit="editTask(${allTasks[id].id}); return false;">
            <img onclick="closeDetailTaskDialog()" class="close-icon-dialog" src="../assets/icons/close_icon.png" alt="">
                <div class="form-container-edit-task">

                    <!-- === Title === -->
                    <label for="title">Title</label>
                    <input required id="task-title-edit" class="add-task-inputfield" type="text" name="title"
                        value="${allTasks[id]['title']}"/>

                    <!-- === Description === -->
                    <label for="description">Description</label>
                    <textarea required name="description" id="task-description-edit" cols="30" rows="10">${allTasks[id]['description']}</textarea>

                    <!-- === Due Date === -->
                    <label for="dueDate">Due date</label>
                    <input value="${allTasks[id]['dueDate']}" required class="add-task-inputfield" type="date" id="task-duedate-edit" name="dueDate">

                    <!-- === Assigned To === -->
                    <label for="assigned">Assigned to</label>
                    <select required class="add-task-inputfield" name="assigned" id="task-assigned-edit">
                        <option value="" disabled selected hidden>${allTasks[id]['assigned']}</option>
                        <option value="Fabian Caspers">Fabian Caspers</option>
                    </select>

                    <!-- === Prio Buttons === -->
                    <div class="prio-button-container">
                        <h3 class="prio-button-headline">Prio</h3>
                        <div class="button-container">
                            <button type="button" onclick="activateUrgentEditButton()" id="urgent-button-edit" class="prio-button" value="urgent"><img
                                class="prio-button-icon" src="../assets/icons/urgent.png" alt="">Urgent</button>
                            <button type="button" onclick="activateMediumEditButton()" id="medium-button-edit" class="prio-button" value="medium"><img
                                class="prio-button-icon" src="../assets/icons/medium.png" alt="">Medium</button>
                            <button type="button" onclick="activateLowEditButton()" id="low-button-edit" class="prio-button" value="low"><img
                                class="prio-button-icon" src="../assets/icons/low.png" alt=""> Low</button>
                        </div>
                    </div>

                    <!-- === Submit Buttons === -->
                    <div class="submit-container-edit-task">
                        <button onclick="clearEditTaskForm()" type="button" class="submit-button-edit">Clear <img class="submit-button-icon" src="../assets/icons/cancel.png"
                            alt=""></button>
                        <button type="submit" class="submit-button-edit create-task-button-dialog">Edit Task <img
                            class="submit-button-icon" src="../assets/icons/done.png" alt=""></button>
                    </div>
                </div>
            </form>
        </div>

    `;

    checkActivatedPrioButton(id);
}