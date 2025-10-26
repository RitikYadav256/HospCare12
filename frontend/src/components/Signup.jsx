import React, { useState, useRef } from "react";
import styles from "../CSS/Signup.module.css";

const categories = [
  "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedic", "Pediatrician", "Psychiatrist", "Surgeon", "Ophthalmologist",
  "ENT Specialist", "Urologist", "Nephrologist", "Gastroenterologist",
  "Endocrinologist", "Pulmonologist", "Oncologist", "Rheumatologist",
  "Hematologist", "Radiologist", "Pathologist", "Anesthesiologist",
  "Gynecologist & Obstetrician", "Andrologist", "Sexologist", "Dentist",
  "Plastic Surgeon", "Cosmetologist", "Immunologist", "Geriatrician",
  "Sports Medicine Specialist", "Neonatologist", "Palliative Care Specialist"
];

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    profilePic: null,
    profilePicPreview: "", // Holds the image preview URL
    dob: "",
    address: "",
    category: "patient",
    specialization: "", // Only for doctors
    organization: "", // Only for doctors
    password: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setFormData({ 
        ...formData, 
        profilePic: file, 
        profilePicPreview: imageUrl // Store preview URL
      });
    }
  };

  // Function to trigger file input when clicking on image preview
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        window.location = "/login";
      } else {
        setError(result.message || "Signup failed!");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong! Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.headerwraper}>
          <h2 className={styles.title}>Sign Up</h2>

          {/* Profile Picture Preview (Click to Upload) */}
          <div className={styles.imageContainer} onClick={handleImageClick}>
            {formData.profilePicPreview ? (
              <img src={formData.profilePicPreview} alt="Profile" className={styles.headerimage} />
            ) : (
              <div className={styles.headerimagetxt}>Upload</div>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          name="profilePic"
          className={styles.input}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }} // Hide the file input
        />

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <input type="text" name="firstName" placeholder="First Name" className={styles.input} value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" className={styles.input} value={formData.lastName} onChange={handleChange} required />
          </div>
          <input type="email" name="email" placeholder="Email" className={styles.input} value={formData.email} onChange={handleChange} required />
          <input type="text" name="mobile" placeholder="Mobile Number" className={styles.input} value={formData.mobile} onChange={handleChange} required />
          <input type="date" name="dob" className={styles.input} value={formData.dob} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" className={styles.input} value={formData.address} onChange={handleChange} required />
          
          {/* Category Dropdown */}
          <select name="category" className={styles.input} value={formData.category} onChange={handleChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="medical">Medical</option>
          </select>

          {/* Show specialization dropdown & organization field if user is a doctor */}
          {formData.category === "doctor" && (
            <>
              <select
                name="specialization"
                className={styles.input}
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select Specialization</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              <input type="text" name="organization" placeholder="Hospital/Clinic Name" className={styles.input} value={formData.organization} onChange={handleChange} required />
            </>
          )}

          <input type="password" name="password" placeholder="Password" className={styles.input} value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className={styles.input} value={formData.confirmPassword} onChange={handleChange} required />
          
          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>Sign Up</button>
        </form>
        
        <p className={styles.text}>Already have an account? <a href="/login" className={styles.link}>Login</a></p>
      </div>
    </div>
  );
}

export default SignUp;
