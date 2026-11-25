import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0
};

export default function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get("/admin/questions");
      setQuestions(data);
    } catch {
      setMessage("Failed to fetch questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOptionChange = (index, value) => {
    setForm(prev => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? value : option
      )
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await api.put(`/admin/questions/${editId}`, form);
        setMessage("Question updated successfully");
      } else {
        await api.post("/admin/questions", form);
        setMessage("Question added successfully");
      }

      setForm(initialForm);
      setEditId(null);
      await fetchQuestions();

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = q => {
    setEditId(q._id);

    setForm({
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await api.delete(`/admin/questions/${id}`);
      setMessage("Question deleted successfully");
      await fetchQuestions();
    } catch {
      setMessage("Failed to delete question");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <p className="mb-4">{message}</p>

      <form
        onSubmit={handleSubmit}
        className="border rounded-xl p-6 shadow"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Question" : "Add Question"}
        </h2>

        <textarea
          placeholder="Enter question"
          value={form.question}
          onChange={e => setForm({
            ...form,
            question: e.target.value
          })}
          className="border p-3 rounded w-full mb-4"
          required
        />

        {form.options.map((option, index) => (
          <input
            key={index}
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={e =>
              handleOptionChange(index, e.target.value)
            }
            className="border p-3 rounded w-full mb-3"
            required
          />
        ))}

        <label className="block mb-2 font-medium">
          Correct Answer
        </label>

        <select
          value={form.correctAnswer}
          onChange={e => setForm({
            ...form,
            correctAnswer: Number(e.target.value)
          })}
          className="border p-3 rounded w-full mb-4"
        >
          {form.options.map((option, index) => (
            <option key={index} value={index}>
              Option {index + 1}: {option}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded"
        >
          {loading
            ? "Saving..."
            : editId ? "Update Question" : "Add Question"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm(initialForm);
            }}
            className="ml-4 border px-4 py-3 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">
        All Questions ({questions.length})
      </h2>

      {questions.map((q, index) => (
        <div
          key={q._id}
          className="border p-5 rounded-xl mb-4"
        >
          <h3 className="font-semibold mb-3">
            {index + 1}. {q.question}
          </h3>

          {q.options.map((option, i) => (
            <p
              key={i}
              className={
                i === q.correctAnswer
                  ? "text-green-600 font-semibold"
                  : "text-gray-600"
              }
            >
              {i + 1}. {option}
            </p>
          ))}

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleEdit(q)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(q._id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}