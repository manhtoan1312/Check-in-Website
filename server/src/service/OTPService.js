const otpGenerator = require("otp-generator");
module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};

const OTP_LENGTH = 6;
const OTP_CONFIG = {
  upperCaseAlphabets: true,
  specialChars: false,
};
