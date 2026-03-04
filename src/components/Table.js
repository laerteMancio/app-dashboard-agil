export default function Table({ columns, data }) {
  return (
    <table className="min-w-full bg-white shadow rounded overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="text-left p-2">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-b last:border-b-0">
            {columns.map((col) => (
              <td key={col} className="p-2">{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}