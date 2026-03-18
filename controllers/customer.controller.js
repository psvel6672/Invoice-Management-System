const CustomerService = require('../services/customer.service')

module.exports.AllCustomers = async (req, res) => {

    const getCustomerData = await CustomerService.getAllCustomers();
    const getStatusCode = getCustomerData.code;

    res.status(getStatusCode).json(getCustomerData)

}

module.exports.CustomerInfo = async (req, res) => {

    const { customer_id } = req.body;

    const getCustomerData = await CustomerService.getCustomerInfo(customer_id);
    const getStatusCode = getCustomerData.code;

    res.status(getStatusCode).json(getCustomerData)

}

module.exports.DeleteCustomer = async (req, res) => {

    const { customer_id } = req.body;

    const getCustomerData = await CustomerService.removeCustomerInfo(customer_id);
    const getStatusCode = getCustomerData.code;

    res.status(getStatusCode).json(getCustomerData)

}

module.exports.AddNewCustomer = async (req, res) => {

    const addNewCustomer = await CustomerService.CreateNewCustomer(req.body);
    const getStatusCode = addNewCustomer.code;
    res.status(getStatusCode).json(addNewCustomer)

}

module.exports.UpdateCustomerInfo = async (req, res) => {

    const updateCustomerData = await CustomerService.UpdateCustomerDetails(req.body);
    const getStatusCode = updateCustomerData.code;
    res.status(getStatusCode).json(updateCustomerData)

}

module.exports.UpdateShippingInfo = async (req, res) => {

    const updateShipingData = await CustomerService.UpdateShippingDetails(req.body);
    const getStatusCode = updateShipingData.code;
    res.status(getStatusCode).json(updateShipingData)

}