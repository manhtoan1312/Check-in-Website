import { Link, useLocation} from "react-router-dom";

export default function SlideBar() {
  return (
    <aside className="absolute z-0 left-0 top-[60px] flex flex-col bg-gray-100 md:top-[80px] h-[100vh] md:w-[400px] w-screen shadow-2xl animate-slide-in">
      <ul>
        <li className="flex items-center pl-4 border-b-2 shadow text-gray-700 h-20 text-2xl uppercase font-medium hover:bg-gray-200">
          <Link to="/m-statistic" className="h-full w-full flex items-center ">statistics management</Link>
        </li>
        <li className="flex items-center pl-4 border-b-2 shadow text-gray-700 h-20 text-2xl uppercase font-medium hover:bg-gray-200">
          <Link to="/m-employees" className="h-full w-full flex items-center ">employees management</Link>
        </li>
        <li className="flex items-center pl-4 border-b-2 shadow text-gray-700 h-20 text-2xl uppercase font-medium hover:bg-gray-200">
          <Link to="/branch" className="h-full w-full flex items-center ">branchs management</Link>
        </li>
        <li className="flex items-center pl-4 border-b-2 shadow text-gray-700 h-20 text-2xl uppercase font-medium hover:bg-gray-200">
          <Link to="/old" className="h-full w-full flex items-center ">old employees management</Link>
        </li>
      </ul>
      <span className="self-center md:pt-[430px] pt-[380px] text-[#1C348A] text-3xl font-bold whitespace-nowrap dark:text-white">
        TMA CHECKIN
      </span>
    </aside>
  );
}