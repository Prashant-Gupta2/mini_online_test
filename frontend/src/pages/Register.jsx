import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-8 shadow rounded-xl"
    >
      <h1 className="text-2xl font-bold mb-5 text-center">
        Student Registration
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {["name", "email", "password"].map(field => (
        <input
          key={field}
          name={field}
          type={field === "name" ? "text" : field}
          placeholder={
            field.charAt(0).toUpperCase() + field.slice(1)
          }
          value={form[field]}
          onChange={handleChange}
          className="border p-3 w-full mb-4 rounded"
          required
        />
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 w-full rounded disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <p className="text-center mt-5 text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}