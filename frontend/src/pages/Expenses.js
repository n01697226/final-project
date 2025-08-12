import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

function getQueryVehicleId() {
  try {
    var params = new URLSearchParams(window.location.search);
    return params.get("vehicleId") || "";
  } catch (e) {
    return "";
  }
}

function Expenses() {
  var [vehicles, setVehicles] = useState([]);
  var [list, setList] = useState([]);

  var [vehicleId, setVehicleId] = useState(getQueryVehicleId());
  var [category, setCategory] = useState("gas");
  var [amount, setAmount] = useState("");
  var [date, setDate] = useState("");
  var [note, setNote] = useState("");

  async function load() {
    var vs = await apiGet("/vehicles");
    setVehicles(Array.isArray(vs) ? vs : []);
    var ex = await apiGet("/expenses");
    setList(Array.isArray(ex) ? ex : []);
  }

  async function add(e) {
    e.preventDefault();
    if (!vehicleId || !category || !amount || !date) return;
    await apiPost("/expenses", {
      vehicleId: vehicleId,
      category: category,
      amount: Number(amount),
      date: date,
      note: note,
    });
    setAmount("");
    setDate("");
    setNote("");
    load();
  }

  async function save(item) {
    await apiPut("/expenses/" + item._id, {
      vehicleId: item.vehicleId,
      category: item.category,
      amount: Number(item.amount),
      date: item.date,
      note: item.note || "",
    });
    load();
  }

  async function remove(id) {
    await apiDelete("/expenses/" + id);
    load();
  }

  useEffect(function () {
    load();
  }, []);

  useEffect(
    function () {
      var q = getQueryVehicleId();
      if (q && !vehicleId) {
        setVehicleId(q);
      }
    },
    [vehicles]
  );

  return (
    <div>
      <div className="card">
        <h2>Add Expense</h2>
        <form onSubmit={add} className="row">
          <div>
            <label>Vehicle</label>
            <select
              value={vehicleId}
              onChange={function (e) {
                setVehicleId(e.target.value);
              }}
            >
              <option value="">Select</option>
              {vehicles.map(function (v) {
                return (
                  <option key={v._id} value={v._id}>
                    {v.make} {v.model} ({v.year})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={function (e) {
                setCategory(e.target.value);
              }}
            >
              <option value="gas">Gas</option>
              <option value="maintenance">Maintenance</option>
              <option value="insurance">Insurance</option>
              <option value="cosmetic">Cosmetic</option>
            </select>
          </div>
          <div>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={function (e) {
                setAmount(e.target.value);
              }}
            />
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={function (e) {
                setDate(e.target.value);
              }}
            />
          </div>
          <div style={{ gridColumn: "1 / span 2" }}>
            <label>Note</label>
            <input
              value={note}
              onChange={function (e) {
                setNote(e.target.value);
              }}
            />
          </div>
          <div>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>My Expenses</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(function (item) {
              return (
                <tr key={item._id}>
                  <td>
                    <select
                      value={item.vehicleId}
                      onChange={function (e) {
                        item.vehicleId = e.target.value;
                        setList([...list]);
                      }}
                    >
                      {vehicles.map(function (v) {
                        return (
                          <option key={v._id} value={v._id}>
                            {v.make} {v.model} ({v.year})
                          </option>
                        );
                      })}
                    </select>
                  </td>
                  <td>
                    <select
                      value={item.category}
                      onChange={function (e) {
                        item.category = e.target.value;
                        setList([...list]);
                      }}
                    >
                      <option value="gas">Gas</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="insurance">Insurance</option>
                      <option value="cosmetic">Cosmetic</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={function (e) {
                        item.amount = e.target.value;
                        setList([...list]);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={item.date}
                      onChange={function (e) {
                        item.date = e.target.value;
                        setList([...list]);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      value={item.note || ""}
                      onChange={function (e) {
                        item.note = e.target.value;
                        setList([...list]);
                      }}
                    />
                  </td>
                  <td>
                    <button
                      className="secondary"
                      onClick={function () {
                        save(item);
                      }}
                    >
                      Save
                    </button>{" "}
                    <button
                      className="danger"
                      onClick={function () {
                        remove(item._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenses;
