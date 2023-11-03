import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import EmpTable from "~/Components/EmpTable";

const { useState, useEffect, useRef } = require("react");
const { Link } = require("react-router-dom");
const { default: MessageBox } = require("~/Components/MessageBox");
const {
  getAllActiveUser,
  searchActiveEmployees,
} = require("~/service/AccountService");

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(0);
  const tableRef = useRef(null);
  const firstItemRef = useRef(null);
  const fetchData = async () => {
    const result = await getAllActiveUser(page);
    setLoading(false);
    if (result.success) {
      if (page === 1) {
        setEmployees(result.data);
      } else {
        setEmployees([...employees, ...result.data]);
      }
      setSize(result.size);
      setPage(page + 1);
    } else {
      setErrorMessage(result.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const handleTableScroll = () => {
        const table = tableRef.current;
        const scrollPosition = table.scrollTop + table.clientHeight;
        const isAtBottom = scrollPosition >= table.scrollHeight;
        if (isAtBottom && !loading && employees.length < size) {
          setLoading(true);
          if (key === "") {
            fetchData();
          } else {
            searchNext();
          }
        }
      };
      tableRef.current.addEventListener("scroll", handleTableScroll);

      return () => {
        if (tableRef.current) {
          tableRef.current.removeEventListener("scroll", handleTableScroll);
        }
      };
    }
  }, [loading, employees, size, tableRef, key]);

  const handleSubmit = () => {
    setErrorMessage("");
    setPage(1);
    setKey("");
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setKey(searchTerm);
    setEmployees([]);
    setPage(1);
    if (e.target.value === "") {
      const result = await getAllActiveUser(1);
      setLoading(false);
      if (result.success) {
          setEmployees(result.data);
          setSize(result.size)
      } else {
        setErrorMessage(result.message);
      }
    } else {
      const rs = await searchActiveEmployees(searchTerm, 1);
      if (rs.success) {
        setEmployees(rs.data);
        setSize(rs.size);
        setPage(2)
      } else {
        setErrorMessage(rs?.message);
      }
    }
  };

  const searchNext = async () => {
    const result = await searchActiveEmployees(key, page);
    if (result.success) {
      setEmployees([...employees, ...result.data]);
      setPage(page+1);
    } else {
      setErrorMessage(result.message);
    }
    setLoading(false);
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
      <div className="w-full h-full pt-10 md:px-20 px-5 ">
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
              value={key}
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
        <div
          ref={tableRef}
          className="overflow-x-auto max-h-[500px] min-h-[200px] mt-5"
        >
          <EmpTable employees={employees} firstItemRef={firstItemRef}/>
        </div>
      </div>
    </div>
  );
};

export default Employees;
