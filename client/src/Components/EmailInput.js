import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmailInput({ getEmail}) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  function handleToLoginPage(e) {
    navigate("/");
  }
function handleGetOTP(e){
    e.preventDefault();
    getEmail(email)
}
  return (
    <div className="py-20 ">
        <div className="text-center text-[48px] font-semibold pb-8 text-[#575757] ">
          Forgot Password?
        </div>
        <p className="px-8 lg:px-[100px] pb-3 text-[#575757]">
          Don't worries! just enter your email and we'll send you a OTP code to
          reset password!!!
        </p>
        <div className="px-10 lg:px-[150px] text-gray-600">
          <form onSubmit={(e) => handleGetOTP(e)}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="email"
                name="floating_email"
                id="floating_email"
                onChange={(e) => setEmail(e.target.value)}
                className="block pt-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={email}
              />
              <label
                htmlFor="floating_email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>

            <button
              type="submit"
              className="focus:outline-none w-full text-base text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-400 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:focus:ring-green-900"
            >
              Submit
            </button>
          </form>
          <div className="flex justify-center items-center pt-7">
            Just remembered?
          </div>
          <div
            onClick={handleToLoginPage}
            className="flex text-center cursor-pointer justify-center text-[#01CFDC] font-semibold uppercase"
          >
            Sign In
          </div>
        </div>
      </div>
  );
}

export default EmailInput;