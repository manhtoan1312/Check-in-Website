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
          message: "It is necessary to enter all required fields",
        });
        return;
      }
      const account = await accounts.findOne({
        email,
      });
      if (account) {
        const user = await users.findOne({ _id: account.user });
        if(user.enable){
          if (await bcrypt.compare(password, account.password)) {
            const role = account.role;
            const token = jwt.sign(
              { email, name: user.name, role, enable: user.enable },
              process.env.TOKEN_KEY,
              {
                expiresIn: "24h",
              }
            );
            res
              .status(200)
              .json({ token: token, message: "Logged in successfully" });
          } else {
            res.status(400).json({
              success: false,
              message: "Invalid email or password",
            });
        }
        } else{
          return res.status(403).json({
            success:false,
            message:"This account cannot currently log into the system"
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Server Error" });
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
      if (
        !(
          userData.email &&
          userData.password &&
          userData.phone &&
          userData.name
        )
      ) {
        res.status(400).json({
          success: false,
          message: "Cần phải nhập đủ các trường yêu cầu",
        });
        return;
      }
      try {
        const result = await accountService.createUser(userData);
        if (result.success) {
          res.status(200).json({
            success: true,
            message: result.message,
          });
          return;
        } else {
          res.status(400).json({ success: false, message: result.message });
          return;
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "An error occurred" });
        return;
      }
    } else {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this function",
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
          message: "Email is required",
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
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },
  checkemail: async (req, res) => {
    try {
      const email = req.body.email;
      const accountService = new AccountService();
      const result = await accountService.checkmail(email);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
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
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },

  changePasswordForgetPassword: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const otp = req.body.otp;
      if (!(email && password && otp)) {
        res.status(400).json({
          success: false,
          message: "Required to enter all fields",
        });
        return;
      }
      const accountService = new AccountService();
      const result = await accountService.changePassword(email, password, otp);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },

  UpdatePassword: async (req, res) => {
    try {
      const email = req.user.email;
      const password = req.body.password;
      const otp = req.body.otp;

      if (!(email && password && otp)) {
        res.status(400).json({
          success: false,
          message: "Required to enter all fields",
        });
        return;
      }
      const accountService = new AccountService();
      const result = await accountService.changePassword(email, password, otp);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },
  getPersonalInformation: async (req, res) => {
    try {
      const email = req.user.email;
      const accountService = new AccountService();
      const result = await accountService.getPersonalInformation(email);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
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
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const role = req.user.role;
      const page = req.params.page;
      if (role == "MANAGER") {
        const accountService = new AccountService();
        const result = await accountService.getAllUsers(page);
        if (result?.success) {
          res.status(200).json(result);
          return;
        } else {
          res.status(500).json({ success: false, message: result?.message });
          return;
        }
      } else {
        res.status(403).json({
          success: false,
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },

  getAccountByID: async (req, res) => {
    try {
      const role = req.user.role;
      const _id = req.params.id;
      if (role == "MANAGER") {
        const accountService = new AccountService();
        const result = await accountService.getAccountByID(_id);
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
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },
  updateEmployee: async (req, res) => {
    try {
      const user = req.user;
      const _id = req.body._id;
      const email = req.body.email;
      const password = req.body.password;
      const role = req.body.role;
      const name = req.body.name;
      const gender = req.body.gender;
      const address = req.body.address;
      const phone = req.body.phone;
      const changepassword = req.body.changepassword
      if (user.role == "MANAGER") {
        const accountService = new AccountService();
        const result = await accountService.UpdateEmployee(
          _id,
          email,
          password,
          role,
          name,
          gender,
          address,
          phone,
          changepassword
        );
        res
          .status(result.status)
          .json({ success: result.success, message: result.message });
      } else {
        res.status(403).json({
          success: false,
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },

  getAllOldUsers: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const page = parseInt(req.params.page)
        const accountService = new AccountService();
        const result = await accountService.getAllOldUsers(page);
        if (result?.success) {
          res.status(200).json(result);
          return;
        } else {
          res.status(400).json({ success: false, message: result?.message });
          return;
        }
      } else {
        res.status(403).json({
          success: false,
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
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
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
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
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
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
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },

  searchActiveEmployees: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const {key, page} = req.params;
        const accountService = new AccountService();
        const result = await accountService.SearchActiveAccount(key,page);
        res.status(200).json({
          data: result.result,
          size: result.totalMatchingCount
        });
        return;
      } else {
        res.status(403).json({
          success: false,
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },
  searchUnActiveEmployees: async (req, res) => {
    try {
      const role = req.user.role;
      if (role == "MANAGER") {
        const {key, page} = req.params;
        const newkey = key.replace("+", " ");
        const accountService = new AccountService();
        const result = await accountService.SearchUnactiveAccount(newkey, page);
        res.status(200).json({
          data: result.data,
          size: result.size
        });
        return;
      } else {
        res.status(403).json({
          success: false,
          message: "You do not have permission to access this function",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  },
};
