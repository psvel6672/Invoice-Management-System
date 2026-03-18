const dbConn = require('../config/db.config');
const ORM = require('../config/orm.config');
const bcrypt = require('bcrypt');
const jwtHelper = require('../utils/jwt.utils');

const { SuccessResp, ErrorResp } = require('../utils/common.utils');

module.exports.getAllUsers = async () => {

    try {

        const getAllUsersQry = await ORM.executeQry(`SELECT id, name, username, email, phone FROM users WHERE deleted = '0'`, []);

        if(getAllUsersQry.length > 0){
            const SuccessResponse = SuccessResp();
            SuccessResponse.data = getAllUsersQry
            return SuccessResponse;

        }else{
            throw new Error("No data Found")
        }
        
    } catch (err) {
        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;
    }

}

module.exports.getUserDetails = async (id) => {

    try{

        if(!id){
            throw new Error("Id is missing.")
        }

        const getUserDetailsQry = await ORM.executeQry(`SELECT id, name, username, email, phone FROM users WHERE deleted = '0' AND id = ?`, [id]);

        if(getUserDetailsQry.length > 0){
            
            const SuccessResponse = SuccessResp();
            SuccessResponse.data = getUserDetailsQry
            return SuccessResponse;

        }else{
            throw new Error("No data found.")
        }

    }catch(err){
        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;
    }

}

module.exports.UpdateUsersInfo = async (data) => {

    try{

        const { id } = data;

        if(!id){
            throw new Error("Unable to update, Id missing.")
        }

        const allowedFields = [
            "name", "username", "email", "phone"
        ]

        let chkRequested = allowedFields.filter(field => data[field])

        if(chkRequested.length === 0){
            throw new Error("No data requested to updated, Please check.")
        }
        
        let getRequested = chkRequested.map(field => data[field])

        let sqlFormat = chkRequested.map(field => `${field} = ?`)

        let sqlQry = `UPDATE users SET ${String(sqlFormat.join(", "))} WHERE deleted = '0' AND id = ?`;

        // Check Username exists

        if(data.username){

            const [checkUserName] = await ORM.executeQry(`SELECT count(*) as check_user FROM users WHERE username = ? AND id != ?`, [data.username, id]);

            if(checkUserName.length > 0){
                if(checkUserName[0].check_user > 0){
                    throw new Error("User name already exists.")
                }
            }

        }

        const updateUserDetailsQry = await ORM.updateQry(sqlQry, [...getRequested, id]);

        if(updateUserDetailsQry && updateUserDetailsQry.affectedRows > 0){
            
            const SuccessResponse = SuccessResp();
            SuccessResponse.message = "User info updated successfully."
            SuccessResponse.user_id = id
            return SuccessResponse;

        }else{
            throw new Error("Unable to update, Please check your data.")
        }

    }catch(err){
        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;
    }
}

module.exports.removeUser = async (id) => {

    let conn;

    try{

        // Check User exists

        const checkUserExist = await this.getUserDetails(id);

        if(checkUserExist.code != 200){
            return checkUserExist;
        }

        if(checkUserExist?.data){
            delete checkUserExist.data;
        }

        conn = await dbConn.getConnection();
        await conn.beginTransaction();

        const deleteUserQry = await conn.execute(`UPDATE users SET deleted = '1' WHERE deleted = '0' AND id = ?`, [id]);
        await conn.commit();

        if(deleteUserQry && deleteUserQry[0].affectedRows > 0){

            const SuccessResponse = SuccessResp();
            SuccessResponse.message = "User deleted successfully."
            SuccessResponse.user_id = id
            return SuccessResponse;

        }else{
            throw new Error("Unable to delete, Please check your data.")
        }

    }catch(err){

        if(conn){
            await conn.rollback();
        }

        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;
        
    }finally{
        if(conn){
            conn.release();
        }
    }

}

module.exports.createNewUser = async (data) => {

    let conn;

    try{

        const allowedFields = [
            "name","username", "email", "phone", "password"
        ];

        const checkRequested = data.filter((rec) => {
            const getFilter = allowedFields.filter(field => rec[field]);

            if(getFilter.length !== allowedFields.length){
                throw new Error("Required fields missing.")
            }
            return getFilter;
        });
        
        conn = await dbConn.getConnection();
        await conn.beginTransaction();

        const getInpResp = [];
        
        for(const getRecord of checkRequested){

            const { name, username, email, phone, password } = getRecord;

            const [checkUserName] = await conn.execute(`SELECT COUNT(*) AS check_user FROM users WHERE deleted = '0' AND username = ?`, [username]);

            if(checkUserName.length > 0){
                if(checkUserName[0].check_user > 0){
                    throw new Error("User name already exists.")
                }
            }

            const hashPwd = await bcrypt.hash(String(password), 10);

            const [insertUserQry] = await conn.execute(`INSERT INTO users (name, username, email, phone, password) VALUES (?, ?, ?, ?, ?)`, [name, username, email, phone, hashPwd]);
            
            await conn.commit();

            if(insertUserQry.insertId > 0){
                getInpResp.push(insertUserQry.insertId)
            }

        }

        // Check Username

        // insertUserQry && insertUserQry[0].insertId

        if(getInpResp.length > 0){

            const SuccessResponse = SuccessResp();
            SuccessResponse.message = "User created successfully."
            SuccessResponse.user_id = getInpResp

            console.log(SuccessResponse)

            return SuccessResponse;

        }else{
            throw new Error("Unable to create user, Please check your data.")
        }

    }catch(err){

        if(conn){
            await conn.rollback();
        }

        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;
    }finally{
        if(conn){
            conn.release();
        }
    }

}

module.exports.LoginSystem = async (data) => {

    let conn;

    try{
        
        if(!data.username || !data.password){
            throw new Error("Required details missing.")
        }

        const { username, password } = data;

        conn = await dbConn.getConnection();
        await conn.beginTransaction()

        const [getUserDetailsQry] = await conn.execute(`SELECT name, email, username, password FROM users WHERE deleted = '0' AND username = ?`, [username]);

        if(getUserDetailsQry.length > 0){

            const checkPwd = await bcrypt.compare(String(password), getUserDetailsQry[0].password);

            if(!checkPwd){
                throw new Error("Unauthorized access.")
            }

            getUserDetailsQry.map(field => delete field.password)
            const getPayload = {
                email: getUserDetailsQry[0].email,
                username: getUserDetailsQry[0].username
            }

            console.log(getPayload)

            const getToken = await jwtHelper.generateJWT(getPayload)
                        
            const SuccessResponse = SuccessResp();
            SuccessResponse.message = "Login successfully.";
            SuccessResponse.token = getToken;
            SuccessResponse.data = getUserDetailsQry;
            return SuccessResponse;

        }else{
            throw new Error("Unauthorized access.")
        }

    }catch(err){
        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message

        console.log(ErrorResponse)
        return ErrorResponse;
    }finally{
        if(conn){
            conn.release();
        }
    }

}