import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function PersonalStatistic({detail, summary}) {
  function formatDateISOToDDMMYYYY(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return (
    <div>
      <div className=" overflow-x-auto mt-5 shadow-md sm:rounded-lg">
        <table className="md:w-full  text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-[#06B5C0] dark:bg-[#06B5C0] dark:text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                Day
              </th>
              <th scope="col" className="px-6 py-3">
                Check In Time
              </th>
              <th scope="col" className="px-6 py-3">
                Late
              </th>
              <th scope="col" className="px-6 py-3">
                Leave
              </th>
              <th scope="col" className="px-6 py-3">
                Fine
              </th>
            </tr>
          </thead>
          <tbody>
            {detail &&
              detail?.map((item, index) => (
                <tr
                  className="bg-white border-b hover:bg-slate-300 dark:bg-gray-800 dark:border-gray-700"
                  key={index}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {formatDateISOToDDMMYYYY(item.day)}
                  </th>
                  <td className="px-6 py-4">{item.time}</td>
                  <td className="px-6 py-4">
                    {item.late && <FontAwesomeIcon icon={faCheck} />}
                  </td>
                  <td className="px-6 py-4">
                    {item.off && <FontAwesomeIcon icon={faCheck} />}
                  </td>
                  <td className="px-6 py-4">{item.fee}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-end w-full mt-16 pt-4 text-gray-800 border-t-2 border-gray-600 ">
        <div className="w-[160px] font-medium text-lg pb-2">Summary: </div>
        <div className="flex justify-between w-[160px] pr-3">
          <div className="">Total Checkins: </div>
          <div>{summary.totalCheckins}</div>
        </div>
        <div className="flex justify-between w-[160px] pr-3">
          <div className="">Total Late Days: </div>
          <div>{summary.totalLateDays}</div>
        </div>
        <div className="flex justify-between w-[160px] pr-3">
          <div className="">Total Leave Days: </div>
          <div>{summary.totalLeaveDays}</div>
        </div>
        <div className="flex justify-between w-[160px] pr-3">
          <div className="">Total Fines: </div>
          <div>{summary.totalFee}</div>
        </div>
      </div>
    </div>
  );
}
