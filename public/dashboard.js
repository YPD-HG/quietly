window.addEventListener('storage', async () => {
    let token = localStorage.getItem('token')
    console.log("Token :", token);
    if (token === null) {
        location.replace(`http://127.0.0.1:5500/`);
    }
})