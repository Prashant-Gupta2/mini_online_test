import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Test() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const starting = useRef(false);
  const submitting = useRef(false);
  const pendingSave = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (starting.current) return;

    starting.current = true;

    api.post("/tests/start")
      .then(({ data }) => {
        setQuestions(data.questions);
        setAttemptId(data.attemptId);
        setExpiresAt(data.expiresAt);
      })
      .catch(() => {
        setError("Unable to start test");
      });
  }, []);

  const submitTest = useCallback(async () => {
    if (!attemptId || submitting.current) return;

    submitting.current = true;

    try {
      await pendingSave.current;

      const { data } = await api.post(
        `/tests/${attemptId}/submit`
      );

      navigate(`/result/${data._id}`, {
        replace: true
      });

    } catch {
      submitting.current = false;
      setError("Submission failed. Please retry.");
    }
  }, [attemptId, navigate]);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil(
          (new Date(expiresAt).getTime() - Date.now()) / 1000
        )
      );

      setTimeLeft(remaining);

      if (remaining === 0) {
        submitTest();
      }
    };

    tick();

    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);

  }, [expiresAt, submitTest]);

  const selectAnswer = async (questionId, index) => {
    if (
      saving ||
      timeLeft === 0 ||
      submitting.current
    ) return;

    setSaving(true);

    pendingSave.current = api.patch(
      `/tests/${attemptId}/answer`,
      {
        questionId,
        selectedAnswer: index
      }
    ).then(() => {
      setAnswers(prev => ({
        ...prev,
        [questionId]: index
      }));
    }).catch(() => {
      setError("Answer could not be saved");
    }).finally(() => {
      setSaving(false);
    });

    await pendingSave.current;
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="sticky top-0 bg-white py-4 flex justify-between">
        <h1 className="text-2xl font-bold">Online Test</h1>

        <p className="text-red-600 font-bold text-xl">
          {minutes}:{String(seconds).padStart(2, "0")}
        </p>
      </div>

      <p className="text-red-500">{error}</p>

      {!attemptId && !error && <p>Loading test...</p>}

      {questions.map((q, i) => (
        <div key={q._id} className="border rounded-xl p-5 my-4">

          <h2 className="font-semibold mb-4">
            {i + 1}. {q.question}
          </h2>

          {q.options.map((option, index) => (
            <label key={index} className="flex gap-3 p-3">

              <input
                type="radio"
                name={q._id}
                checked={answers[q._id] === index}
                disabled={saving || timeLeft === 0}
                onChange={() => selectAnswer(q._id, index)}
              />

              {option}

            </label>
          ))}
        </div>
      ))}

      <button
        disabled={!attemptId || saving}
        onClick={submitTest}
        className="bg-indigo-600 text-white px-6 py-3 rounded"
      >
        Submit Test
      </button>
    </div>
  );
}