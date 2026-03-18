const ProductService = require('../services/product.service')

module.exports.getAllProducts = async (req, res) => {

    const getProductList = await ProductService.getAllProducts()
    const getStatusCode = getProductList.code
    res.status(getStatusCode).json(getProductList)

}

module.exports.getProductDetails = async (req, res) => {

    const getInfo = await ProductService.getProductInfo(req.body);
    const getStatusCode = getInfo.code
    res.status(getStatusCode).json(getInfo)

}

module.exports.AddNewProduct = async (req, res) => {

    // const { name, description, price } = req.body;
    const getResp = await ProductService.AddNewProduct(req.body)
    const getStatusCode = getResp.code;
    res.status(getStatusCode).json(getResp)

}

module.exports.UpdateProduct = async (req, res) => {

    // const { id, name, description, price } = req.body;

    const getResp = await ProductService.UpdateProduct(req.body)

    const getStatusCode = getResp.code;

    res.status(getStatusCode).json(getResp)

}

module.exports.RemoveProduct = async (req, res) => {

    const { id } = req.body;

    const getResp = await ProductService.RemoveProduct(id)

    const getStatusCode = getResp.code;

    res.status(getStatusCode).json(getResp)

}