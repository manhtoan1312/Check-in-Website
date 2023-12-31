const express = require("express");
const account_router = express.Router();
const verifyToken = require("../middleware/auth");
const AccountController = require("../controller/AccountController");
account_router.post("/login", AccountController.login);

account_router.post("/create", verifyToken, AccountController.register);

account_router.post("/forgot-password", AccountController.forgetPassword);
account_router.get(
  "/update-infor/get-OTP",
  verifyToken,
  AccountController.getOTP
);

account_router.get("/find/:id",verifyToken, AccountController.getAccountByID);
account_router.post("/checkmail", AccountController.checkemail);

account_router.get(
  "/get-infor",
  verifyToken,
  AccountController.getPersonalInformation
);
account_router.put(
  "/forgot-password/update",
  AccountController.changePasswordForgetPassword
);

account_router.put(
  "/update-password",
  verifyToken,
  AccountController.UpdatePassword
);
account_router.put( 
  "/update-infor",
  verifyToken,
  AccountController.UpdateInformation
);
account_router.put("/update",verifyToken, AccountController.updateEmployee);
account_router.get("/all-user/:page", verifyToken, AccountController.getAllUsers);
account_router.get(
  "/search-active/:key/:page",
  verifyToken,
  AccountController.searchActiveEmployees
);
account_router.get(
  "/search-unactive/:key/:page",
  verifyToken,
  AccountController.searchUnActiveEmployees
);
account_router.get("/old-user/:page", verifyToken, AccountController.getAllOldUsers);
account_router.delete("/:id", verifyToken, AccountController.deleteUser);
account_router.delete(
  "/permanently-delete/:id",
  verifyToken,
  AccountController.permanentlyDeletUser
);
account_router.get("/restore/:id", verifyToken, AccountController.restoreUser);
module.exports = account_router;
