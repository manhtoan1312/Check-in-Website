import React, { useEffect, useState } from "react";
import {
  faXmark,
  faTriangleExclamation,
  faExclamation,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome");

const ToastMessage = ({ type, message, hide }) => {
  const [isVisible, setIsVisible] = useState(true);
  let radient;
  useEffect(() => {
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    },3500)
    setTimeout(() => {
      hide();
    }, 4500);

    
  }, []);

  const close = () => {
    setIsVisible(false);
    hide();
  };

  const toastClasses = `absolute top-1/2 right-0 z-50  transform -translate-y-1/2 w-[350px] py-2 ${
    isVisible ? "animate-toast-slide-in" : "animate-toast-fade-out"
  }`;
  if(type ==="SUCCESS"){
    radient='from-green-700 to-green-300'
  }
  else if(type === "WARNING") {
    radient='from-yellow-700 to-yellow-300'
  }
  else{
    radient='from-red-700 to-red-300'
  }
  return (
    <div className={toastClasses}>
      <div className={`p-4 bg-gradient-to-r  text-white rounded-md ${radient}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {type === "SUCCESS" && (
              <>
                <FontAwesomeIcon className="pr-2" icon={faCheck} />
                Action Success
              </>
            )}
            {type === "WARNING" && (
              <>
                <FontAwesomeIcon className="pr-2" icon={faTriangleExclamation} />
                Warning
              </>
            )}
            {type === "ERROR" && (
              <>
                <FontAwesomeIcon className="pr-2" icon={faExclamation} />
                Action Failed
              </>
            )}
          </h2>
          <div className="cursor-pointer" onClick={close}>
            <FontAwesomeIcon className="hover:text-white" icon={faXmark} />
          </div>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ToastMessage;
