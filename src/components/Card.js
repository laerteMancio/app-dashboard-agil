export default function Card({ title, value }) {
  return (
    <div className="p-4 bg-white shadow rounded flex flex-col items-center justify-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}