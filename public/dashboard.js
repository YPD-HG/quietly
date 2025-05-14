window.addEventListener('storage', async () => {
    let token = localStorage.getItem('token')
    console.log("Token :", token);
    if (token === null) {
        location.replace(`http://127.0.0.1:5500/`);
    } else {
        let username = localStorage.getItem('username')
        console.log(username);
        // document.getElementsByName('h1')[0].innerHTML = `Welcome ${username}`
    }
})

