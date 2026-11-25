import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/tests/${id}/result`)
      .then(({ data }) => setResult(data))
      .catch(() => setError("Unable to load result"));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!result) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-5">
        Test Result
      </h1>

      <div className="bg-indigo-600 text-white p-8 rounded-xl">
        <h2 className="text-3xl font-bold">
          {result.score} / {result.totalQuestions}
        </h2>

        <p>
          Percentage: {
            (result.score / result.totalQuestions) * 100
          }%
        </p>
      </div>

      {result.questions.map((q, i) => (
        <div
          key={i}
          className={`p-5 my-4 border rounded ${
            q.isCorrect ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <h3 className="font-semibold">
            {i + 1}. {q.question}
          </h3>

          <p>
            Your answer: {
              q.selectedAnswer == null
                ? "Not answered"
                : q.options[q.selectedAnswer]
            }
          </p>

          <p>
            Correct answer: {q.options[q.correctAnswer]}
          </p>

          <p>
            {q.isCorrect ? "Correct" : "Incorrect"}
          </p>

        </div>
      ))}

      <Link to="/dashboard">
        Back to Dashboard
      </Link>
    </div>
  );
} 