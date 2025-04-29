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
