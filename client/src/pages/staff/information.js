import ToastMessage from "~/Components/ToastMessage";
import { useEffect, useState } from "react";
import { getInfor, updateInfor } from "~/service/AccountService";
import MessageBox from "~/Components/MessageBox";
function Information() {
  const [infor, setInfor] = useState({});
  const [change, setChange] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  let gender = ["male", "female", "Other..."];

  useEffect(() => {
    async function getData() {
      const rs = await getInfor();
      if (rs.success) {
        setInfor(rs.data);
        setSelectedGender(rs.data.gender);
      } else {
        setErrorMessage(rs.message);
      }
    }
    getData();
    gender = gender.filter((item) => item !== infor.gender);
  }, []);
  const handleInforChange = (e) => {
    const { name, value } = e.target;
    setInfor((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setChange(true);
  };

  const handleLogin = () => {
    setErrorMessage("");
  };
  async function updateInformation(e) {
    e.preventDefault();
    setType("");
    setMessage("");
    const rs = await updateInfor(
      infor.name,
      infor.phone,
      infor.gender,
      infor.address
    );
    if (rs.success) {
      setType("SUCCESS");
      setMessage(rs.message);
      setChange(false)
    } else {
      setType("ERROR");
      setMessage(rs.message);
    }
  }
  const handleClose = () => {
    setType("");
    setMessage("");
  };

  if (errorMessage) {
    return (
      <MessageBox
        show={true}
        confirm={handleLogin}
        cancel={handleLogin}
        title="Error"
        description={errorMessage}
      />
    );
  }

  return (
    <div className="w-full h-full bg-[#CBEFF6] flex justify-center">
      {type && (
        <ToastMessage type={type} message={message} hide={handleClose} />
      )}
      <div className="h-full md:w-[700px] w-[400px] bg-white flex justify-center">
        <div className="w-[800px] h-[600px] flex items-center flex-col">
          <div className="font-medium font-serif pt-40 md:text-4xl text-xl uppercase flex justify-center">
            <div>personal information</div>
          </div>
          <form className="w-[320px] mt-[48px] " onSubmit={updateInformation}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="name"
                id="name"
                className="block pt-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={handleInforChange}
                value={infor.name}
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Full Name*
              </label>
            </div>
            <div className="flex flex-row">
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="phone"
                  pattern="[0-9]{10}"
                  id="phone"
                  className="block pt-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={handleInforChange}
                  value={infor.phone}
                />
                <label
                  htmlFor="phone"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Phone Number*
                </label>
              </div>
              <div className="relative z-0 w-full ml-5 mb-6 group">
                <label
                  htmlFor="underline_select"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Gender
                </label>
                <select
                  id="underline_select"
                  name="gender"
                  className="block pt-3 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                  onChange={(e) => {
                    handleInforChange(e);
                    setSelectedGender(e.target.value);
                  }}
                  value={selectedGender}
                >
                  <option value="" disabled hidden>
                    Select Gender
                  </option>
                  {gender.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="z-0 w-full mb-6 group">
              <label
                htmlFor="address"
                className="block mb-2 text-sm text-gray-700 dark:text-white"
              >
                Address:
              </label>
              <textarea
                id="address"
                name="address"
                onChange={handleInforChange}
                rows="4"
                value={infor.address}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your address here so people can find you..."
              ></textarea>
            </div>
            <div className="flex items-center w-full justify-center">
              <button
                type="submit"
                disabled={!change}
                value="Submit"
                className={
                  change
                    ? "text-blue-600 w-[200px] hover:text-white border border-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                    : "text-white bg-blue-400 w-[200px] dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                }
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Information;
