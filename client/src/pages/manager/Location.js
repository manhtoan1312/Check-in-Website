import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import MessageBox from "~/Components/MessageBox";
import {
  DeleteLocation,
  GetAllLocation,
  SearchLocation,
} from "~/service/LocationService";
import { useNavigate, Link } from "react-router-dom";

export default function Location() {
  const [location, setLocation] = useState([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [idDelete, setIsDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(0);
  const tableRef = useRef(null);
  const firstItemRef = useRef(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const result = await GetAllLocation(page);
    setLoading(false);
    if (result.success) {
      if (page === 1) {
        setLocation(result.data);
      } else {
        setLocation([...location, ...result.data]);
      }
      setSize(result.size);
      setPage(page + 1);
    } else {
      setTitle("ACTION FAILED");
      setMessage(result.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      const handleTableScroll = () => {
        const table = tableRef.current;
        const isAtBottom =
          table.scrollTop + table.clientHeight >= table.scrollHeight;
        if (isAtBottom && !loading && location.length < size) {
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
  }, [loading, location, size, tableRef, key]);

  const handleCancel = () => {
    setMessage("");
    setPage(1);
    setKey("");
    fetchData();
  };

  const updateLocation = (item) => {
    navigate(`/update-branch/${item._id}`);
  };

  const submitDelete = async () => {
    const result = await DeleteLocation(idDelete);
    if (result.success) {
      setTitle("ACTION SUCCEEDED!!");
    } else {
      setTitle("ACTION FAILED");
    }
    setMessage(result.message);
  };

  const deleteLocation = (e, item) => {
    e.stopPropagation();
    setIsDelete(item._id);
    setTitle("CONFIRM DELETE BRANCH");
    setMessage("Are you sure you want to delete this branch?");
  };

  const searchNext = async () => {
    const result = await SearchLocation(key, page);
    if (result.success) {
      setLocation([...location, ...result.message]);
      setPage(page+1);
    } else {
      setTitle("ACTION FAILED");
      setMessage(result.message);
    }
    setLoading(false);
  };
  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setKey(searchTerm);
    setLocation([]);
    setPage(1);
    if (searchTerm === "") {
      const result = await GetAllLocation(1);
      setLoading(false);
      if (result.success) {
        setLocation(result.data);
        setSize(result.size);
        setPage(2);
      } else {
        setTitle("ACTION FAILED");
        setMessage(result.message);
      }
    } else {
      const result = await SearchLocation(searchTerm, 1);
      if (result.success) {
        setLocation(result.message);
        setSize(result.size);
      } else {
      }
    }
    if (firstItemRef.current) {
      firstItemRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="md:px-16 px-3 md:pt-20 pt-5">
      {message && (
        <MessageBox
          confirm={
            title === "CONFIRM DELETE BRANCH" ? submitDelete : handleCancel
          }
          cancel={handleCancel}
          description={message}
          title={title}
        />
      )}
      <div className="py-5">
        <h2 className="font-medium text-2xl text-gray-700 w-full flex justify-center uppercase">
          BRANCHES MANAGEMENT
        </h2>
      </div>
      <div className="w-full flex justify-end md:flex-row flex-col items-end">
        <div className="relative w-[300px] md:mx-5 mb-2">
          <input
            type="text"
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            placeholder="Search branch or address..."
            onChange={(e) => handleSearch(e)}
            value={key}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 -mt-0.5">
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </div>
        <Link
          to={"/insert-branch"}
          className="text-[#00BAC6] hover:text-white border border-[#00BAC6] hover:bg-[#10959e] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Insert Branch
        </Link>
      </div>
      <div
        ref={tableRef}
        className="max-h-[500px] overflow-x-auto overflow-y-scroll mt-5 shadow-md sm:rounded-lg"
      >
        <table className="md:w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white sticky top-0 uppercase bg-[#06B5C0] dark:bg-[#06B5C0] dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Branch
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Latitude
              </th>
              <th scope="col" className="px-6 py-3">
                Longitude
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {location?.map((item, index) => (
              <tr
                ref={index === 0 ? firstItemRef : null}
                key={item._id}
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => updateLocation(item)}
              >
                <td className="px-6 py-4">{item.branch}</td>
                <td className="px-6 py-4">{item.address}</td>
                <td className="px-6 py-4">{item.Coordinate.Latitude}</td>
                <td className="px-6 py-4">{item.Coordinate.Longitude}</td>
                <td
                  className="px-6 py-4"
                  onClick={(e) => deleteLocation(e, item)}
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
}
