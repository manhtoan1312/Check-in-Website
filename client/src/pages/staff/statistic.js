import { useEffect, useState, useRef } from "react";
import MessageBox from "~/Components/MessageBox";
import {
  DownloadPersonalbyDate,
  DownloadPersonalFile,
  GetPersonalWorkday,
  getWorkDaybyDate,
} from "~/service/StatisticService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleDown,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import getRole from "~/service/RoleService";
import PersonalStatistic from "~/Components/PersonalStatistic";
function Statistic() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const now = new Date();
  const year = now.getFullYear();
  const [detail, setDetail] = useState([]);
  const [summary, setSummay] = useState([]);
  const [startDate, setStartDate] = useState(
    `${now.getFullYear()}-${now.getMonth()}-01`
  );
  const [endDate, setEndDate] = useState(formatDateToYYYMMDD(now));
  const [endMonth, setEndMonth] = useState(endDate);
  const [month, setMonth] = useState(months[now.getMonth()]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [period, setPeriod] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dropdownRef = useRef(null);

  async function getWorkday(month) {
    const response = await GetPersonalWorkday(month);
    if (response.success) {
      setDetail(response.detail);
      setSummay(response.summary);
    } else {
      setErrorMessage(response.message);
    }
  }

  
  function formatDateToYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    getWorkday(now.getMonth() + 1);
    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);
  useEffect(() => {
    const monthIndex = months.findIndex((item) => item === month);
    getWorkday(monthIndex + 1);
    setStartDate(formatDateToYYYMMDD(new Date(year, monthIndex)));
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
    const end = monthIndex === now.getMonth() ? now : lastDayOfMonth;
    setEndDate(formatDateToYYYMMDD(end));
    setEndMonth(formatDateToYYYMMDD(end));
  }, [month]);
  const handleLogin = () => {
    setErrorMessage("");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMonthSelect = (month) => {
    setMonth(month);
    setIsDropdownOpen(false);
  };

  const handleGlobalClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };
  const handleSearch = async () => {
    const response = await getWorkDaybyDate(startDate,endDate);
    if (response.success) {
      setDetail(response.detail);
      setSummay(response.summary);
    } else {
      setErrorMessage(response.message);
    }
  }

  const handleDownloadFile = async () => {
    const role = getRole();
    const monthIndex = months.findIndex((item) => item === month);
    if (period) {
      const rs = await DownloadPersonalbyDate(startDate,endDate);
      if (!rs?.success) {
        setErrorMessage(rs?.message);
      }
    } else {
      const rs = await DownloadPersonalFile(role.email, monthIndex + 1);
      if (!rs?.success) {
        setErrorMessage(rs?.message);
      }
    }
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
    <div className="w-full lg:px-48 px-3">
      <div className="w-full pt-16 flex md:flex-row flex-col-reverse justify-end md:gap-4 gap-2">
        <div className="w-full flex justify-end">
        <div className="relative md:inline-block w-32 text-left" ref={dropdownRef}>
          <div
            className="border border-gray-300 rounded-md p-2 flex items-center justify-between cursor-pointer"
            onClick={toggleDropdown}
          >
            {month}
            <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
          </div>
          <div
            className={`origin-top-right absolute right-0 mt-2 w-32 z-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
              isDropdownOpen ? "block" : "hidden"
            }`}
          >
            <div
              className=""
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {months.map((month) => (
                <div
                  key={month}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                  onClick={() => handleMonthSelect(month)}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
        <div className="flex flex-row justify-end">
          <div className="w-[120px] h-10">
            <label
              htmlFor="start-date"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="start-date"
                value={startDate}
                min={`${year}-${month}-01`}
                max={endDate}
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPeriod(true);
                }}
                className="block w-full p-2 pl-2 text-sm text-gray-900 border border-gray-300 border-r-0 rounded-tl-2xl rounded-bl-2xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-gray-300 hover:border-gray-300"
              />
            </div>
          </div>

          <div className="w-[120px] h-12">
            <label
              htmlFor="end-date"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="end-date"
                value={endDate}
                min={startDate}
                max={endMonth}
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPeriod(true);
                }}
                className="block w-full p-2 pl-2 text-sm text-gray-900 border border-gray-300 border-l-0 rounded-tr-2xl rounded-br-2xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-gray-300 hover:border-gray-300"
              />
            </div>
          </div>
          <div className=" h-10 w-10 flex items-center justify-center cursor-pointer">
            <div
              className="inline-block p-2 rounded-full"
              onClick={handleSearch}
            >
              <FontAwesomeIcon
                icon={faSearch}
                className={`transition-transform transform hover:scale-110`}
              />
            </div>
          </div>
        </div>
      </div>
      <PersonalStatistic detail={detail} summary={summary} />
      <div className="flex justify-end mt-10 w-full">
        <button
          type="button"
          onClick={handleDownloadFile}
          className="text-gray-900 absolute shadow bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          <FontAwesomeIcon className="pr-2" icon={faDownload} />
          Download file
        </button>
      </div>
    </div>
  );
}

export default Statistic;
