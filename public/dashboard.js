let userId = null;
let user = null;

window.addEventListener("DOMContentLoaded", async (event) => {
    console.log("DOM loaded.");
    let token = localStorage.getItem('token')
    // console.log("Token :", token);
    // console.log("window.location.href :", window.location.href)
    if (token !== null && window.location.pathname === `/dashboard.html`) {
        user = await axios.get('http://localhost:3000/me', {
            headers: {
                token: token
            }
        })
        console.log("UserId before overwriting : ", user);
        userId = user.data.id;
        console.log("User Id in Dash :", userId);
        document.getElementById('username').innerHTML = `Welcome, ${user.data.username}`;
        return userId;

        // loadDashboard()
        // console.log("i m on Dashboard");
    } else if (token === null) {
        console.log("Token is null");
        location.replace(`/`);
    }
});

window.addEventListener("storage", async (event) => {
    console.log("Local storage triggered.");
    window.location.reload()
});

document.getElementById("signOut").addEventListener("click", (event) => {
    console.log("Sign Out Clicked.")
    localStorage.removeItem("token");
    window.location.reload()
})

export function getUserId() {
    return userId;
}