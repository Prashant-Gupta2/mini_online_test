import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Student Dashboard
      </h1>

      <div className="border rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold">
          MERN Stack Assessment
        </h2>

        <p className="my-3">Questions: 10</p>
        <p className="my-3">Duration: 10 minutes</p>
        <p className="my-3">Total marks: 10</p>

        <Link
          to="/test"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded"
        >
          Start Test
        </Link>
      </div>

      <Link
        to="/history"
        className="block mt-6 text-indigo-600"
      >
        View Attempt History
      </Link>
    </div>
  );
}