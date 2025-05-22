import { getUserId } from './dashboard.js';

let inputButton = document.getElementById("inputButton");
let userId;
// Access userId later after DOM loaded or after some delay
document.addEventListener('DOMContentLoaded', async () => {
    setTimeout(async () => {
        userId = getUserId();
        console.log("User Id in Todo :", userId);

        let list = await axios.get('http://localhost:3000/todos', {
            headers: {
                userId
            }
        })
        list = list.data.todos;
        console.log("List : ", list);
        document.getElementById('taskList').innerHTML = ``;
        for (let i = 0; i < list.length; i++) {
            const todo = list[i].title;

            let element = document.createElement('div');

            let text = document.createElement('span');

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            let updateBtn = document.createElement('button')

            let deleteBtn = document.createElement('button')

            updateBtn.innerText = 'Update';
            deleteBtn.innerText = 'Delete';
            text.innerText = ` ${todo}`;

            // When Delete button is triggered
            deleteBtn.addEventListener('click', async (e) => {
                console.log("*******");

                console.log("Delete Button", element);

                element.remove();
            })

            element.appendChild(checkbox);

            element.appendChild(updateBtn);

            element.appendChild(deleteBtn);

            element.appendChild(text);

            document.getElementById('taskList').appendChild(element);

        }
    }, 200)
});

inputButton.addEventListener("click", async (e) => {
    let inputText = document.getElementById("taskInput").value;

    if (inputText.trim()) {
        let resp = await axios.post('http://localhost:3000/todo', {
            inputText,
            userId
        })
        console.log("Todos List : ", resp.data.todos);
        let list = resp.data.todos;
        document.getElementById("taskInput").value = ``;
        document.getElementById('taskList').innerHTML = ``;
        for (let i = 0; i < list.length; i++) {
            const todo = list[i].title;

            let element = document.createElement('div');

            let text = document.createElement('span');

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            let updateBtn = document.createElement('button')

            let deleteBtn = document.createElement('button')

            updateBtn.innerText = 'Update';
            deleteBtn.innerText = 'Delete';
            text.innerText = ` ${todo}`;

            element.appendChild(checkbox);

            element.appendChild(updateBtn);

            element.appendChild(deleteBtn);

            element.appendChild(text);

            // When Delete button is triggered
            deleteBtn.addEventListener('click', async (e) => {

                let todoDeleted = await axios.post('http://localhost://')

                element.remove();
            })

            document.getElementById('taskList').appendChild(element);
        }
    }
})
