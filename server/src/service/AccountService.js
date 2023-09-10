const bcrypt = require("bcryptjs");
const accounts = require("../model/accounts");
const users = require("../model/users");
const { generateOTP } = require("./OTPService");
const { sendMail } = require("./EmailService");
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
      if (findaccount) {
        const OTP = generateOTP();
        const now = new Date();
        const today = now.toISOString();
        const salt = bcrypt.genSaltSync(10);

        const updateAccount = await accounts.updateOne(
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
        // if (result) {
        //   return {
        //     status: 200,
        //     success: true,
        //     message: "Đã gửi OTP, vui lòng kiểm tra trong email của bạn!!!",
        //   };
        // } else {
        //   return {
        //     status: 500,
        //     success: false,
        //     message: "có lỗi trong quá trình gửi email. Vui lòng thử lại",
        //   };
        // }
        return {
          status: 200,
          success: true,
          message: "Đã gửi OTP, vui lòng kiểm tra trong email của bạn!!!",
        };
      } else {
        return {
          status: 400,
          success: false,
          message: "Email không tồn tại trong hệ thống",
        };
      }
    } catch (err) {
      return {
        status: 500,
        success: false,
        message: "có lỗi xảy ra",
      };
    }
  }
  async changePassword(email, password, OTP) {
    try {
      findaccount = await accounts.findOne({ email: email });
      if (findaccount) {
        const now = new Date();
        const otpCreateTime = new Date(findaccount.otp_requested_time);
        const timeDifference = now - otpCreateTime;
        if (timeDifference / (1000 * 60) < 5) {
          if (await bcrypt.compare(OTP, findaccount.one_time_password)) {
            await accounts.updateOne(
              { email: email },
              {
                $set: {
                  password: password,
                  one_time_password: null,
                  otp_requested_time: null,
                },
              }
            );
            return {
              status: 200,
              success: true,
              message: "Đổi Mật Khẩu Thành Công, vui lòng đăng nhập lại",
            };
          }
          else {
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
        message: err,
      };
    }
  }
}

module.exports = AccountService;
