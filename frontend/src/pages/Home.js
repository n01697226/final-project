import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGet } from "../api";

function Home() {
  var [vehicles, setVehicles] = useState([]);
  var navigate = useNavigate();

  async function loadVehicles() {
    var data = await apiGet("/vehicles");
    if (Array.isArray(data)) {
      setVehicles(data);
    } else {
      setVehicles([]);
    }
  }

  function goAddExpenseFor(id) {
    navigate("/expenses?vehicleId=" + id);
  }

  useEffect(function () {
    loadVehicles();
  }, []);

  return (
    <div>
      <div className="card">
        <h2>
          Track your vehicle expenses by category and time. Keep it simple and
          clear.
        </h2>
        <ul>
          <li>Register your vehicle (make, model, year)</li>
          <li>Log expenses: gas, maintenance, insurance, cosmetic upgrades</li>
          <li>View totals weekly, monthly, yearly on Overview</li>
        </ul>
        <p className="badge">
          Tip: Use Vehicles page to add or edit your cars.
        </p>
      </div>

      <div className="card">
        <h2>My Vehicles</h2>
        {vehicles.length === 0 ? (
          <p>
            No vehicles yet. <Link to="/vehicles">Add one here</Link>.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(function (v) {
                return (
                  <tr key={v._id}>
                    <td>{v.make}</td>
                    <td>{v.model}</td>
                    <td>{v.year}</td>
                    <td>
                      <button
                        onClick={function () {
                          goAddExpenseFor(v._id);
                        }}
                      >
                        Add Expense
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: 10 }}>
          <Link to="/vehicles">
            <button className="secondary">Manage Vehicles</button>
          </Link>{" "}
          <Link to="/expenses">
            <button className="secondary">Go to Expenses</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
