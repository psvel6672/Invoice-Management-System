const dbConn = require('./db.config')

module.exports.executeQry = async (query, param) => {

    let conn;

    try{

        conn = await dbConn.getConnection();
        await conn.beginTransaction();

        const [exeQry] = await conn.execute(query, [...param]);
        return exeQry;

    }catch(err){

        throw new Error(err.message)

    }finally{

        if(conn){
            conn.release();
        }

    }

}

module.exports.updateQry = async (query, param) => {

    let conn;

    try{

        conn = await dbConn.getConnection();
        await conn.beginTransaction();

        const [updQry] = await conn.execute(query, [...param]);
        await conn.commit();
        return updQry;

    }catch(err){

        if(conn){
            await conn.rollback();
        }

        throw new Error(err.message)

    }finally{

        if(conn){
            conn.release();
        }

    }

}

module.exports.insertQry = async (table, insert_list, val_list, param) => {

    let conn;

    try{

        conn = await dbConn.getConnection();
        await conn.beginTransaction();

        const insertSQL = `INSERT INTO ${table} (${insert_list}) VALUES (${val_list})`;

        const [updQry] = await conn.execute(insertSQL, [...param]);
        await conn.commit();
        return updQry;

    }catch(err){

        if(conn){
            await conn.rollback();
        }

        throw new Error(err.message)

    }finally{

        if(conn){
            conn.release();
        }

    }

}

