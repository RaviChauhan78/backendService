const axios = require("axios");
var Helper = function () { };


Helper.prototype.emailService = async function (data) {

    const api_url = process.env.EMAIL_SERVICE_URL;
    try {
        const insObj = {}
        insObj.email = data
        const response = await axios.post(api_url, insObj);
        return response;
    } catch (error) {
        console.log(error, "Email Send error");
        return {
            data: {},
            message: 'Failed to send email due to some technical issue.',
            status: false
        }
    }
}


module.exports = new Helper();