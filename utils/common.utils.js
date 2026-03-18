const dbConn = require('../config/db.config')

module.exports.SuccessResp = () => {
    return {
        success: true,
        code: 200,
        message: "Data Found!"
    }
}

module.exports.ErrorResp = () => {
    return {
        success: false,
        code: 404,
        message: "Error Found!"
    }
}

module.exports.generateInvoiceNo = async () => {

    let conn;

    try {

        conn = await dbConn.getConnection();
        await conn.beginTransaction();

        const getCurrentDate = new Date().toISOString();
        const dateAlone = (getCurrentDate).toString().split("T")[0].replaceAll("-", "")
        const [getCount] = await conn.execute(`SELECT COUNT(*) as total_count FROM invoices WHERE deleted = '0' AND invoice_no like ?`, [`INV${dateAlone}%`])

        let getFinalInvoiceNo = `INV${dateAlone}${String(getCount[0].total_count + 1).padStart(4, '0')}`;

        const [chkExists] = await conn.execute(`SELECT COUNT(*) as chk_exists FROM invoices WHERE deleted = '0' AND invoice_no = ?`, [getFinalInvoiceNo]);

        if(chkExists[0].chk_exists > 0){
            getFinalInvoiceNo = await this.generateInvoiceNo();
        }

        return getFinalInvoiceNo;
        
    } catch (err) {

        throw new Error(err.message)
        
    }finally{

        if(conn){
            conn.release();
        }

    }

}
