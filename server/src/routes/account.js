const express = require("express");
const account_router = express.Router();
const verifyToken = require("../middleware/auth");
const AccountController = require("../controller/AccountController");
account_router.post("/login", AccountController.login);

account_router.post("/register", verifyToken, AccountController.register);

account_router.post("/forgot-password", AccountController.forgetPassword);
account_router.get(
  "/update-infor/get-OTP",
  verifyToken,
  AccountController.getOTP
);
account_router.get(
  "/get-information",
  verifyToken,
  AccountController.getPersonalInformation
);
account_router.post(
  "/forgot-password/update",
  verifyToken,
  AccountController.changePasswordForgetPassword
);

account_router.post(
  "/update-infor/update-password",
  verifyToken,
  AccountController.UpdatePassword
);
account_router.post(
  "/update-infor",
  verifyToken,
  AccountController.UpdateInformation
);
account_router.get("/get-all-user", verifyToken, AccountController.getAllUsers);
account_router.get("/search-active-employee/:key", verifyToken, AccountController.searchActiveEmployees)
account_router.get("/search-unactive-employee/:key", verifyToken, AccountController.searchUnActiveEmployees)
account_router.get(
  "/get-all-old-user",
  verifyToken,
  AccountController.getAllOldUsers
);
account_router.delete(
  "/delete-user/:id",
  verifyToken,
  AccountController.deleteUser
);
account_router.delete(
  "/permanently-delete/:id",
  verifyToken,
  AccountController.permanentlyDeletUser
);
account_router.get(
  "/restore-user/:id",
  verifyToken,
  AccountController.restoreUser
);
module.exports = account_router;
