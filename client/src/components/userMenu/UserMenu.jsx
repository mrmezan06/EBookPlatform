import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./userMenu.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const UserMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  // Fetch user data from local storage
  const userId = localStorage.getItem("userID");

  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const handleLogout = (e) => {
    // console.log("Logout successful");
    localStorage.clear();
    setLoggedIn(false);
    navigate("/login");
  };

  const fetchUserDetails = async (id) => {
    try {
      await axios
        .get(`/auth/user/${id}`)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.isAdmin) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userID");

    if (userId) {
      setLoggedIn(true);
      fetchUserDetails(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isAdmin]);

  return (
    <div className="userMenu">
      <Toaster />
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
              {isAdmin && (
                <Link to={`/manage/${userId}`} className="userlink">
                  Manage
                </Link>
              )}
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
