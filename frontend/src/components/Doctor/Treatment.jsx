import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { bodyCheckupCategories } from "../../obj";
import styles from "../../CSS/Treatment.module.css";

function Treatment() {
  const [token, setToken] = useState("");
  const [patientDetails, setPatientDetails] = useState({});
  const [AllMediCalTests, setAllMediCalTests] = useState(bodyCheckupCategories);
  const [allMedicines, setAllMedicines] = useState([]);
  const [assignedMedicines, setAssignedMedicines] = useState([]);
  const [assignedTests, setAssignedTests] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("Token");
    const storedUser = localStorage.getItem("userDetails");

    if (!storedToken) {
      alert("⚠️ Token missing. Please log in again.");
      return;
    }

    setToken(storedToken);
    setPatientDetails(JSON.parse(storedUser));
  }, []);

  // Fetch medicines from backend
  useEffect(() => {
    if (!token) return;

    async function fetchMedicines() {
      try {
        const res = await fetch("http://localhost:5000/api/Medical/Medicine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAllMedicines(data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        alert("❌ Failed to fetch medicine data.");
      }
    }

    fetchMedicines();
  }, [token]);

  const addMedicineRow = () => {
    setAssignedMedicines([
      { medicine: "", quantity: "", search: "", showSuggestions: false },
      ...assignedMedicines,
    ]);
  };

  const addTestRow = () => {
    setAssignedTests([{ test: "", search: "", showSuggestions: false }, ...assignedTests]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...assignedMedicines];
    updated[index][field] = value;
    if (field === "search") updated[index].showSuggestions = true;
    setAssignedMedicines(updated);
  };

  const handleTestChange = (index, field, value) => {
    const updated = [...assignedTests];
    updated[index][field] = value;
    if (field === "search") updated[index].showSuggestions = true;
    setAssignedTests(updated);
  };

  const handleMedicineEnter = (index) => addMedicineRow();
  const handleTestEnter = (index) => addTestRow();

  const selectMedicine = (index, medName) => {
    const updated = [...assignedMedicines];
    updated[index].medicine = medName;
    updated[index].search = medName;
    updated[index].showSuggestions = false;
    setAssignedMedicines(updated);
  };

  const selectTest = (index, testName) => {
    const updated = [...assignedTests];
    updated[index].test = testName;
    updated[index].search = testName;
    updated[index].showSuggestions = false;
    setAssignedTests(updated);
  };

  const removeMedicineRow = (index) => {
    setAssignedMedicines(assignedMedicines.filter((_, i) => i !== index));
  };

  const removeTestRow = (index) => {
    setAssignedTests(assignedTests.filter((_, i) => i !== index));
  };

  // ✅ Submit handler
  const handleSubmit = async () => {
    // Prepare payload
    const payload = {
      patientEmail: patientDetails.userEmail,
      patientMobile: patientDetails.userMobile,
      medicines: assignedMedicines.map((med) => ({
        name: med.medicine,
        quantity: med.quantity,
      })),
      tests: assignedTests.map((test) => ({ name: test.test })),
    };

    console.log("Submitting Data:", payload);

    try {
      const res = await fetch("http://localhost:5000/api/Medical/SubmitTreatment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit");

      const data = await res.json();
      alert("✅ Treatment submitted successfully!");
      console.log(data);

      // Reset fields
      setAssignedMedicines([]);
      setAssignedTests([]);
    } catch (err) {
      console.error("Submission Error:", err);
      alert("❌ Failed to submit treatment.");
    }
  };

  return (
    <div className={styles.treatmentContainer}>
      <div className="card shadow-sm m-1 p-4">
        {/* Patient Info */}
        <h4 className="text-primary display-6 text-center">PATIENT INFO</h4>
        <div className="mb-0 display-7 d-flex flex-row justify-content-between align-items-center">
          <p>
            <strong>Email:</strong> {patientDetails.userEmail || "N/A"}
          </p>
          <p>
            <strong>Mobile:</strong> {patientDetails.userMobile || "N/A"}
          </p>
        </div>

        {/* Medicine & Test Section */}
        <div className="mt-4 p-3 border rounded">
          <div className="mb-3 p-1 d-flex gap-5 p-2 justify-content-center">
            <button className="btn btn-sm btn-primary" onClick={addMedicineRow}>
              + Add Medicine
            </button>
            <button className="btn btn-sm btn-success" onClick={addTestRow}>
              + Add Test
            </button>
          </div>

          {/* Medicine Table */}
          {assignedMedicines.length > 0 && (
            <table className="table table-bordered mb-4">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Medicine (Search)</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedMedicines.map((row, index) => {
                  const suggestions = allMedicines.filter((med) =>
                    med[" Name "]?.trim().toLowerCase().includes(row.search.toLowerCase())
                  );
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td style={{ position: "relative" }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search medicine"
                          value={row.search}
                          onChange={(e) => handleMedicineChange(index, "search", e.target.value)}
                        />
                        {row.search && row.showSuggestions && suggestions.length > 0 && (
                          <ul
                            className="list-group position-absolute w-100"
                            style={{ zIndex: 1000, maxHeight: "150px", overflowY: "auto" }}
                          >
                            {suggestions.map((med) => (
                              <li
                                key={med._id}
                                className="list-group-item list-group-item-action"
                                onClick={() => selectMedicine(index, med[" Name "]?.trim())}
                                style={{ cursor: "pointer" }}
                              >
                                {med[" Name "]?.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={row.quantity}
                          onChange={(e) => handleMedicineChange(index, "quantity", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleMedicineEnter(index);
                          }}
                        />
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => removeMedicineRow(index)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Body Test Table */}
          {assignedTests.length > 0 && (
            <>
              <h4 className="text-info">Assign Body Tests</h4>
              <table className="table table-bordered mb-4">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Test Name (Search)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTests.map((row, index) => {
                    const suggestions = AllMediCalTests.filter((test) =>
                      test.toLowerCase().includes(row.search.toLowerCase())
                    );
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td style={{ position: "relative" }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search test"
                            value={row.search}
                            onChange={(e) => handleTestChange(index, "search", e.target.value)}
                          />
                          {row.search && row.showSuggestions && suggestions.length > 0 && (
                            <ul
                              className="list-group position-absolute w-100"
                              style={{ zIndex: 1000, maxHeight: "150px", overflowY: "auto" }}
                            >
                              {suggestions.map((test, i) => (
                                <li
                                  key={i}
                                  className="list-group-item list-group-item-action"
                                  onClick={() => selectTest(index, test)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {test}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => removeTestRow(index)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Treatment;
