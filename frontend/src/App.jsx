import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Login from './components/Login';
import SignUp from './components/Signup';
import Navbar from './components/Navbar';
import About from './components/About';
import Profile from './components/Profile';
import HomePage from './Medical_Component/HomePage';
import Home from './components/Home';
import styles from "./CSS/App.module.css";
import Appointments from './components/Doctor/Appointments';
import Treatment from "./components/Doctor/Treatment";


// 🎬 Component Wrapper to Add Delays & Transitions
 function DelayedComponent({ children, delay = 500 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [delay]);

  return (
    <div className={`${styles.fadeIn} ${isVisible ? styles.show : ""}`}>
      {isVisible && children}
    </div>
  );
}

function App() {
  const [login, setlogin] = useState(false);
  const data = localStorage.getItem("Data");
   useEffect(() => {
    const data = localStorage.getItem("Data");
    if (data) {
      setlogin(true);
    }
  }, []); // Run only once on mount
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state

  return (
    <Router>
      <div className={`${styles.appContainer} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        {/* 🏥 Navbar */}
        <Navbar login={login} setlogin={setlogin} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* 📌 Page Content */}
        <div className={styles.pageContent}>
          <Routes>
            <Route path="/" element={<DelayedComponent><Home login={login} setlogin={setlogin} /></DelayedComponent>} />
            <Route path="/appointment" element={<Appointments/>}></Route>
            <Route path="/Doctors" element={<DelayedComponent delay={700}><HomePage login={login} setlogin={setlogin} /></DelayedComponent>} />
            <Route path="/login" element={<DelayedComponent delay={900}><Login login={login} setlogin={setlogin} /></DelayedComponent>} />
            <Route path="/signup" element={<DelayedComponent delay={1100}><SignUp login={login} setlogin={setlogin} /></DelayedComponent>} />
            <Route path="/about" element={<DelayedComponent delay={1300}><About login={login} setlogin={setlogin} /></DelayedComponent>} />
            <Route path="/profile" element={<DelayedComponent delay={1500}><Profile login={login} setlogin={setlogin} /></DelayedComponent>} />
            <Route path='/appointment/treatment' element={<Treatment></Treatment>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
