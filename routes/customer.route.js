const route = require('express').Router();
const CustomerController = require('../controllers/customer.controller')

route.post('/createcustomer', CustomerController.AddNewCustomer)
route.get('/allcustomers', CustomerController.AllCustomers)
route.post('/getcustomerinfo', CustomerController.CustomerInfo)
route.post('/updatecustomerinfo', CustomerController.UpdateCustomerInfo)
route.post('/updateshippinginfo', CustomerController.UpdateShippingInfo)
route.post('/deletecustomer', CustomerController.DeleteCustomer)

module.exports = route