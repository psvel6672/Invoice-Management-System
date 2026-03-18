const route = require('express').Router();

const InvoiceController = require('../controllers/invoice.controller')

route.post('/addinvoice', InvoiceController.AddNewInvoice);
route.get('/allinvoices', InvoiceController.GetAllInvoice);
route.post('/getinvoiceitems', InvoiceController.GetInvoiceItems);
route.post('/updateinvoice', InvoiceController.UpdateInvoiceDetails);
route.post('/updateinvoiceitem', InvoiceController.UpdateInvoiceItemDetails);
route.post('/deleteinvoice', InvoiceController.RemoveInvoice);
route.post('/deleteinvoiceitem', InvoiceController.RemoveInvoiceItem);

module.exports = route