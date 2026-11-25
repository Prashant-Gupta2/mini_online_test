import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      navigate("/login");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-8 shadow rounded-xl"
    >
      <h1 className="text-2xl font-bold mb-5">
        Student Registration
      </h1>

      <p className="text-red-500">{error}</p>

      {["name", "email", "password"].map(field => (
        <input
          key={field}
          name={field}
          type={field === "name" ? "text" : field}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
          className="border p-3 w-full mb-4 rounded"
          required
        />
      ))}

      <button className="bg-indigo-600 text-white p-3 w-full rounded">
        Register
      </button>
    </form>
  );
}