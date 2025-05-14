let register = document.getElementById('regBtn')
let signin = document.getElementById('signBtn')
let token = null;
register.addEventListener('click', async function (e) {
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    // const computedStyle = getComputedStyle(signin);
    // console.log(computedStyle.color);  // Outputs: "rgb(0, 0, 255)" or equivalent
    // console.log("*** register-2 ***");
    register.style.color = `rgb(103, 106, 111)`
    setTimeout(() => { register.style.color = `rgb(0, 0, 0)` }, 500)

    if (username !== '' && password !== '') {
        token = await axios.post('http://localhost:3000/signup', {
            username,
            password
        })
        console.log("Token :", token.data.message);
        console.log("Token data :", token.data);

        if (token.data.message === undefined && typeof token.data == "string") {
            setTimeout(() => {
                document.getElementById('verdict').innerText = `Successfully register, ${username}`;
                localStorage.setItem("token", token.data.token)
                localStorage.setItem("username", token.data.user.username)
                document.getElementById('username').value = ``
                document.getElementById('password').value = ``
            }, 10)

            setTimeout(() => {
                // window.location.reload(),
                window.location.href = "http://127.0.0.1:5500/dashboard.html";
            }, 1000)
        } else if (token.data.message === 'Already have account.') {
            document.getElementById('verdict').innerHTML = `Username exists, try another username or Sign in`;
            document.getElementById('username').value = ``
            document.getElementById('password').value = ``
        } else if (token.data.message === 'Incorrect Format') {
            document.getElementById('verdict').innerHTML = `
            Password should:
    <li>Be at least 8 characters long</li>
    <li>Contain an uppercase letter</li>
    <li>Contain a lowercase letter</li>
    <li>Include a number</li>
  `;

            document.getElementById('username').value = ``
            document.getElementById('password').value = ``
        }
    }
})

signin.addEventListener('click', async function (e) {
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    signin.style.color = `rgb(103, 106, 111)`
    setTimeout(() => { signin.style.color = `rgb(0, 0, 0)` }, 500)

    if (username !== '' && password !== '') {
        token = await axios.post('http://localhost:3000/signin', {
            username,
            password
        })
        if (token.data.message === undefined) {
            setTimeout(() => {
                document.getElementById('verdict').innerText = `Welcome Back, ${username} `;
                localStorage.setItem("token", token.data)
                document.getElementById('username').value = ``
                document.getElementById('password').value = ``
            }, 10)

            setTimeout(() => {
                // window.location.reload();
                window.location.href = "http://127.0.0.1:5500/dashboard.html";
            }, 1000)
        } else if (token.data.message == 'You are a new User, Signup.') {
            document.getElementById('verdict').innerText = `You are a new User, Register yourself.`;
            document.getElementById('username').value = ``
            document.getElementById('password').value = ``
        } else if (token.data.message == 'Wrong password.') {
            document.getElementById('verdict').innerText = 'Wrong password.';
            document.getElementById('username').value = ``
            document.getElementById('password').value = ``
        }
    }
})

function loadDashboard() {
    window.location.href = "http://127.0.0.1:5500/dashboard.html";
}

window.addEventListener("storage", async (event) => {
    let token = localStorage.getItem('token')
    console.log("Token :", token);
    if (token !== null && window.location.href == `http://127.0.0.1:5500/`) {
        console.log("Token is not null")
        await axios.get('http://localhost:3000/me', {
            headers: {
                token: token
            }
        })
        location.replace(`http://127.0.0.1:5500/dashboard.html`);
        // loadDashboard()
        // console.log("i m on Dashboard");
    }
});


function signinBtn() {
    document.querySelector('#regBtn').style.transform = `translateX(-100%)`
    document.querySelector('#gotoSignin').style.transform = `translateX(-100%)`
    document.querySelector('#signBtn').style.transform = `translateX(-100%)`
    document.querySelector('#gotoRegister').style.transform = `translateX(-100%)`
}

function registerBtn() {
    document.querySelector('#signBtn').style.transform = `translateX(0)`
    document.querySelector('#gotoSignin').style.transform = `translateX(0)`
    document.querySelector('#regBtn').style.transform = `translateX(0)`
    document.querySelector('#gotoRegister').style.transform = `translateX(0)`
}
