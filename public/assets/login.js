const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);

  this.innerHTML =
    type === "password"
      ? '<i class="fa fa-eye"></i>'
      : '<i class="fa fa-eye-slash"></i>';
});

const userLoginForm = document.getElementById("userLoginForm");
const usrname = document.getElementById("username");
const usrpassword = document.getElementById("password");


if(userLoginForm){
  userLoginForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const getUserLogin = await fetch('/users/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({username: usrname.value, password: usrpassword.value})
    })

    const getJSONResp = await getUserLogin.json();

    if(getJSONResp.code === 200){
      window.location = "/"
    }else{
      alert(getJSONResp.error)
    }

  });
}