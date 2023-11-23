import { useNavigate } from "react-router-dom";
import { useAuth } from "~/hooks/AuthContext";

export default function MessageBox({confirm, cancel, title, description}) {
  const {logout:ContextLogout} = useAuth()
  const navigate = useNavigate()
  const handleConfirm = () => {
    if(description==="This account cannot currently log into the system" || description==="You need to log in to exercise this right" || description==="Token is incorrect or has expired. Please log in again!!")
    {
      ContextLogout();
      navigate('/')
    }
    else{
      confirm()
    }
  }
  const handleCancel = () => {
    if(description==="This account cannot currently log into the system" || description==="You need to log in to exercise this right" || description==="Token is incorrect or has expired. Please log in again!!")
    {
      ContextLogout();
      navigate('/')
    }
    else{
      cancel()
    }
  }
  return (
    <div className="absolute z-50 top-0 bottom-0 left-0 right-0">
      <div className="absolute bg-gray-400 opacity-30 top-0 bottom-0 left-0 right-0"></div>
      <div className="md:w-[400px] w-80 bg-white rounded-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-center text-blue-500">
        <div className=" flex items-center justify-center mt-[-20px] ">
          <h2 className="text-white flex items-center justify-center bg-blue-400 md:w-[300px] w-60  rounded-2xl h-11 font-bold">
            WORK TRACKER Announce
          </h2>
        </div>
        <div className="flex items-center justify-center">
        <h2 className="mb-[10px] text-[24px] text-gray-800 font-extralight">
          {title}
        </h2>
        </div>
        <p className="my-[10px]">{description}</p>
        <div className="flex justify-around">
          <button
            onClick={() => handleConfirm()}
            type="button"
            className="text-blue-400 bg-cyan-200 hover:text-white border border-blue-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            OK
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="text-red-500 bg-red-200 hover:text-white border border-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
