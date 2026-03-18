const express = require('express');
const route = express.Router();
const path = require('path');

const FEMiddleWare = require('../middlewares/frontend.auth.middleware')

route.get('/login', FEMiddleWare.AuthMiddleware({public: true}), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/user-login.html'));
});

route.get('/', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/getdash.html'));
});

route.get('/allproducts', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/getproducts.html'));
});

route.get('/addproduct', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/add-product.html'));
});

route.get('/allcustomers', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/customers.html'));
});

route.get('/addcustomer', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/add-customer.html'));
});

route.get('/allsysusers', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/sys-users.html'));
});

route.get('/addsysuser', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/add-sys-users.html'));
});

route.get('/allinvoices', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/get-invoices.html'));
});

route.get('/addinvoice', FEMiddleWare.AuthMiddleware(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/add-invoice.html'));
});

route.get("/assets/:file", FEMiddleWare.AuthMiddleware(), (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, "../public/assets/", file));
});

route.get("/login_assets/:file", FEMiddleWare.AuthMiddleware({public: true}), (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, "../public/assets/", file));
});

module.exports = route;