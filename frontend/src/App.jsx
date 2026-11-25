import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import Result from "./pages/Result";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/test" element={<Test />} />

          <Route path="/result/:id" element={<Result />} />

          <Route path="/history" element={<History />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}