const dbConn = require('../config/db.config');

const ORM = require('../config/orm.config');

const { SuccessResp, ErrorResp } = require('../utils/common.utils')

module.exports.getAllProducts = async () => {

    try {

        const getProductsQry = await ORM.executeQry(`SELECT * FROM products WHERE deleted = '0' ORDER BY product_name ASC`, []);

        if(getProductsQry.length > 0){

            getProductsQry.map(field => delete field.deleted)

            const SuccessResponse = SuccessResp();
            SuccessResponse.total = getProductsQry.length
            SuccessResponse.data = getProductsQry
            return SuccessResponse;

        }else{
            throw new Error("No data found.")
        }
        
    } catch (err) {

        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;
        
    }

}

module.exports.getProductInfo = async (data) => {

    try{

        if(!data.product_id){
            throw new Error("Required details missing.")
        }

        const {product_id} = data;

        const getProductDetails = await ORM.executeQry(`SELECT product_id, product_name, product_desc, product_price, quantity, discount, tax FROM products WHERE deleted = '0' AND product_id = ? `, [product_id])

        if(getProductDetails.length > 0){

            getProductDetails.map(field => delete field.deleted)

            const SuccessResponse = SuccessResp();
            SuccessResponse.data = getProductDetails
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

module.exports.AddNewProduct = async (data) => {

    try{

        const allowedFields = [
            "product_name", "product_desc", "product_price"
        ]

        const chkRequested = data.filter((field) =>{
            const getCheck = allowedFields.filter(allow => field[allow]);
            if(getCheck.length !== allowedFields.length){
                throw new Error("Required details missing.")
            }

            return getCheck

        });

        const getInsertedId = [];

        for(const getData of chkRequested){

            const getSqlFields = allowedFields.filter(field => getData[field]);
            const getSqlParams = allowedFields.map(field => getData[field]);
            const getQmark = getSqlFields.map(_ => "?").join(", ")
            console.log(getSqlParams)
            console.log(getQmark)

            const InsertProduct = await ORM.insertQry('products', getSqlFields.join(", "), getQmark, [...getSqlParams]);

            if(InsertProduct.insertId){
                getInsertedId.push(InsertProduct.insertId)
            }

        }

        if(getInsertedId.length === chkRequested.length){
            const SuccessResponse = SuccessResp();
            SuccessResponse.message = "Product added successfully.",
            SuccessResponse.product_id = getInsertedId
            return SuccessResponse;
        }else{
            throw new Error("Add Product Failed. Please check your data.")
        }

    }catch(err){
        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;
    }

}

module.exports.UpdateProduct = async (data) => {

    try{

        if(!data.id){
            throw new Error("Id is missing.")
        }

        const { id } = data;

        const allowedFields = [
            "product_name", "product_desc", "product_price"
        ]

        const chkRequested = allowedFields.filter(field => data[field]);

        if(chkRequested.length === 0){
            throw new Error("No data requested to create, Please check.");
        }
        
        const getRequested = chkRequested.map(field => data[field]);
        const getSQL = chkRequested.map(field => `${field} = ?`)

        const sqlQry = `UPDATE products SET ${String(getSQL.join(', '))} WHERE deleted = '0' AND product_id = ?`
        const UpdateProduct = await ORM.updateQry(sqlQry, [...getRequested, id]);
        if(UpdateProduct && UpdateProduct.affectedRows > 0){

            const SuccessResponse = SuccessResp();
            SuccessResponse.message = "Product updated successfully.",
            SuccessResponse.product_id = id
            return SuccessResponse;

        }else{
            throw new Error("Update Failed. Please check product details")
        }

    }catch(err){

        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;

    }

}

module.exports.RemoveProduct = async (id) => {

    try{

        const deleteProduct = await ORM.updateQry(`UPDATE products SET deleted = '1' WHERE deleted = '0' AND product_id = ?`, [id])

        if(deleteProduct.affectedRows > 0){

            const SuccessResponse = SuccessResp();
            SuccessResponse.message = "Product deleted successfully.",
            SuccessResponse.product_id = id
            return SuccessResponse;

        }else{
            throw new Error("Delete Failed. Please check product details")
        }

    }catch(err){
        const ErrorResponse = ErrorResp();
        ErrorResponse.error = err.message
        return ErrorResponse;
    }

}