const accounts = require("../model/accounts");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AccountService = require("../service/AccountService");
const users = require("../model/users");
module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).json({
          success: false,
          message: "Cần phải nhập đủ các trường yêu cầu",
        });
        return;
      }
      const account = await accounts.findOne({
        email,
      });

      const user = await users.findOne({ _id: account.user });

      if (
        user.enable &&
        account &&
        (await bcrypt.compare(password, account.password))
      ) {
        const role = account.role;
        const token = jwt.sign(
          { account_id: account._id, email, role },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        res.status(200).json({ token: token, message: "Đăng nhập thành công" });
      } else {
        res.status(400).json({
          success: false,
          message: "Tài khoản hoặc mật khẩu không đúng",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  register: async (req, res) => {
    const user = req.user;
    if (user.role == "MANAGER") {
      const accountService = new AccountService();
      const userData = {
        name: req.body.name,
        gender: req.body.gender,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      };
      if (!(userData.name && userData.email && userData.password)) {
        res.status(400).json({
          success: false,
          message: "Cần phải nhập đủ các trường yêu cầu",
        });
        return;
      }
      try {
        const result = await accountService.createUser(userData);
        if (result.success) {
          res.status(200).json(result);
          return;
        } else {
          res.status(400).json(result);
          return;
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "An error occurred" });
        return;
      }
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
      return;
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const email = req.body.email;
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Yêu cầu nhập email",
        });
        return;
      }
      const accountService = new AccountService();
      const result = await accountService.forgotPassword(email);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  getOTP: async (req, res) => {
    try {
      const email = req.user.email;
      const accountService = new AccountService();
      const result = await accountService.forgotPassword(email);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  changePasswordForgetPassword: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const OTP = req.body.OTP;
      if (!(email && password && OTP)) {
        res.status(400).json({
          success: false,
          message: "Yêu cầu nhập đủ các trường",
        });
        return;
      }
      const accountService = new AccountService();
      const result = await accountService.changePassword(email, password, OTP);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  UpdatePassword: async (req, res) => {
    try {
      const email = req.user.email;
      const password = req.body.password;
      const OTP = req.body.OTP;
      if (!(email && password && OTP)) {
        res.status(400).json({
          success: false,
          message: "Yêu cầu nhập đủ các trường",
        });
        return;
      }
      const accountService = new AccountService();
      const result = await accountService.changePassword(email, password, OTP);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  UpdateInformation: async (req, res) => {
    try {
      const email = req.user.email;
      const name = req.body.name;
      const gender = req.body.gender;
      const phone = req.body.phone;
      const address = req.body.address;

      const accountService = new AccountService();
      const result = await accountService.UpdateInformation(
        email,
        name,
        gender,
        phone,
        address
      );
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const accountService = new AccountService();
        const result = await accountService.getAllUsers();
        if (result?.success) {
          res.status(200).json(result?.data);
          return;
        } else {
          res.status(400).json({ success: false, message: result?.message });
          return;
        }
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  getAllOldUsers: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const accountService = new AccountService();
        const result = await accountService.getAllOldUsers();
        if (result?.success) {
          res.status(200).json(result?.data);
          return;
        } else {
          res.status(400).json({ success: false, message: result?.message });
          return;
        }
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const id = req.params.id;
        const accountService = new AccountService();
        const result = await accountService.deleteUser(id);
        res.status(result.status).json({
          success: result.success,
          message: result.message,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  restoreUser: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const id = req.params.id;
        const accountService = new AccountService();
        const result = await accountService.RestoreUser(id);
        res.status(result.status).json({
          success: result.success,
          message: result.message,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  },

  permanentlyDeletUser: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const id = req.params.id;
        const accountService = new AccountService();
        const result = await accountService.permanentlyDeletUser(id);
        res.status(result.status).json({
          success: result.success,
          message: result.message,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập chức năng này",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
    }
  }
};
