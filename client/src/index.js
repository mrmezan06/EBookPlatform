import { render } from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Upload from "./pages/upload/Upload";
import Registration from "./pages/registration/Registration";
import App from "./App";
import Search from "./pages/search/Search";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/upload/:id" element={<Upload />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
