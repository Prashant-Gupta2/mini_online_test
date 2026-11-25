import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/tests/history")
      .then(({ data }) => setAttempts(data))
      .catch(() => setError("Unable to load history"));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Attempt History
      </h1>

      <p className="text-red-500">{error}</p>

      {attempts.length === 0 && !error && (
        <p>No completed attempts found.</p>
      )}

      {attempts.map(attempt => (
        <div
          key={attempt._id}
          className="border p-4 rounded my-3 flex justify-between"
        >
          <div>
            <p className="font-bold">
              Score: {attempt.score}/{attempt.totalQuestions}
            </p>

            <p className="text-gray-500">
              {new Date(attempt.submittedAt).toLocaleString()}
            </p>
          </div>

          <Link
            to={`/result/${attempt._id}`}
            className="text-indigo-600"
          >
            View Result
          </Link>
        </div>
      ))}
    </div>
  );
}