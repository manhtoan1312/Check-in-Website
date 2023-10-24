import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MessageBox from "~/Components/MessageBox";
import {
  faAngleDown,
  faEllipsis,
  faSearch,
  faRotateLeft,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  GetOldEmployee,
  PermanentlydeleteEmployee,
  RestoreEmployee,
  SearchUnactiveEmployees,
} from "~/service/AccountService";

export default function OldEmployee() {
  const [oldEmployees, setOldEmployees] = useState([]);
  const [checkArr, setCheckArr] = useState([]);
  const roleList = ["ROLE", "MANAGER", "STAFF"];
  const [role, setRole] = useState("ROLE");
  const [select, setSelect] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToRestore, setItemToRestore] = useState(null);
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchData();
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    const rs = await GetOldEmployee();
    if (rs.success) {
      setOldEmployees(rs.data);
    } else {
      setTitle("TMA CHECKIN ANNOUNCEMENT");
      setDesc(rs.message);
    }
  };

  const filterEmployeesByRole = (selectedRole) => {
    if (selectedRole === "ROLE") {
      setFilteredEmployees(oldEmployees);
    } else {
      const filtered = oldEmployees.filter(
        (employee) => employee.role === selectedRole
      );
      setFilteredEmployees(filtered);
    }
  };

  useEffect(() => {
    filterEmployeesByRole(role);
  }, [role, oldEmployees]);

  const handleSearch = async (e) => {
    if (e.target.value === "") {
      fetchData();
    } else {
      const rs = await SearchUnactiveEmployees(e.target.value);
      if (rs.success) {
        setOldEmployees(rs.result);
      } else {
        setTitle("TMA CHECKIN ANNOUNCEMENT");
        setDesc(rs?.message);
      }
    }
  };

  const handleCheckboxClick = (employeeId) => {
    if (checkArr.includes(employeeId)) {
      const updatedCheckArr = checkArr.filter((id) => id !== employeeId);
      setCheckArr(updatedCheckArr);
    } else {
      setCheckArr([...checkArr, employeeId]);
    }
  };

  const handleOptionClick = (index) => {
    const updatedOptionStates = [...isOptionOpen];
    updatedOptionStates[index] = !updatedOptionStates[index];
    setIsOptionOpen(updatedOptionStates);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckArr([]);
    } else {
      const allEmployeeIds = filteredEmployees.map((item) => item._id);
      setCheckArr(allEmployeeIds);
    }
    setSelectAll(!selectAll);
  };

  const submitDelete = async () => {
    const result = await PermanentlydeleteEmployee(itemToDelete._id);
    if (result.success) {
      setTitle("TMA CHECKIN ANNOUNCEMENT");
      setDesc(result.message);
    } else {
      setTitle("TMA CHECKIN ANNOUNCEMENT");
      setDesc(result.message);
    }
  };
  const submitRestore = async () => {
    const result = await RestoreEmployee(itemToRestore._id);
    if (result.success) {
      setTitle("TMA CHECKIN ANNOUNCEMENT");
      setDesc(result.message);
    } else {
      setTitle("TMA CHECKIN ANNOUNCEMENT");
      setDesc(result.message);
    }
  };

  const handleDeleteBtn = async () => {
    const message = await deleteCheckArr();
    setTitle("TMA CHECKIN ANNOUNCEMENT");
    setDesc(message);
  };

  const handleRestore = async () => {
    const message = await restoreCheckArr();
    setTitle("TMA CHECKIN ANNOUNCEMENT");
    setDesc(message);
  };
  const restoreCheckArr = async () => {
    if (checkArr.length > 0) {
      const restorePromises = checkArr.map((item) => RestoreEmployee(item));
      const results = await Promise.all(restorePromises);
      if (results.every((result) => result.success)) {
        return "Successful recovery";
      } else {
        return "An error occurred when recovering some items";
      }
    }
    return "No items selected for restoration.";
  };
  const deleteCheckArr = async () => {
    if (checkArr.length > 0) {
      const restorePromises = checkArr.map((item) => PermanentlydeleteEmployee(item));
      const results = await Promise.all(restorePromises);
      if (results.every((result) => result.success)) {
        return "Successful deleted";
      } else {
        return "An error occurred when deleting some items";
      }
    }
    return "No items selected for deletion";
  };

  const handleCancel = () => {
    setDesc("");
    if (title === "TMA CHECKIN ANNOUNCEMENT") {
      fetchData();
    }
  };
  const handleDeleteOptionClick = async (item) => {
    setItemToDelete(item);
    setTitle(`CONFIRM PERMANENTLY DELETE EMPLOYEE`);
    setDesc(`Are you sure you want to permanently delete email ${item.email}?`);
  };
  const handleRestoreOptionClick = async (item) => {
    setItemToRestore(item);
    setTitle(`CONFIRM RESTORE EMPLOYEE`);
    setDesc(`Are you sure you want to restore email ${item.email}?`);
  };
  return (
    <div className="md:px-20 px-5">
      {desc && (
        <MessageBox
          confirm={() => {
            if (title === "TMA CHECKIN ANNOUNCEMENT") {
              handleCancel();
            } else if (title === "CONFIRM PERMANENTLY DELETE EMPLOYEE") {
              submitDelete();
            } else if (title === "CONFIRM RESTORE EMPLOYEE") {
              submitRestore();
            }
          }}
          cancel={handleCancel}
          description={desc}
          title={title}
        />
      )}
      <div className="w-full h-full relative pt-10 ">
        <div className="py-5">
          <h2 className="font-medium text-2xl text-gray-700 w-full flex justify-center uppercase">
            OLD EMPLOYEES MANAGEMENT
          </h2>
        </div>
        <div className={`${select ? "flex justify-between w-full" : ""}`}>
          {select && (
            <div className="w-full flex md:flex-row flex-col-reverse min-h-[120px] md:min-h-0">
              <div>
                <div className="flex h-full items-center mx-2 ">
                  <input
                    id="checked-checkbox"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    all
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRestore()}
                className="text-[#00BAC6] hover:text-white w-[120px] mr-2 border border-[#00BAC6] hover:bg-[#10959e] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >
                <FontAwesomeIcon className="pr-2" icon={faRotateLeft} />
                Restore
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBtn()}
                className="text-red-700 hover:text-white w-[120px] border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                <FontAwesomeIcon className="pr-2" icon={faTrashCan} />
                Delete
              </button>
            </div>
          )}
          <div className="w-full flex md:justify-end md:flex-row flex-col items-end min-h-[120px] md:min-h-0">
            <button
              type="button"
              onClick={() => setSelect(!select)}
              className="text-[#00BAC6] hover:text-white flex items-center border border-[#00BAC6] hover:bg-[#10959e] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              {select ? "Unselect" : "Select Multiple"}
            </button>
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
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto max-h-[500px] min-h-[200px] mt-5">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-10">
          <thead className="text-xs text-gray-700 sticky top-0 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {select && <th scope="col" className="px-2 py-3"></th>}
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3 relative">
                <div
                  className="flex justify-center items-center"
                  ref={dropdownRef}
                >
                  {role}
                  <FontAwesomeIcon
                    className="pl-2 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    icon={faAngleDown}
                  />
                </div>
                <div
                  className={`absolute mt-2 top-9 w-full z-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                    isDropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <div
                    className=""
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {roleList.map((item) => (
                      <div
                        key={item}
                        className="block font-normal px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        onClick={() => {
                          setRole(item);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                {select && (
                  <td
                    scope="row"
                    className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxClick(item._id)}
                      checked={checkArr.includes(item._id)}
                      className="w-4 h-4 text-green-600 cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                )}
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.email}
                </td>
                <td className="px-6 py-4">{item.user.name}</td>
                <td className="px-6 py-4 flex justify-center">
                  {item.role === "MANAGER" && (
                    <button
                      type="button"
                      className="text-white cursor-auto bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                      {item.role}
                    </button>
                  )}
                  {item.role === "STAFF" && (
                    <button
                      type="button"
                      className="text-white cursor-auto bg-[#00BAC6] hover:bg-[#0095a0] focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover-bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {item.role}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">{item.user.gender}</td>
                <td className="px-6 py-4">{item.user.phone}</td>
                <td className="px-6 py-4">{item.user.address}</td>
                <td className="px-6 py-4 relative">
                  <div className="text-gray-900 cursor-pointer bg-white border py-1 rounded-2xl flex justify-center  border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    <FontAwesomeIcon
                      onClick={() => {
                        handleOptionClick(index);
                      }}
                      className="text-xl"
                      icon={faEllipsis}
                    />
                  </div>
                  {isOptionOpen[index] && (
                    <div className="absolute top-12 right-10 w-40 z-10 bg-white ring-1 ring-black ring-opacity-5 shadow-lg rounded-md">
                      <div
                        className="text-gray-700 hover:bg-gray-100 cursor-pointer px-4 py-2"
                        onClick={() => {
                          handleDeleteOptionClick(item);
                        }}
                      >
                        Delete
                      </div>
                      <div
                        className="text-gray-700 hover-bg-gray-100 cursor-pointer px-4 py-2"
                        onClick={() => {
                          handleRestoreOptionClick(item);
                        }}
                      >
                        Restore
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
