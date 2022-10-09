import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./userMenu.css";
import { Link, useNavigate } from "react-router-dom";

const UserMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  // Fetch user data from local storage
  const userId = localStorage.getItem("userID");

  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleLogout = (e) => {
    // console.log("Logout successful");
    localStorage.clear();
    setLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userID");

    if (userId) {
      setLoggedIn(true);
    }
  }, [userId]);

  return (
    <div className="userMenu">
      <FontAwesomeIcon
        icon={showMenu ? faXmark : faBars}
        className="menuIcon"
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      />
      {/* Menu Item */}
      {showMenu && (
        <div className="menuItems">
          <Link
            to={loggedIn ? `/upload/${userId}` : "/login"}
            className="userlink"
          >
            Upload
          </Link>
          {loggedIn ? (
            <>
              <Link to={`/dashboard/${userId}`} className="userlink">
                Dashboard
              </Link>
              <Link to={`/profile/${userId}`} className="userlink">
                Profile
              </Link>
            </>
          ) : (
            <Link to="/login" className="userlink">
              Login
            </Link>
          )}

          <button
            onClick={() => {
              handleLogout();
            }}
            className="userlink"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
