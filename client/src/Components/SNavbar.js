import { Link,useLocation } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";
import { useState, useEffect } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Snavbar(){
    const unactive =
    "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#4DAEE5] md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
  const active =
    "h-full block py-2 pl-3 pr-4 text-[#4DAEE5] border-b-4 border-[#4DAEE5] md:bg-transparent md:p-0 dark:text-white md:dark:text-blue-500";
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("");

  useEffect(() => {
    // Lấy pathname mới từ location
    const pathname = location.pathname;
    setActiveButton(pathname.substring(1));
  }, [location]);
  const handleLogOutClick = (e) => {
    
  };
  return (
    <nav className="bg-white dark:bg-gray-900  fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="relative w-full h-full">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center">
          <span className="self-center text-[#1C348A] text-2xl font-bold whitespace-nowrap dark:text-white">
            TMA CHECKIN
          </span>
        </Link>
        <div className="flex md:order-2">
          <Link
            onClick={handleLogOutClick}
            type="button"
          >
            <FontAwesomeIcon className="md:h-[30px] h-[25px]" icon={faUser}></FontAwesomeIcon>
          </Link>
          {/* <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button> */}
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="font-sans h-full font-bold text-[24px] flex flex-col px-2 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/checkin"
                className={activeButton === "checkin" ? active : unactive}
                aria-current="page"
              >
                CHECKIN
              </Link>
            </li>
            <li>
              <Link
                to="/statistic"
                className={activeButton === "statistic" ? active : unactive}
              >
                STATISTIC
              </Link>
            </li>
            
          </ul>
        </div>
      </div>
      </div>
    </nav>
  );
}

export default Snavbar