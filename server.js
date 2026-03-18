const express = require('express')
const app = express();
const path = require('path');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json())
// app.use(express.static(path.join(__dirname, './public')));

const dotenv = require('dotenv')
dotenv.config()

const DashboardRoute = require('./routes/dashboard.route')
const UserRoute = require('./routes/user.route')
const ProductRoute = require('./routes/product.route')
const CustomerRoute = require('./routes/customer.route')
const InvoiceRoute = require('./routes/invoice.route')

const FERoute = require('./routes/frontend.route');

app.use('/', FERoute)
app.use('/index', DashboardRoute)
app.use('/users', UserRoute)
app.use('/products', ProductRoute)
app.use('/customers', CustomerRoute)
app.use('/invoice', InvoiceRoute)

PORT = process.env.SERVERPORT || 3000

app.listen(PORT, () => {
    console.log(`# Server is running at port :: ${PORT}`)
})