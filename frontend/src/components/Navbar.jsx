import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for toggle
import { Link, useNavigate } from "react-router-dom";
import styles from "../CSS/Navbar.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import imgage from "../assets/HospCare.png"; // Make sure path is correct

function Navbar({ login, setlogin }) {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("Token");
      try {
        if (!storedToken) {
          setUser(null);
          setUserCategory("");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/User", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({ token: storedToken }),
        });

        if (!response.ok) {
          window.alert("You have Logged Out");
          throw new Error("Unauthorized Access");
        }

        const data = await response.json();
        setUser(data);

        const userData = JSON.parse(localStorage.getItem("Data"));
        if (userData) {
          setUserCategory(userData.category);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser(null);
        setUserCategory("");
      }
    };

    fetchUser();
  }, []);

  const Logout = () => {
    localStorage.clear();
    setlogin(false);
    setSidebarOpen(false);
    navigate("/");
  };

  return (
    <div className={styles.navContainer}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src={imgage} className={styles.logo} alt="HospCare Logo" />
      </div>

      {/* Brand Name */}
      <div className={styles.brandName}>HospCare.com</div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input type="search" className="form-control" placeholder="Search..." />
      </div>

      {/* Menu Toggle Button */}
      <button className={styles.menuButton} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Navigation */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <ul className={styles.navList}>
          <li>
            <Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link>
          </li>

          {userCategory !== "doctor" && (
            <li>
              <Link to="/Doctors" onClick={() => setSidebarOpen(false)}>Doctors</Link>
            </li>
          )}

          <li>
            <Link to="/appointment" onClick={() => setSidebarOpen(false)}>Appointment</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setSidebarOpen(false)}>About</Link>
          </li>
          <li>
            <Link to="/history" onClick={() => setSidebarOpen(false)}>History</Link>
          </li>
          <li>
            <Link to="/profile" onClick={() => setSidebarOpen(false)}>Profile</Link>
          </li>

          {login ? (
            <li>
              <Link to="/" onClick={() => Logout()}>Logout</Link>
            </li>
          ) : (
            <li>
              <Link to="/login" onClick={() => setSidebarOpen(false)}>Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
