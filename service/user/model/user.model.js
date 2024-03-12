"use strict";
const UserSchema = require("./user.schema");

class UserModel {
  constructor() {
    this.DB = require("../../../config/dbm");
  }

  getUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.findOne({ email: email, is_deleted: false });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }


  getUserByMobile(mobile) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await UserSchema.findOne({ mobile: mobile,is_deleted: false});
        resolve(result);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }


  createUser(user_data) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = new UserSchema(user_data);
        const result = await user.save();
        resolve(result);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  getAllUserList(whereObj) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await UserSchema.aggregate([
					{
						$match: whereObj
					},
					{
						$project: {
							"_id": 1,
							"is_deleted": 1,
							"name": 1,
							"email": 1,
							"mobile": 1,
						}
					},
					{
						$sort: { createdAt: -1 }
					}
				]);
				resolve(result);

			} catch (error) {
				console.log(error);
				reject(error)
			}
		});
	}
  
}

module.exports = new UserModel();
