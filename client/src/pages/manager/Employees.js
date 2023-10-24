import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import EmpTable from "~/Components/EmpTable";

const { useState, useEffect } = require("react");
const { Link } = require("react-router-dom");
const { default: MessageBox } = require("~/Components/MessageBox");
const {
  getAllActiveUser,
  searchActiveEmployees,
} = require("~/service/AccountService");

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const fetchData = async () => {
    const response = await getAllActiveUser();
    if (response.success) {
      setEmployees(response.data);
    } else {
      setErrorMessage(response.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleSubmit = () => {
    setErrorMessage("");
  };

  const handleSearch = async (e) => {
    if (e.target.value === "") {
      fetchData();
    } else {
      const rs = await searchActiveEmployees(e.target.value);
      if (rs.success) {
        setEmployees(rs?.result);
      } else {
        setErrorMessage(rs?.message);
      }
    }
  };

  if (errorMessage) {
    return (
      <MessageBox
        show={true}
        confirm={handleSubmit}
        cancel={handleSubmit}
        title="Error"
        description={errorMessage}
      />
    );
  }
  return (
    <div>
      <div className="w-full h-full relative pt-10 md:px-20 px-5">
        <div className="py-5">
          <h2 className="font-medium  text-2xl text-gray-700 w-full flex justify-center uppercase">
            EMPLOYEES MANAGEMENT
          </h2>
        </div>

        <div className="w-full flex justify-end md:flex-row flex-col items-end">
          <div className="relative w-[300px] md:mx-5 mb-2">
            <input
              type="text"
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              placeholder="Search employee or email..."
              onChange={(e) => handleSearch(e)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 -mt-0.5">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          <Link
            type="button"
            to={"/insert-employee"}
            className="text-[#00BAC6] hover:text-white border border-[#00BAC6] hover:bg-[#10959e] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            Insert Employee
          </Link>
        </div>
        <div className="">
          <EmpTable employees={employees} />
        </div>
      </div>
    </div>
  );
};

export default Employees;
