import React, { useEffect, useState } from "react";
import { apiGet } from "../api";

function sumByCategory(items) {
  var totals = {
    gas: 0,
    maintenance: 0,
    insurance: 0,
    cosmetic: 0,
    loan: 0,
    other: 0,
  };
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (totals[it.category] === undefined) {
      totals[it.category] = 0;
    }
    totals[it.category] += Number(it.amount || 0);
  }
  return totals;
}

function toLocalDateOnly(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    var parts = dateStr.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function filterByRange(items, type) {
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return items.filter(function (it) {
    var expenseDate = toLocalDateOnly(it.date);
    if (!expenseDate) return false;

    if (type === "week") {
      var oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      return expenseDate >= oneWeekAgo && expenseDate <= today;
    }
    if (type === "month") {
      var firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return expenseDate >= firstOfMonth && expenseDate <= today;
    }
    if (type === "year") {
      var firstOfYear = new Date(today.getFullYear(), 0, 1);
      return expenseDate >= firstOfYear && expenseDate <= today;
    }
    return true;
  });
}

function BarRow(props) {
  var width = props.max > 0 ? Math.round((props.value / props.max) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="bar-label">
        {props.label}: ${props.value.toFixed(2)}
      </div>
      <div className="bar">
        <span style={{ width: width + "%" }}></span>
      </div>
    </div>
  );
}

function Overview() {
  var [expenses, setExpenses] = useState([]);
  var [vehicles, setVehicles] = useState([]);
  var [range, setRange] = useState("month");
  var [selectedVehicleId, setSelectedVehicleId] = useState("");

  async function load() {
    var vs = await apiGet("/vehicles");
    setVehicles(Array.isArray(vs) ? vs : []);

    var ex = await apiGet("/expenses");
    setExpenses(Array.isArray(ex) ? ex : []);
  }

  useEffect(function () {
    load();
  }, []);

  var filteredExpenses = selectedVehicleId
    ? expenses.filter(function (ex) {
        return ex.vehicleId === selectedVehicleId;
      })
    : expenses;

  var filteredByRange = filterByRange(filteredExpenses, range);
  var totals = sumByCategory(filteredByRange);

  var max = Math.max(
    totals.gas,
    totals.maintenance,
    totals.insurance,
    totals.cosmetic,
    totals.loan,
    totals.other,
    0
  );

  function totalAmount(obj) {
    var s = 0;
    for (var k in obj) s += obj[k];
    return s;
  }

  return (
    <div className="card">
      <h2>Overview</h2>

      {vehicles.length > 1 && (
        <div className="btn-container">
          <button
            className={selectedVehicleId === "" ? "active" : ""}
            onClick={() => setSelectedVehicleId("")}
          >
            All Cars
          </button>
          {vehicles.map(function (v) {
            return (
              <button
                key={v._id}
                className={selectedVehicleId === v._id ? "active" : ""}
                onClick={() => setSelectedVehicleId(v._id)}
              >
                {v.make} {v.model} ({v.year})
              </button>
            );
          })}
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label>Range</label>
        <select
          value={range}
          onChange={function (e) {
            setRange(e.target.value);
          }}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <BarRow label="Gas" value={totals.gas} max={max} />
      <BarRow label="Maintenance" value={totals.maintenance} max={max} />
      <BarRow label="Insurance" value={totals.insurance} max={max} />
      <BarRow label="Cosmetic" value={totals.cosmetic} max={max} />
      <BarRow label="Loan" value={totals.loan} max={max} />
      <BarRow label="Other" value={totals.other} max={max} />
      <hr />
      <p>
        <b>Total:</b> ${totalAmount(totals).toFixed(2)}
      </p>
    </div>
  );
}

export default Overview;
