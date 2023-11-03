import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState , useCallback} from "react";
import { Fragment } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
export default function StatisticDetail({ detail }) {
  // console.log(detail)
  const [typeEmployee, setTypeEmployee] = useState("Ontime Employees");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [col, setCol] = useState(3);
  const DropdownRef = useRef(null);
  function formatDateISOToDDMMYYYY(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const rowLength = (item) => {
    if (typeEmployee === "Late Employees") {
      return item.lateEmployees.length + 1;
    } else if (typeEmployee === "Ontime Employees") {
      return item.onTimeEmployees.length + 1;
    } else {
      return item.onLeave.length + 1;
    }
  };

  const handleTypeEmployees = useCallback(
    (type) => {
      setIsDropdownOpen(false);
      setTypeEmployee(type);
    },
    [setIsDropdownOpen, setTypeEmployee]
  );

  useEffect(() => {
    if (typeEmployee === "Ontime Employees") {
      setCol(3);
    } else if (typeEmployee === "Late Employees") {
      setCol(4);
    } else {
      setCol(2);
    }
  }, [typeEmployee]);
  useEffect(()=> {
    const handleClickOutside = (event) => {
      if (
        DropdownRef.current &&
        !DropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  },[])

  return (
    
    <table className="md:w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-white sticky top-0 uppercase bg-[#06B5C0] dark:bg-[#06B5C0] dark:text-white">
      <tr>
        <th scope="col" rowSpan="2" className="md:px-6 px-4 py-3">
          Day
        </th>
        <th scope="col" rowSpan="2" className="md:px-6 px-4 py-3">
          Total Checkins
        </th>
        <th scope="col" rowSpan="2" className="md:px-6 px-4 py-3">
          Ontime
        </th>
        <th scope="row" rowSpan="2" className="md:px-6 px-4 py-3">
          Late
        </th>
        <th scope="col" rowSpan="2" className="md:px-6 px-4 py-3">
          Leave
        </th>
        <th scope="col" rowSpan="2" className="md:px-6 px-4 py-3">
          Total Fine
        </th>
        <th
          scope="col"
          colSpan={col}
          className="md:px-2 relative px-4 py-2"
          ref={DropdownRef}
        >
          <div className="flex items-center justify-center">
            <div>{typeEmployee}</div>
            <FontAwesomeIcon
              className=" p-2 absolute text-xl cursor-pointer top-0 right-0"
              icon={faAngleDown}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
              <div
                className="block font-normal px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                onClick={() => handleTypeEmployees("Ontime Employees")}
              >
                Ontime Employees
              </div>
              <div
                className="block font-normal px-4 py-2 text-sm text-gray-700 hover.bg-gray-100 hover:text-gray-900 cursor-pointer"
                onClick={() => handleTypeEmployees("Late Employees")}
              >
                Late Employees
              </div>
              <div
                className="block font-normal px-4 py-2 text-sm text-gray-700 hover.bg-gray-100 hover:text-gray-900 cursor-pointer"
                onClick={() => handleTypeEmployees("Leave Employees")}
              >
                Leave Employees
              </div>
            </div>
          </div>
        </th>
      </tr>
      <tr>
        <th scope="col" className="md:px-6 px-4 py-3">
          Email
        </th>
        <th scope="col" className="md:px-6 px-4 py-3">
          Name
        </th>
        {typeEmployee !== "Leave Employees" && (
          <th scope="col" className="md:px-6 px-4 py-3">
            Time
          </th>
        )}
        {typeEmployee === "Late Employees" && (
          <th scope="col" className="md:px-6 px-4 py-3">
            Fine
          </th>
        )}
      </tr>
    </thead>
    <tbody>
      {detail &&
        detail?.map((item, index) => (
          <Fragment key={index}>
            <tr className="border-y-2">
              <th
                rowSpan={rowLength(item)}
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {formatDateISOToDDMMYYYY(item.day)}
              </th>
              <th
                rowSpan={rowLength(item)}
                className="md:px-6 px-4 py-4 font-normal"
              >
                {item.totalCheckins}
              </th>
              <th
                rowSpan={rowLength(item)}
                className="md:px-6 px-4 py-4 font-normal"
              >
                {item.onTimeCheckins}
              </th>
              <th
                rowSpan={rowLength(item)}
                className="md:px-6 px-4 py-4 font-normal"
              >
                {item.lateCheckins}
              </th>
              <th
                rowSpan={rowLength(item)}
                className="md:px-6 px-4 py-4 font-normal"
              >
                {item.totalOff}
              </th> 
              <th
                rowSpan={rowLength(item)}
                className="md:px-6 px-4 py-4 font-normal border-r-2"
              >
                {item.totalFees}
              </th>
            </tr>
            {typeEmployee === "Ontime Employees" &&
              item.onTimeEmployees.map((employee, empIndex) => (
                <tr
                  className="dark:bg-gray-800 border-y-2 dark:border-gray-700 bg-white"
                  key={empIndex}
                >
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.email}
                  </th>
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.name}
                  </th>
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.time}
                  </th>
                </tr>
              ))}
            {typeEmployee === "Late Employees" &&
              item.lateEmployees.map((employee, empIndex) => (
                <tr
                  className=" dark:bg-gray-800 border-y-2 dark:border-gray-700 bg-white"
                  key={empIndex}
                >
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.email}
                  </th>
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.name}
                  </th>
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.time}
                  </th>
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.fee}
                  </th>
                </tr>
              ))}
            {typeEmployee === "Leave Employees" &&
              item.onLeave.map((employee, empIndex) => (
                <tr
                  className=" dark:bg-gray-800 border-y-2 dark:border-gray-700 bg-white"
                  key={empIndex}
                >
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.email}
                  </th>
                  <th className="md:px-2 px-4 py-4 font-normal">
                    {employee.name}
                  </th>
                </tr>
              ))}
          </Fragment>
        ))}
    </tbody>
  </table>
  );
}
