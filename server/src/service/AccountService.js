const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const accounts = require("../model/accounts");
const users = require("../model/users");
const { generateOTP } = require("./OTPService");
const { sendMail } = require("./EmailService");
const checkin = require("../model/checkin");
const work_day = require("../model/work_day");

const EMPLOYEE_PAGE_SIZE = process.env.EMPLOYEE_PAGE_SIZE;

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
        message: "Server Error",
      };
    }
  }

  async forgotPassword(email) {
    try {
      const findaccount = await accounts.findOne({ email: email });
      const user = findaccount
        ? await users.findOne({ _id: findaccount.user })
        : null;
      if (findaccount && user?.enable) {
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
          message: "OTP has been sent, please check your email!!",
        };
      } else {
        return {
          status: 400,
          success: false,
          message: "Email does not exist!!",
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

  async checkmail(email) {
    try {
      const findaccount = await accounts.findOne({ email: email });
      const user = findaccount
        ? await users.findOne({ _id: findaccount.user })
        : null;
      if (findaccount && user?.enable) {
        return { status: 200, success: true, message: "email exists" };
      } else {
        return {
          status: 400,
          success: false,
          message: "This email is not registered",
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

  async changePassword(email, password, OTP) {
    try {
      const findaccount = await accounts.findOne({ email: email });
      const user = findaccount
        ? await users.findOne({ _id: findaccount.user })
        : null;
      if (findaccount && user?.enable) {
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
              message: "Changed password successfully!!!",
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
      const user = findaccount
        ? await users.findOne({ _id: findaccount.user })
        : null;
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

  async getAllUsers(page) {
    try {
      const Npage = parseInt(page);
      const skip = (Npage - 1) * EMPLOYEE_PAGE_SIZE;
      const allAccount = await accounts
        .aggregate([
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
        ])
        .skip(skip)
        .limit(parseInt(EMPLOYEE_PAGE_SIZE));
      const length = await users.countDocuments({
        enable: true,
      });
      return {
        success: true,
        data: allAccount,
        size: length,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "An error occurred",
      };
    }
  }
  async SearchActiveAccount(key, page) {
    const translate = key.replace(/\+/g, " ");
    const Npage = parseInt(page);
    const skip = (Npage - 1) * EMPLOYEE_PAGE_SIZE;
    const countQuery = await accounts.aggregate([
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
            { email: { $regex: translate, $options: "i" } },
            { "user.name": { $regex: translate, $options: "i" } },
          ],
          "user.enable": true,
        },
      },
    ]).count("count");
    
    const totalMatchingCount = countQuery.length > 0 ? countQuery[0].count : 0;
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
            { email: { $regex: translate, $options: "i" } },
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
    ]).skip(skip).limit(parseInt(EMPLOYEE_PAGE_SIZE));

    return {
      totalMatchingCount,
      result: findAccounts,
    };
  }

  async SearchUnactiveAccount(key, page) {
    const translate = key.replace(/\+/g, " ");
    const Npage = parseInt(page);
    const skip = (Npage - 1) * (parseInt(EMPLOYEE_PAGE_SIZE));
    const countQuery = await accounts.aggregate([
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
            { email: { $regex: translate, $options: "i" } },
            { "user.name": { $regex: translate, $options: "i" } },
          ],
          "user.enable": false,
        },
      },
    ]).count("count");
    const totalMatchingCount = countQuery.length > 0 ? countQuery[0].count : 0;
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
            { email: { $regex: translate, $options: "i" } },
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
    ]).skip(skip).limit(parseInt(EMPLOYEE_PAGE_SIZE));

    return {
      data: findAccounts,
      size: totalMatchingCount
    };
  }

  async getAllOldUsers(page) {
    try {
      const skip = (page-1)*EMPLOYEE_PAGE_SIZE
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
      ]).skip(skip).limit((parseInt(EMPLOYEE_PAGE_SIZE)));
      const length = await users.countDocuments({
        enable: false,
      });
      return {
        success: true,
        status: 200,
        data: allAccount,
        size: length
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

  async getAccountByID(_id) {
    try {
      const findaccount = await accounts.findOne({ _id: _id });
      if (findaccount) {
        const account = await accounts.aggregate([
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
              _id: new mongoose.Types.ObjectId(_id),
            },
          },
        ]);
        return {
          success: true,
          status: 200,
          data: account[0],
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
        message: "An error occurred",
      };
    }
  }

  async UpdateEmployee(
    _id,
    email,
    password,
    role,
    name,
    gender,
    address,
    phone,
    changepassword
  ) {
    try {
      const findaccount = await accounts.findOne({ _id: _id });
      if (findaccount) {
        if (changepassword) {
          const salt = bcrypt.genSaltSync(10);
          await accounts.updateOne(
            { _id: _id },
            {
              email: email,
              password: bcrypt.hashSync(password, salt),
              role: role,
            }
          );
        } else {
          await accounts.updateOne(
            { _id: _id },
            {
              email: email,
              role: role,
            }
          );
        }
        await users.updateOne(
          { _id: findaccount.user },
          {
            name: name,
            gender: gender,
            address,
            phone,
          }
        );
        return {
          success: true,
          status: 200,
          message: "Updated Employee successfully",
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
            message:
              "You cannot delete a user that has not been added to the deleted section",
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
