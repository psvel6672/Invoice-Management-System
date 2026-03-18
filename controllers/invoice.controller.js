const InvoiceServices = require('../services/invoice.service')

module.exports.GetAllInvoice = async (req, res) => {

    const getList = await InvoiceServices.getAllInvoiceList();
    const getStatusCode = getList.code;
    res.status(getStatusCode).json(getList)
}

module.exports.GetInvoiceItems = async (req, res) => {

    const { invoive_no } = req.body;

    const getItems = await InvoiceServices.getInvoiceItems(invoive_no);
    const getStatusCode = getItems.code;
    res.status(getStatusCode).json(getItems)
}

module.exports.AddNewInvoice = async (req, res) => {

    const createInvoice = await InvoiceServices.CreateInvoice(req.body);
    const getStatusCode = createInvoice.code;
    res.status(getStatusCode).json(createInvoice);

}

module.exports.RemoveInvoice = async (req, res) => {

    const { invoive_no } = req.body;

    const removeInvoice = await InvoiceServices.DeleteInvoice(invoive_no);
    const getStatusCode = removeInvoice.code;
    res.status(getStatusCode).json(removeInvoice);

}

module.exports.RemoveInvoiceItem = async (req, res) => {

    const { id } = req.body;

    const removeInvoice = await InvoiceServices.DeleteInvoiceItem(id);
    const getStatusCode = removeInvoice.code;
    res.status(getStatusCode).json(removeInvoice);

}

module.exports.UpdateInvoiceDetails = async (req, res) => {

    const updateInvoice = await InvoiceServices.UpdateInvoice(req.body);
    const getStatusCode = updateInvoice.code;
    res.status(getStatusCode).json(updateInvoice);

}

module.exports.UpdateInvoiceItemDetails = async (req, res) => {

    const updateInvoice = await InvoiceServices.UpdateInvoiceItem(req.body);
    const getStatusCode = updateInvoice.code;
    res.status(getStatusCode).json(updateInvoice);

}