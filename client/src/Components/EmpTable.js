import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import { deleteEmployee } from "~/service/AccountService";
import { useNavigate } from "react-router-dom";
const EmpTable = ({ employees }) => {
  const roleList = ["ROLE", "MANAGER", "STAFF"];
  const [role, setRole] = useState("ROLE");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const filterEmployeesByRole = (selectedRole) => {
    if (selectedRole === "ROLE") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) => employee.role === selectedRole
      );
      setFilteredEmployees(filtered);
    }
  };
  useEffect(() => {
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

  useEffect(() => {
    filterEmployeesByRole(role);
  }, [role, employees]);

  const deleteEmp = async (e, item) => {
    e.preventDefault();
    setItemToDelete(item);
    setTitle("CONFIRM DELETE EMPLOYEE");
    setDesc(
      `Are you sure you want to delete the employee with email ${item.email}?`
    );
  };
  const submitDelete = async () => {
    const result = await deleteEmployee(itemToDelete._id);
    if (result.success) {
      setTitle("TMA CHECKIN ANNOUNCEMENT");
      setDesc(result.message);
    } else {
      setTitle("ACTION FAILED");
      setDesc(result.message);
    }
  };
  const handleUpdate = (_id) => {
    navigate(`/update/${_id}`);
  };
  const handleCancel = () => {
    setDesc("");
    if (title === "TMA CHECKIN ANNOUNCEMENT") {
      window.location.reload();
    }
  };
  return (
    <div>
      {desc && (
        <MessageBox
          confirm={
            title === "CONFIRM DELETE EMPLOYEE" ? submitDelete : handleCancel
          }
          cancel={handleCancel}
          description={desc}
          title={title}
        />
      )}
      <div className="relative overflow-x-auto max-h-[500px] min-h-[200px] mt-5">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 sticky top-0 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
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
                  className={`absolute mt-2 top-9  w-full z-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
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
                onClick={() => handleUpdate(item._id)}
                className="bg-white border-b hover:bg-gray-300 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
              >
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
                      className="text-white cursor-auto bg-[#00BAC6] hover:bg-[#0095a0] focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {item.role}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">{item.user.gender}</td>
                <td className="px-6 py-4">{item.user.phone}</td>
                <td className="px-6 py-4">{item.user.address}</td>
                <td
                  className="px-6 py-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEmp(e, item);
                  }}
                >
                  <FontAwesomeIcon
                    className="text-xl cursor-pointer"
                    icon={faTrashCan}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpTable;
