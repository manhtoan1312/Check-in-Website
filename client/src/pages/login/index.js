import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginSlidebar from "~/layouts/LoginSlidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { login } from "~/service/AccountService";
import { useAuth } from "~/hooks/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [hide, setHide] = useState(true);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth(); 

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleRemember = (e) => {
    setRemember((pre) => !pre);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const changeTypePassword = () => {
    setHide((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(email, password);

    if (response.success) {
      let checked = false;
      if (document.querySelector("#remember").checked) {
        checked = true;
      }
      contextLogin(checked, response.token);
      navigate("/checkin");
    } else {
      setErrorMessage(response.message);
      setEmail("");
      setPassword("");
      document.querySelector("#floating_email").focus();
    }
  };

  return (
    <LoginSlidebar>
      <div className="py-32 lg:h-full">
        <div className="text-center">
          <h1 className="text-[#676767] text-[64px] font-mono mb-[16px]">
            SIGN IN
          </h1>
        </div>
        <div className="px-10 lg:px-[100px]">
          <form onSubmit={handleLogin}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="email"
                name="floating_email"
                id="floating_email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-[#676767] dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={email}
                required
                onChange={handleEmail}
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>
            <div className="relative flex items-center z-0 w-full mb-6 group">
              <input
                type={hide ? "password" : "text"}
                name="floating_password"
                id="floating_password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-[#676767] dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={password}
                onChange={handlePassword}
              />
              <label
                htmlFor="floating_password"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
              <div className="absolute right-2.5 top-2.5">
                <FontAwesomeIcon
                  onClick={changeTypePassword}
                  icon={hide ? faEyeSlash : faEye}
                />
              </div>
            </div>
            <div className="grid items-start mb-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center mr-4">
                  <input
                    checked={remember}
                    id="remember"
                    type="checkbox"
                    onChange={handleRemember}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm font-medium text-gray-900 "
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgotpassword"
                  className="ml-2 text-sm font-medium text-gray-900 hover:cursor-pointer text-right"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            {ErrorMessage && <p className="text-red-700">{ErrorMessage}</p>}
            <div className="pt-[32px] flex items-center justify-center">
              <button
                type="submit"
                className="focus:outline-none w-full md:w-[400px] lg:w-[280px] text-white bg-[#01CFDC] hover:bg-[#039DA7] focus:ring-4 focus:ring-[#03DEEC] font-medium rounded-lg text-sm px-5 py-2.5 focus:mt-[4px] focus:scale-[0.95] shadow-xl focus:shadow-none dark:focus:ring-[#004D52]"
              >
                SIGN IN
              </button>
            </div>
          </form>
        </div>
      </div>
    </LoginSlidebar>
  );
}

export default Login;
