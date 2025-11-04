class Todo{
    selectors = {
        root: '[data-js-todo]',
        addTaskForm: '[data-js-add-task-form]',
        addTaskField: '[data-js-add-task-field]',
        addTaskButton: '[data-js-add-task-button]',
        searchTaskForm: '[data-js-search-task-form]',
        searchTaskField: '[data-js-search-task-field]',
        statusBar: '[data-js-status-bar]',
        tasksCounter: '[data-js-total-tasks]',
        deleteAllButton: '[data-js-delete-all-tasks]',
        tasksList: '[data-js-tasks-list]',
        emptyMsg: '[data-js-empty-msg]',
    }

    storageKey = 'todoTasks'

    constructor(){
        this.rootElement = document.querySelector(this.selectors.root)
        this.addTaskFormElement = this.rootElement.querySelector(this.selectors.addTaskForm)
        this.addTaskFieldElement = this.rootElement.querySelector(this.selectors.addTaskField)
        this.addTaskButtonElement = this.rootElement.querySelector(this.selectors.addTaskButton)
        this.searchTaskFormElement = this.rootElement.querySelector(this.selectors.searchTaskForm)
        this.searchTaskFieldElement = this.rootElement.querySelector(this.selectors.searchTaskField)
        this.statusBarElement = this.rootElement.querySelector(this.selectors.statusBar)
        this.tasksCounterElement = this.rootElement.querySelector(this.selectors.tasksCounter)
        this.deleteAllButtonElement = this.rootElement.querySelector(this.selectors.deleteAllButton)
        this.tasksListElement = this.rootElement.querySelector(this.selectors.tasksList)
        this.emptyMsgElement = this.rootElement.querySelector(this.selectors.emptyMsg)
        this.tasksArray = JSON.parse(localStorage.getItem(this.storageKey)) ?? localStorage.setItem(this.storageKey, JSON.stringify([]))
        this.binder()
        this.render()
    }

    addTask(newTaskName){
        if(newTaskName.length > 0){
            const newTask = {
                id: crypto?.randomUUID() ?? Date.now().toString(),
                name: newTaskName,
                isDone: false,
            }

            this.tasksArray.push(newTask)
            localStorage.setItem(this.storageKey, JSON.stringify(this.tasksArray))
            this.addTaskFieldElement.value = ''
            this.render()
        }
    }

    searchTask(queryString){
        if(queryString.length > 0){
            var filteredTasks = this.tasksArray.filter((task) => task.name.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
            if(filteredTasks.length > 0){
                this.tasksListElement.innerHTML = filteredTasks.map(task => 
                    `<li class="todo-item" id="${task.id}" data-js-task>
                        <input type="checkbox" class="todo-item__checkbox" data-js-task-checkbox ${task.isDone ? 'checked' : ''}/>
                        <h4 class="todo-item__name" data-js-task-name>
                            ${task.name}
                        </h4>
                        <button type="button" class="todo-item__delete-task button" data-js-task-delete>X</button>
                    </li>`
                ).join('')
            } else{
                this.emptyMsgElement.classList.toggle('visually-hidden', false)
                this.tasksListElement.classList.toggle('visually-hidden', true)
                this.statusBarElement.classList.toggle('visually-hidden', true)
            }
        } else{
            this.render()
        }
    }

    deleteAllTasks(){
        this.tasksArray = []
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasksArray))
        this.render()
    }

    markTaskAsDone(targetElem){
        const taskId = targetElem.parentNode.id
        this.tasksArray = this.tasksArray.map(task => {
            if(task.id === taskId){
                return {...task, isDone: !task.isDone}
            } else{
                return {...task}
            }
        })
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasksArray))
    }

    deleteThisTask(targetElem){
        const taskId = targetElem.parentNode.id
        this.tasksArray = this.tasksArray.filter(task => task.id !== taskId)
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasksArray))
        this.render()
    }

    binder(){
        this.addTaskButtonElement.addEventListener('click', () => this.addTask(this.addTaskFieldElement.value))
        this.addTaskFormElement.addEventListener('submit', (event) => {
            event.preventDefault()
            this.addTask(this.addTaskFieldElement.value)
        })
        this.searchTaskFieldElement.addEventListener('input', ({target}) => this.searchTask(target.value))
        this.deleteAllButtonElement.addEventListener('click', () => this.deleteAllTasks())
        this.tasksListElement.addEventListener('click', ({target}) => {
            if(target.hasAttribute('data-js-task-checkbox'))
                this.markTaskAsDone(target)
            if(target.hasAttribute('data-js-task-delete'))
                this.deleteThisTask(target)
        })
    }

    render(){
        let doHide = this.tasksArray.length > 0
        this.emptyMsgElement.classList.toggle('visually-hidden', doHide)
        this.statusBarElement.classList.toggle('visually-hidden', !doHide)
        this.tasksListElement.classList.toggle('visually-hidden', !doHide)
        this.tasksListElement.innerHTML = doHide ? this.tasksArray.map((task) => 
            `<li class="todo-item" id="${task.id}" data-js-task>
                <input type="checkbox" class="todo-item__checkbox" data-js-task-checkbox ${task.isDone ? 'checked' : ''}/>
                <h4 class="todo-item__name" data-js-task-name>
                    ${task.name}
                </h4>
                <button type="button" class="todo-item__delete-task button" data-js-task-delete>X</button>
            </li>`
        ).join('') : ''
        this.tasksCounterElement.innerHTML = this.tasksArray.length
    }
}

const mainTodo = new Todo()