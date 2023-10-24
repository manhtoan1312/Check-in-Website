import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotgetOTP } from "~/service/AccountService";
import ToastMessage from "./ToastMessage";
import getRole from "~/service/RoleService";
export default function OTPInput({ submit, email }) {
  const [otp, setOtp] = useState("");
  const [pW, setPW] = useState("");
  const [rePass, setRePass] = useState("");
  const [hide, setHide] = useState(true);
  const [hideRe, setHideRe] = useState(true);
  const [count, setCount] = useState(60);
  const [type, setType] = useState("");
  const [message,setMessage]= useState('')
  const navigate = useNavigate();
  const role = getRole()
  function handleToLoginPage(e) {
    navigate("/");
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    submit(pW, rePass, otp);
  };
  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [count]);
  const handleReSendOTP = async () => {
    if (count === 0) {
      setCount(60)
      const rs = await ForgotgetOTP(email);
      if (rs.success) {
        setType("SUCCESS");
      } else {
        setType("ERROR");
        setMessage(rs.message);
      }
    }
  };

  const handleClose = () => {
    setMessage("");
  };
  return (
    <>
      {message && (
        <ToastMessage type={type} message={message} hide={handleClose} />
      )}
      <div className="py-20 ">
        <div className="text-center text-[48px] uppercase font-semibold pb-8 text-[#575757] ">
          change password
        </div>
        <div className="px-10 lg:px-[120px] text-gray-600">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="otp"
                id="otp"
                onChange={(e) => setOtp(e.target.value)}
                className="block pt-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={otp}
              />
              <label
                htmlFor="otp"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                OTP
              </label>
            </div>
            <div className="relative flex items-center z-0 w-full mb-6 group">
              <input
                type={hide ? "password" : "text"}
                name="password"
                id="password"
                className="block pt-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-[#676767] dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={pW}
                onChange={(e) => setPW(e.target.value)}
              />
              <label
                htmlFor="password"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                New Password
              </label>
              <div className="absolute right-2.5 top-1.5">
                <FontAwesomeIcon
                  onClick={() => setHide((pre) => !pre)}
                  icon={hide ? faEyeSlash : faEye}
                />
              </div>
            </div>

            <div className="relative flex items-center z-0 w-full mb-6 group">
              <input
                type={hideRe ? "password" : "text"}
                name="password2"
                id="password2"
                className="block pt-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-[#676767] dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={rePass}
                onChange={(e) => {
                  setRePass(e.target.value);
                }}
              />
              <label
                htmlFor="password2"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Re-Enter New Password
              </label>
              <div className="absolute right-2.5 top-1.5">
                <FontAwesomeIcon
                  onClick={() => setHideRe((pre) => !pre)}
                  icon={hideRe ? faEyeSlash : faEye}
                />
              </div>
            </div>
            <div>OTP was sent, please check your email</div>
            <button
              type="submit"
              className="focus:outline-none w-full text-base text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-400 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:focus:ring-green-900"
            >
              Submit  
            </button>
          </form>
          <div
            onClick={handleReSendOTP}
            className={`justify-center flex pt-6 ${
              count === 0
                ? "text-[#0072B2] cursor-pointer"
                : "text-[#8aabbe] cursor-default"
            }`}
          >
            Haven't received email yet? Send again
            {count === 0 ? "" : `(${count})`}
          </div>
          <div className="flex justify-center items-center pt-4">
            {role.token ? '' :'Just remembered?'}
          </div>
          <div
            onClick={handleToLoginPage}
            className="flex text-center cursor-pointer justify-center text-[#01CFDC] font-semibold uppercase"
          >
            {role.token ? 'Back To Home Page' :'Sign In'}
          </div>
        </div>
      </div>
    </>
  );
}
