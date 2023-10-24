import { useEffect, useState } from "react";
import EmailInput from "~/Components/EmailInput";
import OTPInput from "~/Components/OTPInput";
import ToastMessage from "~/Components/ToastMessage";
import LoginSlidebar from "~/layouts/LoginSlidebar";
import {
  ChangePassword,
  checkmail,
  ForgotChangePassword,
  ForgotgetOTP,
  GetOTP,
} from "~/service/AccountService";
import getRole from "~/service/RoleService";

function ForgotPassword() {
  const role = getRole();
  const [type, setType] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const role = getRole();
    if (role.token) {
      setEmail(role.email);
      setIsValid(true);
      async function fetchData() {
        const rs = await GetOTP(email);
        if (!rs.success) {
          setType("ERROR");
          setMessage(rs.message);
          setIsValid(false);
        }
      }
      fetchData();
    }
  }, []);
  const handleGetEmail = async (email) => {
    setEmail(email);
    const checkmailResult = await checkmail(email);
    if (checkmailResult.success) {
      setType("SUCCESS");
      setIsValid(true);
      const otpResult = await ForgotgetOTP(email);
      if (!otpResult.success) {
        setType("ERROR");
        setIsValid(false);
        setMessage(otpResult.message);
      }
    } else {
      setType("ERROR");
      setMessage(checkmailResult.message);
    }
};


  const handleClose = () => {
    setMessage("");
  };
  const handleSubmit = async (pW, rePass, otp) => {
    if (pW === rePass) {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\s).{8,20}$/;
      const isValidPassword = regex.test(pW);
      if (isValidPassword) {
        if (role.token) {
          const rs = await ChangePassword(pW, otp);
          if (rs.success) {
            setType("SUCCESS");
          } else {
            setType("ERROR");
          }
          setMessage(rs.message);
        } else {
          const rs = await ForgotChangePassword(email, pW, otp);
          if (rs.success) {
            setType("SUCCESS");
          } else {
            setType("ERROR");
          }
          setMessage(rs.message);
        }
      } else {
        setType("ERROR");
        setMessage(
          "Password must be between 8 and 20 characters, include at least 1 letter and 1 number and do not include spaces."
        );
      }
    } else {
      setType("ERROR");
      setMessage("Passwords are not the same");
    }
  };
  return (
    <LoginSlidebar>
      {message && (
        <ToastMessage type={type} message={message} hide={handleClose} />
      )}
      {isValid ? (
        <OTPInput submit={handleSubmit} email={email} />
      ) : (
        <EmailInput getEmail={handleGetEmail} />
      )}
    </LoginSlidebar>
  );
}

export default ForgotPassword;
