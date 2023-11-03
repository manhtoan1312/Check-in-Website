export default function StatisticGeneral({ summary }) {
  return (
    <table className="md:w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-white sticky top-0 uppercase bg-[#06B5C0] dark:bg-[#06B5C0] dark:text-white">
        <tr>
          <th scope="col" className="md:px-6 px-4 py-3">
            name
          </th>
          <th scope="col" className="md:px-6 px-4 py-3">
            email
          </th>
          <th scope="col" className="md:px-6 px-4 py-3">
            total Checkins
          </th>
          <th scope="col" className="md:px-6 px-4 py-3">
            total late days
          </th>
          <th scope="col" className="md:px-6 px-4 py-3">
            total leave days
          </th>
          <th scope="col" className="md:px-6 px-4 py-3">
            total fine
          </th>
        </tr>
      </thead>
      <tbody>
        {summary.map((item, index) => (
          <tr key={index}>
            <th className="md:px-6 px-4 py-4 font-normal">{item.name}</th>
            <th className="md:px-6 px-4 py-4 font-normal">{item.email}</th>
            <th className="md:px-6 px-4 py-4 font-normal">
              {item.totalCheckins}
            </th>
            <th className="md:px-6 px-4 py-4 font-normal">
              {item.totalLateDays}
            </th>
            <th className="md:px-6 px-4 py-4 font-normal">
              {item.totalLeaveDays}
            </th>
            <th className="md:px-6 px-4 py-4 font-normal">{item.totalFee}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
