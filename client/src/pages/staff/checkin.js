import { useState } from "react";
import MessageBox from "~/Components/MessageBox";
import { checkin } from "~/service/CheckinService";
import getRole from "~/service/RoleService";

function Checkin() {
  const [available, setAvailable] = useState(true);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const handleCheckin = () => {
    setDisabled(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setDisabled(false);
          const response = await checkin(
            position.coords.latitude,
            position.coords.longitude
          );
          if (response.success) {
            const role = getRole();
            setResult(true);
            setMessage(
              `Employee: ${role.name} <br> Email: ${role.email} <br> ${response.message}  <br>Time: ${response.time} <br>Fine: ${response.fine}`
            );
          } else {
            setAvailable(false);
            setMessage(response.message);
          }
        },
        (error) => {
          console.log(error);
          setDisabled(false);
          setAvailable(false);
          setMessage(error.message);
        }
      );
    } else {
      setAvailable(false);
      setMessage(
        "The browser you are using does not support the coordinate retrieval service we use"
      );
    }
  };
  const handleConfirm = () => {
    setAvailable(true);
  };
  const handleCancel = () => {
    setAvailable(true);
  };
  const createMarkup = () => {
    return { __html: message };
  };
  return (
    <div className="w-full relative h-[90vh] flex justify-center items-center">
      <button
        type="button"
        className={
          !disabled
            ? "text-red-700 h-[100px] w-[240px]  md:rounded-[50px] rounded hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            : "h-[100px] w-[240px]  md:rounded-[50px] rounded text-white bg-red-800 cursor-not-allowed"
        }
        onClick={handleCheckin}
        disabled={disabled}
      >
        <div className="text-[32px]">Checkin</div>
      </button>
      {result && (
        <div className="h-[300px] text-lg bg-white md:text-[24px] flex items-center md:pl-20 pl-4 text-gray-700 md:w-[800px] w-full rounded-[60px] border-[#676767] border-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="md:text-lg text-base" dangerouslySetInnerHTML={createMarkup()} />
        </div>
      )}
      {!available && (
        <MessageBox
          confirm={handleConfirm}
          cancel={handleCancel}
          title="Check in failed"
          description={message}
        ></MessageBox>
      )}
    </div>
  );
}

export default Checkin;
