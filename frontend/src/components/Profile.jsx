import React, { useEffect, useState } from "react";
import styles from "../CSS/Profile.module.css";

function Profile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    profilePic: "",
    dob: "",
    address: "",
    category: "",
  });

  const [user, setUser] = useState(null);
  const [userCategory, setUserCategory] = useState("");

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("Data");
    if (storedData) {
      setProfile(JSON.parse(storedData));
    }

    const fetchUser = async () => {
      const storedToken = localStorage.getItem("Token");
      try {
        const response = await fetch("http://localhost:5000/api/auth/User", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({ token: storedToken }),
        });

        if (!response.ok) {
          window.location="/";
          throw new Error("Unauthorized Access");
        }

        const data = await response.json();
        setUser(data);

        const userData = JSON.parse(localStorage.getItem("Data"));
        if (userData && userData.category) {
          setUserCategory(userData.category);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  },[],);

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileHeader}>
        <img src={profile.profilePic || "https://via.placeholder.com/140"} alt="Profile" className={styles.profilePic} />
        <h2>{profile.firstName} {profile.lastName}</h2>
        <p className={styles.category}>{profile.category}</p>
      </div>
      <div className={styles.profileInfo}>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Mobile:</strong> {profile.mobile}</p>
        <p><strong>Date of Birth:</strong> {profile.dob}</p>
        <p><strong>Address:</strong> {profile.address}</p>
      </div>
    </div>
  );
}

export default Profile;
