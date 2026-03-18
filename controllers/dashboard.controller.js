
const DashboardService = require('../services/dashboard.service')

module.exports.DashboardDetails = async (req, res) => {

    const getData = await DashboardService.getDashboardDetails();
    const getStatusCode = getData.code
    res.status(getStatusCode).json(getData)

}