import { useEffect, useState } from "react";
import styles from "../../CSS/Appointments.module.css";
import Banner3 from "../../assets/Banner3.png";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [windowAppointments, setWindowAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [times, setTimes] = useState({});


  const [windowSize, setWindowSize] = useState(5);
  const [windowSize2] = useState(10);
  const [windowSize3] = useState(100);

  // 📌 helper: scheduling
  const scheduling = async (data) => {
    setAppointments(data);

    const firstBatch = data.slice(0, windowSize);
    const firstBatch2 = data.slice(windowSize, windowSize2);
    const firstBatch3 = data.slice(windowSize2, windowSize3);

    const user = JSON.parse(localStorage.getItem("Data"));
    const { email: userEmail, category } = user;

    if (firstBatch.length > 0 && category === "doctor") {
      await fetch(
        `http://localhost:5000/api/doctors/appointment/Status/1?userEmail=${userEmail}&number1=0&number2=5`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
    }

    if (firstBatch2.length > 0 && category === "doctor") {
      await fetch(
        `http://localhost:5000/api/doctors/appointment/Status/2?userEmail=${userEmail}&number1=5&number2=15`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
    }

    if (firstBatch3.length > 0 && category === "doctor") {
      await fetch(
        `http://localhost:5000/api/doctors/appointment/Status/3?userEmail=${userEmail}&number1=15&number2=50`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );
    }

    setWindowAppointments(firstBatch);
  };

  // 📌 helper: fetch time for patient
  const FetchTime = async (doctorEmail,status) => {
    try {
      console.log("Fetching schedule time for:", doctorEmail);

      const user = JSON.parse(localStorage.getItem("Data"));
      const token = localStorage.getItem("Token");

      if (!user || !user.email || !user.category) {
        setError("User data not found");
        setLoading(false);
        return;
      }

      const { email: userEmail, category } = user;
      console.log("User category:", category);
      if (category === "patient") {
        const response = await fetch(
          `http://localhost:5000/api/doctors/appointment/getTime?userEmail=${userEmail}&doctorEmail=${doctorEmail}&category=${category}&Status=${status}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Time for schedule");
        }

        const data = await response.json();
        console.log("Fetched time:", data);

        // store time specific to this doctor
        setTimes((prev) => ({
          ...prev,
          [doctorEmail]: data.estimatedTime || "N/A",
        }));
      }
    } catch (err) {
      console.error("Error fetching time:", err);
    }
  };

  // 📌 main fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("Data"));
        const token = localStorage.getItem("Token");

        if (!user || !user.email || !user.category) {
          setError("User data not found");
          setLoading(false);
          return;
        }

        const { email: userEmail, category, doctorEmail } = user;

        const response = await fetch(
          `http://localhost:5000/api/doctors/appointment?userEmail=${userEmail}&doctorEmail=${doctorEmail}&category=${category}&Token=${token}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        scheduling(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // 📌 attend function
  const Attend = (appointment) => {
    localStorage.setItem("userDetails", JSON.stringify(appointment));

    if (windowSize > 0) setWindowSize((prev) => prev - 1);

    window.location.href = "/appointment/treatment";
  };

  // 📌 window updates
  useEffect(() => {
    setWindowAppointments(appointments.slice(0, windowSize));
  }, [windowSize, appointments]);

  const userData = JSON.parse(localStorage.getItem("Data"));

  // ---------------- RENDER ----------------
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={Banner3} alt="Loading Appointments" className={styles.loadingImage} />
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Fetching your appointments, please wait...</p>
        <p className={styles.loadingSubtext}>
          Your health is our top priority. We're syncing your data securely with our medical system.
          <br />
          Please stay with us while we get everything ready for you! 💙
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <img src={Banner3} alt="Health Alert" className={styles.alertImage} />

        <h2 className={styles.errorTitle}>⚠️ Session Expired!</h2>
        <p className={styles.errorText}>
          You have been <strong>automatically logged out</strong> due to inactivity or a security timeout.
        </p>
        <p className={styles.errorText}>
          Please <a href="/login" className={styles.loginLink}>Log In</a> again to continue managing your appointments.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Appointments</h2>
      <div className={styles.cardGrid}>
        {windowAppointments.length > 0 ? (
          windowAppointments.map((appointment, index) => (
            <div key={index} className={styles.card}>
              {/* header */}
              <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>{appointment.serviceType}</h5>
                {appointment.status === 1 && (
                  <span className={styles.statusBadgeGreen1}>✔ Confirmed</span>
                )}
                {appointment.status === 2 && (
                  <span className={styles.statusBadgeOrange1}>⏳ Pending</span>
                )}
                {(!appointment.status || appointment.status > 2) && (
                  <span className={styles.statusBadgeRed1}>❌ Not Scheduled</span>
                )}
              </div>

              {/* body */}
              <div className={styles.cardBody}>
                <div className={styles.Info}>
                  <p><strong>Doctor:</strong> {appointment.doctorEmail}</p>
                  <p><strong>Organization:</strong> {appointment.doctorOrganization}</p>
                  <p><strong>User Email:</strong> {appointment.userEmail}</p>
                  <p><strong>Age:</strong> {appointment.userAge}</p>
                  <p><strong>Mobile:</strong> {appointment.userMobile}</p>
                </div>

                
                {appointment.status === 1 && (
                  <span
                    className={styles.statusBadgeGreen}
                    onClick={() => FetchTime(appointment.doctorEmail,appointment.status)}
                    style={{ cursor: "pointer" }}
                  >
                    <button>Get Your Time</button>
                    {times[appointment.doctorEmail] && (
                      <div>Time: {times[appointment.doctorEmail]}</div>
                    )}
                  </span>
                )}
                {appointment.status === 2 && (
                  <span
                    className={styles.statusBadgeOrange}
                    onClick={() => FetchTime(appointment.doctorEmail.appointment.status)}
                    style={{ cursor: "pointer" }}
                  >
                    <button>Get Your Time</button>
                    {times[appointment.doctorEmail] && (
                      <div>Time: {times[appointment.doctorEmail]}</div>
                    )}
                  </span>
                )}
                {(!appointment.status || appointment.status > 2) && (
                  <span
                    className={styles.statusBadgeRed}
                    onClick={() => FetchTime(appointment.doctorEmail,appointment.status)}
                    style={{ cursor: "pointer" }}
                  >
                    <button>Get Your Time</button>
                    {times[appointment.doctorEmail] && (
                      <div>Time: {times[appointment.doctorEmail]}</div>
                    )}
                  </span>
                )}
              </div>

              {/* footer for doctors */}
              {userData?.category === "doctor" && (
                <div className={styles.cardFooter}>
                  <button className={styles.attendBtn} onClick={() => Attend(appointment)}>
                    Attend
                  </button>
                  <button className={styles.trashBtn}>Trash</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noData}>No Appointments Found</div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
