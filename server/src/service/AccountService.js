const bcrypt = require("bcryptjs");
const accounts = require("../model/accounts");
const users = require("../model/users");
const { generateOTP } = require("./OTPService");
const { sendMail } = require("./EmailService");
const checkin = require("../model/checkin");
const work_day = require("../model/work_day");
class AccountService {
  async createUser(user) {
    try {
      const oldaccount = await accounts.findOne({
        email: user.email,
      });
      if (!oldaccount) {
        const newuser = {
          name: user.name,
          gender: user.gender,
          phone: user.phone,
          address: user.address,
        };
        const result = await users.create(newuser);
        const salt = bcrypt.genSaltSync(10);
        const newaccount = {
          email: user.email,
          password: bcrypt.hashSync(user.password, salt),
          role: user.role,
          user: result._id,
        };
        await accounts.create(newaccount);
        return {
          success: true,
          message: "The account has been created successfully!!!",
        };
      } else {
        return {
          success: false,
          message: "Email already exists!!!",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "Email already exists!!!",
      };
    }
  }

  async forgotPassword(email) {
    try {
      const findaccount = await accounts.findOne({ email: email });
      const user = await users.findOne({ _id: findaccount.user });
      if (findaccount && user.enable) {
        const OTP = generateOTP();
        const now = new Date();
        const today = now.toISOString();
        const salt = bcrypt.genSaltSync(10);

        await accounts.updateOne(
          { email: email },
          {
            one_time_password: bcrypt.hashSync(OTP, salt),
            otp_requested_time: today,
          }
        );
        const finduser = await users.findOne({ _id: findaccount.user });
        const params = {
          to: email,
          name: finduser.name,
          OTP: OTP,
        };
        await sendMail(params);
        return {
          status: 200,
          success: true,
          message: "OTP đã được gửi, vui lòng kiểm tra hộp thư của bạn!!",
        };
      } else {
        return {
          status: 400,
          success: false,
          message: "OTP has been sent, please check your email!!",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        success: false,
        message: "There was an error during email sending. Please try again!",
      };
    }
  }

  async changePassword(email, password, OTP) {
    try {
      const findaccount = await accounts.findOne({ email: email });
      const user = await users.findOne({ _id: findaccount.user });
      if (findaccount && user.enable) {
        const now = new Date();
        const otpCreateTime = new Date(findaccount.otp_requested_time);
        const timeDifference = now - otpCreateTime;
        if (timeDifference / (1000 * 60) < 5) {
          if (await bcrypt.compare(OTP, findaccount.one_time_password)) {
            const salt = bcrypt.genSaltSync(10);
            await accounts.updateOne(
              { email: email },
              {
                $set: {
                  password: bcrypt.hashSync(password, salt),
                  one_time_password: null,
                  otp_requested_time: null,
                },
              }
            );
            return {
              status: 200,
              success: true,
              message: "Successful Password Change, please log in again",
            };
          } else {
            return {
              status: 400,
              success: false,
              message: "Wrong OTP",
            };
          }
        } else {
          return {
            status: 400,
            success: false,
            message: "OTP code has expired",
          };
        }
      } else {
        return {
          status: 400,
          success: false,
          message: "Email does not exist",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "An error occurred",
      };
    }
  }

  async getPersonalInformation(email) {
    try {
      const findaccount = await accounts.findOne({ email: email });
      const user = await users.findOne({ _id: findaccount.user });
      if (user) {
        return {
          success: true,
          status: 200,
          message: user,
        };
      } else {
        return {
          success: false,
          status: 400,
          message: "No information found in the system",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: "The data is not in the correct format!!!",
      };
    }
  }
  async UpdateInformation(email, name, gender, phone, address) {
    try {
      const findaccount = await accounts.findOne({ email: email });
      await users.updateOne(
        { _id: findaccount.user },
        {
          name: name,
          gender: gender,
          phone: phone,
          address: address,
        }
      );
      return {
        success: true,
        status: 200,
        message: "Successfully updated personal information",
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: "The data is not in the correct format!!!",
      };
    }
  }

  async getAllUsers() {
    try {
      const allAccount = await accounts.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            "user.enable": true,
          },
        },
        {
          $project: {
            password: 0,
            one_time_password: 0,
            otp_requested_time: 0,
          },
        },
      ]);
      return {
        success: true,
        status: 200,
        data: allAccount,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "An error occurred",
      };
    }
  }
  async SearchActiveAccount(key) {
    const translate = key.replace(/\+/g, " ");
    const findAccounts = await accounts.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          $or: [
            { "email": { $regex: translate, $options: "i" } },
            { "user.name": { $regex: translate, $options: "i" } },
          ],
          "user.enable": true,
        },
      },
      {
        $project: {
          password: 0,
          one_time_password: 0,
          otp_requested_time: 0,
        },
      },
    ]);

    return findAccounts;
  }

  async SearchUnactiveAccount(key) {
    const translate = key.replace(/\+/g, " ");
    const findAccounts = await accounts.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          $or: [
            { "user.email": { $regex: translate, $options: "i" } },
            { "user.name": { $regex: translate, $options: "i" } },
          ],
          "user.enable": false,
        },
      },
      {
        $project: {
          password: 0,
          one_time_password: 0,
          otp_requested_time: 0,
        },
      },
    ]);

    return findAccounts;
  }

  async getAllOldUsers() {
    try {
      const allAccount = await accounts.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            "user.enable": false,
          },
        },
        {
          $project: {
            password: 0,
            one_time_password: 0,
            otp_requested_time: 0,
          },
        },
      ]);

      return {
        success: true,
        status: 200,
        data: allAccount,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "An error occurred",
      };
    }
  }

  async deleteUser(id) {
    try {
      const findaccount = await accounts.findOne({ _id: id });
      if (findaccount) {
        await users.updateOne(
          { _id: findaccount.user },
          {
            enable: false,
          }
        );
        return {
          success: true,
          status: 200,
          message: "Deleted successfully",
        };
      } else {
        return {
          success: false,
          status: 400,
          message: "ID does not exist",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "An error occurred!!!",
      };
    }
  }

  async RestoreUser(id) {
    try {
      const findaccount = await accounts.findOne({ _id: id });
      if (findaccount) {
        await users.updateOne(
          { _id: findaccount.user },
          {
            enable: true,
          }
        );
        return {
          success: true,
          status: 200,
          message: "Restore user successfully",
        };
      } else {
        return {
          success: false,
          status: 400,
          message: "ID does not exist",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "An error occurred!!!",
      };
    }
  }

  async permanentlyDeletUser(id) {
    try {
      const findaccount = await accounts.findOne({ _id: id });
      if (findaccount) {
        const finduser = await users.findOne({
          _id: findaccount.user,
          enable: false,
        });
        if (finduser) {
          await users.deleteOne({ _id: findaccount.user, enable: false });

          const listOldcheckin = await checkin.find({
            employee: findaccount._id,
          });
          for (const oldCheck of listOldcheckin) {
            await work_day.updateOne(
              { checkin: { $elemMatch: { $eq: oldCheck._id } } },
              { $pull: { checkin: oldCheck._id } }
            );
          }
          await checkin.deleteMany({ employee: findaccount._id });
          await accounts.deleteOne({ _id: findaccount._id });
          return {
            success: true,
            status: 200,
            message: "Deleted successfully",
          };
        } else {
          return {
            success: false,
            status: 400,
            message: "You cannot delete a user that has not been added to the deleted section",
          };
        }
      } else {
        return {
          success: false,
          status: 400,
          message: " ID does not exist",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "An error occurred!!!",
      };
    }
  }
}

module.exports = AccountService;
