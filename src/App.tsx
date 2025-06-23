import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RegisterClient from "./pages/RegisterClient";
import ClientsList from "./pages/ClientsList";
import Ranks from "./pages/Ranks";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterClient />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/clients" element={<PrivateRoute><ClientsList /></PrivateRoute>} />
        <Route path="/ranks" element={<PrivateRoute><Ranks /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
