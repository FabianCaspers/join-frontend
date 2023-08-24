async function initBoard() {
    await includeHTML();
    setURL("https://fabiancaspersdjango.pythonanywhere.com/");
    await loadAllTasks();
    renderTasks(); 
    activeBoardNavLink();
}


let currentDraggedElement;



function renderTasks() {
    renderToDoTasks();
    renderInProgressTasks();
    renderAwaitingFeedbackTasks();
    renderDoneTasks()
}


function renderToDoTasks() {
    let toDoCategory = allTasks.filter(t => t['status'] == 'todo');
    let toDoContainer = document.getElementById('todo-container');
    toDoContainer.innerHTML = '';

    for (let i = 0; i < toDoCategory.length; i++) {
        let task = toDoCategory[i];
        toDoContainer.innerHTML += generateTaskHtml(i, task, 'todo');
    }
}


function renderInProgressTasks() {
    let inProgressCategory = allTasks.filter(t => t['status'] == 'in-progress');
    let inProgressContainer = document.getElementById('in-progress-container');
    inProgressContainer.innerHTML = '';

    for (let i = 0; i < inProgressCategory.length; i++) {
        let task = inProgressCategory[i];
        inProgressContainer.innerHTML += generateTaskHtml(i, task, 'in-progress');
    }
}


function renderAwaitingFeedbackTasks() {
    let awaitingFeedbackCategory = allTasks.filter(t => t['status'] == 'awaiting-feedback');
    let awaitingFeedbackContainer = document.getElementById('awaiting-feedback-container');
    awaitingFeedbackContainer.innerHTML = '';

    for (let i = 0; i < awaitingFeedbackCategory.length; i++) {
        let task = awaitingFeedbackCategory[i];
        awaitingFeedbackContainer.innerHTML += generateTaskHtml(i, task, 'awaiting-feedback');
    }
}


function renderDoneTasks() {
    let doneCategory = allTasks.filter(t => t['status'] == 'done');
    let doneContainer = document.getElementById('done-container');
    doneContainer.innerHTML = '';

    for (let i = 0; i < doneCategory.length; i++) {
        let task = doneCategory[i];
        doneContainer.innerHTML += generateTaskHtml(i, task, 'done');
    }
}


function generateTaskHtml(i, task) {
    return /*html*/ `
        <div onclick="openDetailTaskDialog(${task.id})" draggable="true" ondragstart="startDragging(${task['id']})" class="task">
            <div class="category-placeholder-cnt">
                <div id="category-container${i}" class="category-container ${task['category']}">
                    <p title="Category">${task['category']}</p>
                </div>
            </div>
            <div class="title-container">
                <p title="Title">${task['title']}</p>
            </div>
            <div class="description-container">
                <p title="Description">${task['description']}</p>
            </div>
            <div class="card-footer">
                <div id="assigned-to-container${i}" class="assigned-to-container ${task['assigned']}" title="Assigned to: ${task['assigned']}">
                    <p>${task['assigned'].split(" ").map(word => word[0]).join("")}</p>
                </div>
                <div class="prio-container" id="prio-container${i}">
                    <img src="../assets/icons/${task['prio']}.png" alt="" title="Priority: ${task['prio']}">
                </div>
            </div>
        </div>
    `;
}


function startDragging(task) {
    currentDraggedElement = task;
}


async function moveTo(containerType) {
    let task = allTasks.find(t => t.id === currentDraggedElement);
    task['status'] = containerType;
    
    try {
        const response = await fetch(`https://fabiancaspersdjango.pythonanywhere.com/add_task/${task.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({status: containerType})
        });
        console.log(task.id);

        if (response.status !== 200) {
            throw new Error('Failed to update task in backend');
        }

        renderTasks();

    } catch (error) {
        console.error(error);
        alert('Failed to update task status. Please try again.');
    }
}



function allowDrop(ev) {
    ev.preventDefault();
}


async function deleteTaskFromBackend(taskId) {
    const response = await fetch(`https://fabiancaspersdjango.pythonanywhere.com/add_task/${taskId}/`, {
        method: 'DELETE',
    });

    if (response.status !== 204) {
        throw new Error('Failed to delete task from backend');
    }
}

async function deleteTask(taskId) {
    try {
        await deleteTaskFromBackend(taskId);
        const taskIndex = allTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            allTasks.splice(taskIndex, 1);
        }
        closeDetailTaskDialog();
        renderTasks();
    } catch (error) {
        console.error(error);
        alert('Failed to delete task. Please try again.');
    }
}


function openAddTaskDialog() {
    document.getElementById('add-task-dialog').classList.remove('d-none');
};


function closeAddTaskDialog() {
    document.getElementById('add-task-dialog').classList.add('d-none');
};


function activeBoardNavLink() {
    document.getElementById('board-link').classList.add('active-link');
    document.getElementById('board-link-mobile').classList.add('active-link');
};


function searchTask() {
    let search = document.getElementById('search').value
    search = search.toLowerCase();

    searchToDoTask(search);
    searchInProgressTask(search);
    searchAwaitingFeedbackTask(search);
    searchDoneTask(search)
}


function searchToDoTask(search) {
    let toDoCategory = allTasks.filter(t => t['status'] == 'todo');
    let toDoContainer = document.getElementById('todo-container');
    toDoContainer.innerHTML = '';

    for (let i = 0; i < toDoCategory.length; i++) {
        let task = toDoCategory[i];
        if(task.title.toLowerCase().includes(search)) {
            toDoContainer.innerHTML += generateTaskHtml(i, task, 'todo');
        }
    }
}


function searchInProgressTask(search) {
    let inProgressCategory = allTasks.filter(t => t['status'] == 'in-progress');
    let inProgressContainer = document.getElementById('in-progress-container');
    inProgressContainer.innerHTML = '';

    for (let i = 0; i < inProgressCategory.length; i++) {
        let task = inProgressCategory[i];
        if(task.title.toLowerCase().includes(search)) {
            inProgressContainer.innerHTML += generateTaskHtml(i, task, 'in-progress');
        }
    }
}


function searchAwaitingFeedbackTask(search) {
    let awaitingFeedbackCategory = allTasks.filter(t => t['status'] == 'awaiting-feedback');
    let awaitingFeedbackContainer = document.getElementById('awaiting-feedback-container');
    awaitingFeedbackContainer.innerHTML = '';

    for (let i = 0; i < awaitingFeedbackCategory.length; i++) {
        let task = awaitingFeedbackCategory[i];
        if(task.title.toLowerCase().includes(search)) {
            awaitingFeedbackContainer.innerHTML += generateTaskHtml(i, task, 'awaiting-feedback');
        }
    }
}


function searchDoneTask(search) {
    let doneCategory = allTasks.filter(t => t['status'] == 'done');
    let doneContainer = document.getElementById('done-container');
    doneContainer.innerHTML = '';

    for (let i = 0; i < doneCategory.length; i++) {
        let task = doneCategory[i];
        if(task.title.toLowerCase().includes(search)) {
            doneContainer.innerHTML += generateTaskHtml(i, task, 'done');
        }
    }
}


function openDetailTaskDialog(foo) {
    let taskDialogBg = document.getElementById('detail-task-dialog-bg')
    taskDialogBg.classList.remove('d-none')

    let id;
    allTasks.forEach((t, index) => {
        if(t.id === foo) id = index;
    });

    document.getElementById('detail-task-dialog').innerHTML = renderDetailTasksDialog(id);
}


function renderDetailTasksDialog(id) {
    return /*html*/ `
        <div class="detail-task-cnt">
            <img onclick="closeDetailTaskDialog()" class="close-icon-dialog" src="../assets/icons/close_icon.png" alt="">
            <div class="category-container-dialog ${allTasks[id]['category']}">
                <p title="Category">${allTasks[id]['category']}</p>
            </div>
            <div class="title-container-dialog">
                <p title="Title">${allTasks[id]['title']}</p>
            </div>
            <div class="description-container-dialog">
                <p title="Description">${allTasks[id]['description']}</p>
            </div>
            <div class="due-date-container">
                <p class="font-size-small bold mr1">Due Date:</p>
                <p class="font-size-small">${allTasks[id]['dueDate']}</p>
            </div>
            <div class="priority-container">
                <p class="font-size-small bold mr1">Priority:</p>
                <p class="font-size-small prio-${allTasks[id]['prio']}">${allTasks[id]['prio']}</p>
            </div>
            <div class="assigned-to-container-dialog">
                <p class="font-size-small bold">Assigned To:</p>
                <div class="names-cnt">
                    <div class="assigned-to-circle ${allTasks[id]['assigned']}" title="Assigned to: ${allTasks[id]['assigned']}">
                        <p>${allTasks[id]['assigned'].split(" ").map(word => word[0]).join("")}</p>
                    </div>
                    <div>
                        <p class="font-size-small">${allTasks[id]['assigned']}</p>
                    </div>
                </div>
            </div>
            <div class="edit-cnt">
                <div class="delete">
                    <img class="trash-icon-dialog" onclick="deleteTask(${allTasks[id].id})" src="../assets/icons/trash.png" alt="" title="Delete complete Task">
                </div>
                <div onclick="renderEditTaskDialog(${id})" class="edit">
                    <img class="pencil-icon-dialog" src="../assets/icons/pencil.png" alt="" title="Edit Task">
                </div>
            </div>
        </div>

    `
}


function closeDetailTaskDialog() {
    document.getElementById('detail-task-dialog-bg').classList.add('d-none');
}