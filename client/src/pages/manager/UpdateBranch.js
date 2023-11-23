import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { GetLocationByID, UpdateLocation } from "~/service/LocationService";
import {
  faArrowLeft,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ToastMessage from "~/Components/ToastMessage";
function UpdateBranch() {
  const [branch, setBranch] = useState({});
  const [message, setMessage] = useState("");
  const [change, setChange] = useState(false);
  const [type, setType] = useState("");
  const { id } = useParams();

  const handleBranchChange = (e) => {
    const { name, value } = e.target;
    setBranch((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setChange(true);
  };

  const fetchData = async () => {
    const result = await GetLocationByID(id);
    if (result.success) {
      setBranch({
        branch: result.message.branch,
        Latitude: result.message.Coordinate.Latitude,
        Longitude: result.message.Coordinate.Longitude,
        address: result.message.address,
      });
    } else {
      setType("ERROR");
      setMessage(result.message);
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            ...branch,
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude,
          };
          setBranch(newLocation);
          setChange(true);
        },
        (error) => {
          setType("ERROR");
          setMessage("You have blocked location access.");
        }
      );
    } else {
      setType("ERROR");
      setMessage(
        "The browser you are using does not support the coordinate retrieval service we use"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setType("");
  };

  const updateBranch = async (e) => {
    e.preventDefault();
    const locate = {
      branch: branch.branch,
      Coordinate: {
        Latitude: branch.Latitude,
        Longitude: branch.Longitude,
      },
      address: branch.address,
    };
    const result = await UpdateLocation(id, locate);
    if (result.success) {
      setType("SUCCESS");
      setChange(false)
    } else {
      setType("ERROR");
    }
    setMessage(result.message)
  };
  return (
    <div className="w-full h-full bg-[#CBEFF6] flex justify-center">
      {type && (
        <ToastMessage type={type} message={message} hide={handleClose} />
      )}
      <div className="h-full md:w-[700px] w-[400px] bg-white flex justify-center">
        <div className="w-[800px] h-[600px] flex items-center flex-col">
          <div className="p-2 ml-5 w-full text-lg  ">
            <Link
              to={"/branch"}
              className="flex justify-center items-center cursor-pointer rounded-full h-10 w-10 hover:bg-gray-500 hover:text-white"
            >
              <div>
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
            </Link>
          </div>
          <div className="font-medium font-serif md:pt-20 pt-5 md:text-4xl text-xl uppercase flex justify-center">
            <div>UPDATE BRANCH</div>
          </div>
          <form className="w-[320px] pt-5" onSubmit={(e) => updateBranch(e)}>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="branch"
                id="branch"
                className="block pt-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={handleBranchChange}
                value={branch.branch}
              />
              <label
                htmlFor="branch"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Branch Name*
              </label>
            </div>
            <div className="flex flex-row gap-2">
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="Latitude"
                  id="Latitude"
                  className="block pt-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={handleBranchChange}
                  value={branch.Latitude}
                />
                <label
                  htmlFor="Latitude"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Latitude*
                </label>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="Longitude"
                  id="Longitude"
                  className="block pt-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={handleBranchChange}
                  value={branch.Longitude}
                />
                <label
                  htmlFor="Longitude"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Longitude*
                </label>
              </div>

              <button
                type="button"
                onClick={() => getLocation()}
                className="text-green-700 block bg-transparent hover:bg-green-800 hover:text-white border border-green-700 focus:ring-2 focus:outline-none focus:ring-green-300 rounded-md text-sm px-3 py-1.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:bg-green-600 dark:hover:text-white dark:focus:ring-2"
                title="Get your PC coordinate"
              >
                <FontAwesomeIcon icon={faLocationArrow} />
              </button>
            </div>

            <div className="z-0 w-full mb-6 group">
              <label
                htmlFor="address"
                className="block mb-2 text-sm text-gray-500 dark:text-white"
              >
                Address*
              </label>
              <textarea
                id="address"
                name="address"
                onChange={handleBranchChange}
                rows="4"
                required
                value={branch.address}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write branch address here so everyone can find it..."
              ></textarea>
            </div>
            <div className="flex items-center w-full justify-center">
              <button
                type="submit"
                disabled={!change}
                value="Submit"
                className={
                  change
                    ? "text-blue-600 w-[200px] hover:text-white border border-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                    : "text-white bg-blue-400 w-[200px] dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                }
              >
                Insert
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateBranch;
