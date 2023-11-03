import { Link, useLocation } from "react-router-dom";

export default function SSlideBar() {
  return (
    <aside className="absolute z-0 left-0 top-[60px] flex flex-col bg-gray-100 md:top-[80px] h-[100vh] md:w-[400px] w-screen shadow-2xl animate-slide-in">
      <ul>
        <li className="flex md:hidden items-center pl-4 border-b-2 shadow text-gray-700 h-20 text-2xl uppercase font-medium hover:bg-gray-200">
          <Link to="/checkin" className="h-full w-full flex items-center ">
            check in
          </Link>
        </li>
        <li className="flex md:hidden items-center pl-4 border-b-2 shadow text-gray-700 h-20 text-2xl uppercase font-medium hover:bg-gray-200">
          <Link to="/statistic" className="h-full w-full flex items-center ">
            personal statistic
          </Link>
        </li>
      </ul>
      <span className="self-center md:pt-[430px] pt-[380px] text-[#1C348A] text-3xl font-bold whitespace-nowrap dark:text-white">
        TMA CHECKIN
      </span>
    </aside>
  );
}
