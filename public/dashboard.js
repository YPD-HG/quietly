let userId = null;
let user = null;

let id = new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", async (event) => {
        let token = localStorage.getItem('token')
        if (token !== null && window.location.pathname === '/dashboard.html') {
            user = await axios.get('http://localhost:3000/me', {
                headers: {
                    token: token
                }
            })
            userId = user.data.id;
            document.getElementById('username').innerHTML = `Welcome, ${user.data.username}`;
            resolve(userId);
        } else if (token === null) {
            location.replace('/');
        }
    });
});

export async function getUserId() {
    return await id;
}

window.addEventListener("storage", async (event) => {
    window.location.reload()
});

document.getElementById("signOut").addEventListener("click", (event) => {
    localStorage.removeItem("token");
    window.location.reload()
})