const dbConn = require('../config/db.config')

const { SuccessResp, ErrorResp } = require('../utils/common.utils')

const SuccessResponse = SuccessResp();
const ErrorResponse = ErrorResp();

module.exports.getDashboardDetails = async () => {

    let conn;

    try{

        const finalResp = {
            total_sales: 0,
            total_invoice: 0,
            pending_bills: 0,
            due_amount: 0,
            total_products: 0,
            total_customers: 0,
            paid_bills:0,
            recent_products: [],
            recent_customers: []
        }

        conn = await dbConn.getConnection();
        await conn.beginTransaction();

        const getTotalSalesAmount = await conn.execute(`SELECT SUM(subtotal) AS total_sales_amount FROM invoices WHERE deleted = '0' AND status = "paid"`, []);

        if(getTotalSalesAmount[0].length > 0){
            finalResp.total_sales = getTotalSalesAmount[0][0].total_sales_amount;
            finalResp.total_sales = finalResp.total_sales == null ? 0 : finalResp.total_sales
        }

        const getTotalInvoices = await conn.execute(`SELECT COUNT(*) as total_invoice FROM invoices WHERE deleted = '0'`, []);

        if(getTotalInvoices[0].length > 0){
            finalResp.total_invoice = getTotalInvoices[0][0].total_invoice;
        }
        
        const getTotalPendingInvoices = await conn.execute(`SELECT COUNT(*) as total_pending_bills FROM invoices WHERE deleted = '0' AND status != 'paid'`, []);

        if(getTotalPendingInvoices[0].length > 0){
            finalResp.pending_bills = getTotalPendingInvoices[0][0].total_pending_bills;
        }
        
        const getTotalDueAmount = await conn.execute(`SELECT SUM(subtotal) AS due_amount FROM invoices WHERE deleted = '0' AND status != "paid"`, []);

        if(getTotalDueAmount[0].length > 0){
            finalResp.due_amount = getTotalDueAmount[0][0].due_amount;
            finalResp.due_amount = finalResp.due_amount == null ? 0 : finalResp.due_amount
        }

        const getTotalProducts = await conn.execute(`SELECT COUNT(*) as total_products FROM products WHERE deleted = '0'`, []);

        if(getTotalProducts[0].length > 0){
            finalResp.total_products = getTotalProducts[0][0].total_products;
        }
        
        const getTotalCustomers = await conn.execute(`SELECT COUNT(*) as total_customers FROM store_customers WHERE deleted = '0'`, []);

        if(getTotalCustomers[0].length > 0){
            finalResp.total_customers = getTotalCustomers[0][0].total_customers;
        }
        
        const getTotalPaid = await conn.execute(`SELECT COUNT(*) as paid_bills FROM invoices WHERE deleted = '0' AND status = 'paid'`, []);

        if(getTotalPaid[0].length > 0){
            finalResp.paid_bills = getTotalPaid[0][0].paid_bills;
        }
        
        const [getRecentProducts] = await conn.execute(`SELECT product_name, product_desc, product_price FROM products WHERE deleted = '0' ORDER BY product_id DESC LIMIT 5`, []);

        if(getRecentProducts.length > 0){
            finalResp.recent_products = [...getRecentProducts];
        }

        const [getRecentCustomers] = await conn.execute(`SELECT name, email, phone, town FROM store_customers WHERE deleted = '0' ORDER BY id DESC LIMIT 5`, []);
        
        if(getRecentCustomers.length > 0){
            finalResp.recent_customers = [...getRecentCustomers];
        }

        SuccessResponse.data = finalResp;
        return SuccessResponse;

    }catch(err){

        ErrorResponse.error = err.message;
        return ErrorResponse;

    }finally{

        if(conn){
            conn.release();
        }

    }

}