const route = require('express').Router()

const ProductController = require('../controllers/product.controller')

route.post('/addproduct', ProductController.AddNewProduct)
route.get('/allproducts', ProductController.getAllProducts)
route.post('/getproductinfo', ProductController.getProductDetails)
route.post('/updateproduct', ProductController.UpdateProduct)
route.post('/deleteproduct', ProductController.RemoveProduct)

module.exports = route