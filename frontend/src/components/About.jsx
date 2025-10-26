import React from "react";
import styles from "../CSS/About.module.css"; // Import external module CSS
import image1 from "../assets/1.webp";

import image3 from "../assets/Family.png";
import image2 from "../assets/2.webp";

function About() {
  return (
    <main className={styles.main}>
      <div className={`container ${styles.header}`}>
        <h1 className={styles.title}>About Us</h1>
        <p className={styles.subtitle}>Learn more about our mission, values, and the team behind HospCare.</p>
      </div>

      <div className="container marketing">
        <div className={`row featurette ${styles.featurette}`}>
          <div className="col-md-7">
            <h2 className={styles.featuretteHeading}>
              Our Mission <span>Bringing Healthcare Closer.</span>
            </h2>
            <p className="lead">
              At HospCare, we aim to provide seamless healthcare solutions, ensuring that patients and doctors can
              connect with ease. Our platform bridges the gap between medical professionals and those in need of care.
            </p>
          </div>
          <div className="col-md-5">
            <img src={image1} className="img-fluid w-50 h-80" alt="Our Mission" />
          </div>
        </div>

        <hr className="featurette-divider" />

        <div className={`row featurette ${styles.featurette}`}>
          <div className="col-md-7 order-md-2">
            <h2 className={styles.featuretteHeading}>
              Our Vision <span>A Healthier Tomorrow.</span>
            </h2>
            <p className="lead">
              We believe in a world where healthcare is accessible to everyone, powered by technology and innovation.
              Our team is dedicated to making healthcare appointments, medical history tracking, and patient-doctor
              communication effortless.
            </p>
          </div>
          <div className="col-md-5 order-md-1">
            <img src={image2} className="img-fluid w-50 h-80" alt="Our Vision" />
          </div>
        </div>

        <hr className="featurette-divider" />

        {/* Meet Our Team */}
        <div className={`container text-center my-5 ${styles.teamSection}`}>
          <h2 className="display-5">Meet Our Team</h2>
          <p className="lead">Our dedicated professionals working to improve healthcare accessibility.</p>
        </div>

        <div className={`row ${styles.teammember}`}>
  <div className="col-12 text-center">
    <img src={image3} alt="Founder" />
    <h3>Ritik Yadav</h3>
    <p>Founder & CEO</p>
  </div>
</div>


        <hr className="featurette-divider" />
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p className="float-end">
          <a href="#">Back to top</a>
        </p>
        <p>© 2024 HospCare · <a href="#">Privacy</a> · <a href="#">Terms</a></p>
      </footer>
    </main>
  );
}

export default About;
