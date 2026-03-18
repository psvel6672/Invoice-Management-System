const UserService = require('../services/user.service');

module.exports.getAllUsers = async (req, res) => {

    const getAllUserSerice = await UserService.getAllUsers()
    const getStatusCode = getAllUserSerice.code
    res.status(getStatusCode).json(getAllUserSerice)

}

module.exports.getUserDetails = async (req, res) => {

    const {user_id} = req.body;

    const getUserData = await UserService.getUserDetails(user_id);
    const getStatusCode = getUserData.code
    res.status(getStatusCode).json(getUserData)

}

module.exports.updateUserDetails = async (req, res) => {

    const updateUserData = await UserService.UpdateUsersInfo(req.body);
    const getStatusCode = updateUserData.code;
    res.status(getStatusCode).json(updateUserData)

}

module.exports.removeUserData = async (req, res) => {

    const {user_id} = req.body;

    const deleteUserData = await UserService.removeUser(user_id);
    const getStatusCode = deleteUserData.code;
    res.status(getStatusCode).json(deleteUserData)

}

module.exports.addNewUserData = async (req, res) => {

    const createNewUser = await UserService.createNewUser(req.body);
    const getStatusCode = createNewUser.code;
    res.status(getStatusCode).json(createNewUser)

}

module.exports.loginToSystem = async (req, res) => {

    const loginSystem = await UserService.LoginSystem(req.body);
    const getStatusCode = loginSystem.code;

    const getToken = loginSystem.token

    res.cookie("token", getToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(getStatusCode).json(loginSystem)

}

module.exports.logoutSystem = async (req, res) => {
  try {
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,       // true if using HTTPS
      sameSite: "lax",     // optional, safer
      expires: new Date(0) // ensures cookie is removed immediately
    });

    // Redirect to login page
    res.json({
        code: 200
    })
    
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).send("Logout failed");
  }
};


