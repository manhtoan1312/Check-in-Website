import { useEffect, useState, useRef, useCallback } from "react";
import {
  DownloadAllbyDate,
  getStatisticall,
  getWorkdayByEmail,
  MDownloadPbyDate,
  MgetAllbyDate,
  MgetWorkDaybyDate,
} from "~/service/StatisticService";
import MessageBox from "~/Components/MessageBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleDown,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { getAllActiveUser } from "~/service/AccountService";
import StatisticDetail from "~/Components/StatisticDetail";
import StatisticGeneral from "~/Components/StatisticGeneral";
import PersonalStatistic from "~/Components/PersonalStatistic";
export default function MStatisitc() {
  const now = new Date();
  const year = now.getFullYear();
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

  const [detail, setDetail] = useState([]);
  const [summary, setSummay] = useState([]);
  const [users, setUsers] = useState([]);
  const [isMonthdownOpen, setIsMonthdownOpen] = useState(false);
  const [isTabledownOpen, setIsTabledownOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    `${now.getFullYear()}-${now.getMonth()}-01`
  );
  const [endDate, setEndDate] = useState(formatDateToYYYMMDD(now));
  const [endMonth, setEndMonth] = useState(endDate);
  const [month, setMonth] = useState(months[now.getMonth()]);
  const [emailSelected, setEmailSelected] = useState("all");
  const [tableType, setTableType] = useState("DETAILED STATISTICS");
  const [errorMessage, setErrorMessage] = useState("");
  const monthdownRef = useRef(null);
  const emaildownRef = useRef(null);
  const TabledownRef = useRef(null);

  function formatDateToYYYMMDD(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  async function getAllWorkday(month) {
    const response = await getStatisticall(month);
    if (response.success) {
      setDetail(response.detail);
      setSummay(response.summary);
    } else {
      setErrorMessage(response.message);
    }
  }

  async function getPWorkday(month) {
    const response = await getWorkdayByEmail(emailSelected, month);
    if (response.success) {
      setDetail(response.detail);
      setSummay(response.summary);
    } else {
      setErrorMessage(response.message);
    }
  }
  const handleLogin = () => {
    setErrorMessage("");
  };

  const handleMonthSelect = useCallback(
    (month) => {
      setMonth(month);
      setIsMonthdownOpen(false);
    },
    [setMonth, setIsMonthdownOpen]
  );

  const handleUserSelect = async (user) => {  
      let rs;
      if (user === "all") {
        rs = await MgetAllbyDate(startDate, endDate);
      } else {
        rs = await MgetWorkDaybyDate(user, startDate, endDate);
      }
      if (rs.success) {
        setSummay(rs.summary);
        setDetail(rs.detail);
      } else {
        setErrorMessage(rs.message);
      }
      setEmailSelected(user);
      setIsUserOpen(false);
    }

  const handleSearch = useCallback(async () => {
    let response;
    if (emailSelected === "all") {
      response = await MgetAllbyDate(startDate, endDate);
    } else {
      response = await MgetWorkDaybyDate(emailSelected, startDate, endDate);
    }
    if (response.success) {
      setDetail(response.detail);
      setSummay(response.summary);
    } else {
      setErrorMessage(response.message);
    }
  }, [
    MgetAllbyDate,
    startDate,
    endDate,
    setDetail,
    setSummay,
    setErrorMessage,
  ]);

  const handleTypeTable = useCallback(
    (e) => {
      setTableType(e);
      setIsTabledownOpen(false);
    },
    [setTableType, setIsTabledownOpen]
  );

  const handleDownloadFile = useCallback(async () => {
    let rs;
    if (emailSelected === "all") {
      rs = await DownloadAllbyDate(startDate, endDate);
    } else {
      rs = await MDownloadPbyDate(emailSelected, startDate, endDate);
    }
    if (!rs?.success) {
      setErrorMessage(rs?.message);
    }
  }, [
    emailSelected,
    startDate,
    endDate,
    DownloadAllbyDate,
    MDownloadPbyDate,
    setErrorMessage,
  ]);
  const toggleDropdown = () => {
    setIsMonthdownOpen(!isMonthdownOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const rs = await getAllActiveUser();
      if (rs.success) {
        const newUserList = ["all", ...rs.data.map((item) => item.email)];
        setUsers(newUserList);
      } else {
        setErrorMessage(rs.message);
      }
    };
    fetchData();
    getAllWorkday(now.getMonth() + 1);
    const handleClickOutside = (event) => {
      if (
        monthdownRef.current &&
        !monthdownRef.current.contains(event.target)
      ) {
        setIsMonthdownOpen(false);
      }
      if (
        emaildownRef.current &&
        !emaildownRef.current.contains(event.target)
      ) {
        setIsUserOpen(false);
      }
      if (
        TabledownRef.current &&
        !TabledownRef.current.contains(event.target)
      ) {
        setIsTabledownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const monthIndex = months.findIndex((item) => item === month);

    if (emailSelected == "all") {
      getAllWorkday(monthIndex + 1);
    } else {
      getPWorkday(monthIndex + 1);
    }
    setStartDate(formatDateToYYYMMDD(new Date(year, monthIndex)));
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
    const end = monthIndex === now.getMonth() ? now : lastDayOfMonth;
    setEndDate(formatDateToYYYMMDD(end));
    setEndMonth(formatDateToYYYMMDD(end));
  }, [month]);

  
  useEffect(() => {
    const changeData = async() => {
      
    }
    changeData()
  },[emailSelected])
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
    <div className="w-full md:px-16 px-3">
      <div className="w-full md:pt-20 pt-5 flex md:flex-row pb-3 flex-col-reverse justify-end md:gap-4 gap-2">
        <div className="flex justify-end">
          <div className="relative md:flex-1 w-52 text-left" ref={emaildownRef}>
            <div
              className="border border-gray-300 rounded-md p-2 flex items-center justify-between cursor-pointer"
              onClick={() => {
                setIsUserOpen(!isUserOpen);
              }}
            >
              {emailSelected}
              <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
            </div>
            <div
              className={`origin-top-right absolute right-0 mt-2 w-full z-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                isUserOpen ? "block" : "hidden"
              }`}
            >
              <div
                className=""
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    {user}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="relative md:flex-1 w-52 text-left" ref={monthdownRef}>
            <div
              className="border border-gray-300 rounded-md p-2 flex items-center justify-between cursor-pointer"
              onClick={toggleDropdown}
            >
              {month}
              <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
            </div>
            <div
              className={`origin-top-right absolute right-0 mt-2 w-full z-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                isMonthdownOpen ? "block" : "hidden"
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
                onChange={(e) => {
                  setStartDate(e.target.value);
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
                onChange={(e) => {
                  setEndDate(e.target.value);
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
      {emailSelected === "all" && (
        <div className="font-medium  text-2xl text-gray-700 w-full flex justify-center">
          <div className="flex flex-row relative" ref={TabledownRef}>
            {tableType}
            <FontAwesomeIcon
              className=" flex items-center pt-1 px-2 cursor-pointer"
              icon={faAngleDown}
              onClick={() => setIsTabledownOpen(!isTabledownOpen)}
            />
            <div
              className={`absolute mt-2 top-9  w-full z-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                isTabledownOpen ? "block" : "hidden"
              }`}
            >
              <div
                className=""
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                  onClick={() => handleTypeTable("DETAILED STATISTICS")}
                >
                  DETAILED STATISTICS
                </div>
                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover.bg-gray-100 hover:text-gray-900 cursor-pointer"
                  onClick={() => handleTypeTable("GENERAL STATISTICS")}
                >
                  GENERAL STATISTICS
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tableType === "DETAILED STATISTICS" && emailSelected === "all" && (
        <StatisticDetail detail={detail} />
      )}
      {tableType === "GENERAL STATISTICS" && emailSelected === "all" && (
        <StatisticGeneral summary={summary} />
      )}
      {emailSelected !== "all" && (
        <PersonalStatistic detail={detail} summary={summary} />
      )}
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
