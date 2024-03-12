const util = require('../../../utils/response');
const message = require('../../../utils/messages.json');
const userModel = require('../model/user.model');
const { emailService } = require('../../../utils/helper');

class UserHandler {

  async register(req, res) {
    let reqData = req.body;
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    try {
      if (typeof reqData.email == "undefined" || (typeof reqData.email != "undefined" && reqData.email == "")) {
        res.status(200).send(util.error(res, message.email_empty));
      } else if (typeof reqData.mobile == "undefined" || (typeof reqData.mobile != "undefined" && reqData.mobile == "")) {
        res.status(200).send(util.error(res, message.mobile_empty));
      } else if (!emailRegexp.test(reqData.email)) {
        res.status(200).send(util.error(res, message.invalid_email_format));
      } else if (typeof reqData.name == "undefined" || (typeof reqData.name != "undefined" && reqData.name == "")) {
        res.status(200).send(util.error(res, message.name_empty));
      } else if (typeof reqData.password == "undefined" || (typeof reqData.password != "undefined" && reqData.password == "")) {
        res.status(200).send(util.error(res, message.empty_password));
      } else if (reqData.password && reqData.password.length < 6) {
        res.status(200).send(util.error(res, message.password_length_6));
      } else {
        var check_user_email = await userModel.getUserByEmail(reqData.email.toLowerCase());
        if (reqData.mobile && reqData.mobile.length > 0 && reqData.mobile.length < 8) {
          res.status(200).send(util.error(res, message.invalid_mobile_length));
        } else {
          var check_user_mobile = await userModel.getUserByMobile(reqData.mobile);
        }

        if (check_user_email) {
          res.status(200).send(util.error(res, message.email_already_exist));
        } else if (check_user_mobile) {
          res.status(200).send(util.error(res, message.mobile_already_exist));
        } else if ((check_user_email == "" || check_user_email == null) && (check_user_mobile == "" || check_user_mobile == null)) {

          const user_arr = {};
          user_arr.name = reqData.name;
          user_arr.email = reqData.email.toLowerCase();
          user_arr.mobile = reqData.mobile;
          user_arr.password = reqData.password;
          const user = await userModel.createUser(user_arr);
          
          await emailService(reqData.email.toLowerCase())

          res.send(util.success(user, message.registration_success));

        } else {
          res.status(200).send(util.error({}, message.email_already_exist));
        }
      }
    } catch (err) {
      console.log(err, "err")
      return res.send(util.error(res, message.something_went_wrong));
    }
  }

  async getAllUser(req, res) {
    try {
      const findObj = {}
      findObj.is_deleted = false
      const getAllUserList = await userModel.getAllUserList(findObj);

      if (Array.isArray(getAllUserList) && getAllUserList.length > 0) {
        return res.send(util.success(getAllUserList, message.common_messages_record_available));
      } else {
        return res.status(200).send(util.error([], message.common_messages_record_not_available));
      }

    } catch (err) {
      console.log(err, "err")
      return res.send(util.error(res, message.something_went_wrong));
    }
  }

}

module.exports = new UserHandler();