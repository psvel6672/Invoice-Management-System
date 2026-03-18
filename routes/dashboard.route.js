const route = require('express').Router();

const DashboardController = require('../controllers/dashboard.controller')

route.get('/dashboard', DashboardController.DashboardDetails)

module.exports = route