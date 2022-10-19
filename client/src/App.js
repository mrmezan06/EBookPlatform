import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import "./app.css";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Upload from "./pages/upload/Upload";
import Registration from "./pages/registration/Registration";
import Search from "./pages/search/Search";
import Dashboard from "./pages/dashboard/Dashboard";
import EditBook from "./pages/editBook/EditBook";
import ManageUser from "./pages/manageUser/ManageUser";
import Read from "./pages/read/Read";
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/upload/:id" element={<Upload />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/edit/:id" element={<EditBook />} />
          <Route path="/manage/:id" element={<ManageUser />} />
          <Route path="/read" element={<Read />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
