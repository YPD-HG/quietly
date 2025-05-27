import { getUserId } from './dashboard.js';

let inputButton = document.getElementById("inputButton");
let userId;
// Access userId later after DOM loaded or after some delay

document.addEventListener('DOMContentLoaded', async () => {
    userId = await getUserId();
    let list = await axios.get('http://localhost:3000/todos', {
        headers: {
            userId
        }
    })

    list = list.data.todos;
    document.getElementById('taskList').innerHTML = ``;

    for (let i = 0; i < list.length; i++) {
        const title = list[i].title;

        let element = document.createElement('div');

        let text = document.createElement('span');

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        let updateBtn = document.createElement('button')

        let deleteBtn = document.createElement('button')

        updateBtn.innerText = 'Update';
        deleteBtn.innerText = 'Delete';
        text.innerText = ` ${title}`;

        // When Delete button is triggered
        deleteBtn.addEventListener('click', async (e) => {
            element.remove();

            let todoDelete = await axios.post('http://localhost:3000/delete-todo', {
                title
            })

            let verdict = todoDelete.data.verdict;

            if (verdict) {
                console.log("Todo deleted");
            } else {
                console.log("Some issue in deleting todo");
            }

        })

        element.appendChild(checkbox);

        element.appendChild(updateBtn);

        element.appendChild(deleteBtn);

        element.appendChild(text);

        document.getElementById('taskList').appendChild(element);

    }
});

inputButton.addEventListener("click", async (e) => {

    let inputText = document.getElementById("taskInput").value;

    if (inputText.trim()) {
        let resp = await axios.post('http://localhost:3000/todo', {
            inputText,
            userId
        })
        let list = resp.data.todos;
        document.getElementById("taskInput").value = ``;
        document.getElementById('taskList').innerHTML = ``;
        for (let i = 0; i < list.length; i++) {
            const title = list[i].title;

            let element = document.createElement('div');

            let text = document.createElement('span');

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            let updateBtn = document.createElement('button')

            let deleteBtn = document.createElement('button')

            updateBtn.innerText = 'Update';
            deleteBtn.innerText = 'Delete';
            text.innerText = ` ${title}`;

            element.appendChild(checkbox);

            element.appendChild(updateBtn);

            element.appendChild(deleteBtn);

            element.appendChild(text);

            // When Delete button is triggered
            deleteBtn.addEventListener('click', async (e) => {
                element.remove();

                let todoDelete = await axios.post('http://localhost:3000/delete-todo', {
                    title
                })

                let verdict = todoDelete.data.verdict;

                if (verdict) {
                    console.log("Todo deleted");
                } else {
                    console.log("Some issue in deleting todo");
                }
            })
            document.getElementById('taskList').appendChild(element);
        }
    }
})
