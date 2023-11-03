import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";
import { useState, useEffect, useRef } from "react";
import {
  faUser,
  faArrowRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getRole from "~/service/RoleService";
import SlideBar from "~/layouts/Slidebar";
function Mnavbar() {
  const unactive =
    "py-2 pl-3 pr-4 text-gray-900 rounded flex justify-center items-center hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#4DAEE5] md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
  const active =
    "h-full py-2 pl-3 pr-4 text-[#4DAEE5] flex items-center border-b-4 border-[#4DAEE5] h-full md:bg-transparent md:p-0 dark:text-white md:dark:text-blue-500";

  const location = useLocation();
  const navigate = useNavigate();
  const { logout: ContextLogout } = useAuth();
  const [activeButton, setActiveButton] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const slideRef = useRef(null);
  const role = getRole();
  useEffect(() => {
    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    setActiveButton(pathname.substring(1));
  }, [location]);
  const handleLogOutClick = (e) => {
    navigate("/");
    ContextLogout();
  };

  const handleGlobalClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
    if (slideRef.current && !slideRef.current.contains(e.target)) {
      setIsSlidebarOpen(false);
    }
  };

  const toggleUserDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const ActiveSlidebar = () => {
    setIsSlidebarOpen(!isSlidebarOpen);
  };
  return (
    <nav className="bg-white dark:bg-gray-900  fixed  w-full md:h-[80px] h-[60px] z-20 top-0 left-0 border-b-2 border-gray-200 dark:border-gray-600">
      <div className="relative z-50 w-full h-full">
        <div className="max-w-screen-xl flex flex-wrap  px-4 items-center h-full justify-between mx-auto ">
          <div className="flex flex-row h-full items-center ">
            <div className="h-full flex justify-center items-center pr-2">
              <FontAwesomeIcon
                className="text-[#1C348A] h-[30px] w-[30px] cursor-pointer"
                onClick={ActiveSlidebar}
                icon={faBars}
                ref={slideRef}
              />
              {isSlidebarOpen && <SlideBar open={isDropdownOpen} />}
            </div>
            <Link to="/checkin" className="flex items-center">
              <span className="self-center text-[#1C348A] text-2xl font-bold whitespace-nowrap dark:text-white">
                TMA CHECKIN
              </span>
            </Link>
          </div>
          <div className="md:order-2">
            <div>
              <Link
                onClick={toggleUserDropdown}
                ref={dropdownRef}
                type="button"
              >
                <FontAwesomeIcon
                  className="md:h-[30px] h-[25px]"
                  icon={faUser}
                ></FontAwesomeIcon>
              </Link>
            </div>
            <ul
              id="user"
              className={`absolute z-0 bg-white hover:cursor-pointer text-[16px] text-gray-800 shadow-xl ${
                isDropdownOpen ? "" : "hidden"
              } md:h-[180px] h-[128px] w-[180px] right-0 md:top-20 top-10`}
            >
              <li className="md:h-[60px] border-b-2 flex flex-col justify-center hover:bg-slate-200 ">
                <div className="ml-2">{role.name}</div>
                <div className="ml-2">{role.email}</div>
              </li>
              <li className="md:h-[40px] flex justify-center border-b-2 flex-col hover:bg-slate-200 ">
                <Link className="ml-2" to={"/information"}>
                  Information
                </Link>
              </li>
              <li className="md:h-[40px] border-b-2 flex justify-center flex-col hover:bg-slate-200 ">
                <Link className="ml-2" to={"/change-password"}>
                  Change Password
                </Link>
              </li>
              <li
                className="md:h-[40px] border-b-2 flex flex-row items-center hover:bg-slate-200 "
                onClick={handleLogOutClick}
              >
                <div className="ml-4">Sign Out</div>
                <FontAwesomeIcon
                  className="md:h-[20px] h-[20px] ml-4"
                  icon={faArrowRightFromBracket}
                ></FontAwesomeIcon>
              </li>
            </ul>
          </div>
          <div
            className="items-center justify-between h-full hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <div className="font-sans h-full font-bold text-[24px] flex flex-col px-2 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <div className={activeButton === "checkin" ? active : unactive}>
                <Link to="/checkin" aria-current="page">
                  CHECKIN
                </Link>
              </div>
              <div className={activeButton === "statistic" ? active : unactive}>
                <Link to="/statistic">STATISTIC</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Mnavbar;
