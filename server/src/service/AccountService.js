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
          message: "Tài khoản đã được tạo thành công!!!",
        };
      } else {
        return {
          success: false,
          message: "Email đã tồn tại!!!",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: err,
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
          message: "Email không tồn tại trong hệ thống",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 500,
        success: false,
        message: "có lỗi trong quá trình gửi email. Vui lòng thử lại",
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
              message: "Thay đổi Mật Khẩu Thành Công, vui lòng đăng nhập lại",
            };
          } else {
            return {
              status: 400,
              success: false,
              message: "Sai mã OTP",
            };
          }
        } else {
          return {
            status: 400,
            success: false,
            message: "Mã OTP đã hết hạn",
          };
        }
      } else {
        return {
          status: 400,
          success: false,
          message: "Email không tồn tại trong hệ thống",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "Có lỗi xảy ra",
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
        message: "chỉnh sửa thông tin cá nhân thành công",
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: "Dữ liệu không đúng định dạng!!!",
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
      ]);
      const allActiveAccount = allAccount.filter((acc) => acc.user.enable);
      const allActiveAccountWithoutPassword = allActiveAccount.map((acc) => {
        const { password, ...rest } = acc;
        return rest;
      });
      return {
        success: true,
        status: 200,
        data: allActiveAccountWithoutPassword,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "có lỗi xảy ra",
      };
    }
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
      ]);
      console.log(allAccount);
      const allUnactiveAccount = allAccount.filter((acc) => !acc.user.enable);
      console.log(allUnactiveAccount);
      const allUnactiveAccountWithoutPassword = allUnactiveAccount.map(
        (acc) => {
          const { password, ...rest } = acc;
          return rest;
        }
      );
      return {
        success: true,
        status: 200,
        data: allUnactiveAccountWithoutPassword,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "có lỗi xảy ra",
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
          message: "Xóa thành công",
        };
      } else {
        return {
          success: false,
          status: 400,
          message: "ID không tồn tại",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "có lỗi xảy ra!!!",
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
          message: "khôi phục thành công",
        };
      } else {
        return {
          success: false,
          status: 400,
          message: "ID không tồn tại",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "có lỗi xảy ra!!!",
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
            message: "Xóa thành công",
          };
        } else {
          return {
            success: false,
            status: 400,
            message: "không thể xóa user bạn chưa cho vào mục đã xóa",
          };
        }
      } else {
        return {
          success: false,
          status: 400,
          message: "ID không tồn tại",
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: "có lỗi xảy ra!!!",
      };
    }
  }
}

module.exports = AccountService;
