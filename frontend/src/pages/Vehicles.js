import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

function Vehicles() {
  var [list, setList] = useState([]);
  var [make, setMake] = useState("");
  var [model, setModel] = useState("");
  var [year, setYear] = useState("");

  async function load() {
    var data = await apiGet("/vehicles");
    setList(Array.isArray(data) ? data : []);
  }

  async function add(e) {
    e.preventDefault();
    if (!make || !model || !year) return;
    var created = await apiPost("/vehicles", {
      make: make,
      model: model,
      year: Number(year),
    });
    setMake("");
    setModel("");
    setYear("");
    load();
  }

  async function save(item) {
    var updated = await apiPut("/vehicles/" + item._id, {
      make: item.make,
      model: item.model,
      year: Number(item.year),
    });
    load();
  }

  async function remove(id) {
    await apiDelete("/vehicles/" + id);
    load();
  }

  useEffect(function () {
    load();
  }, []);

  return (
    <div>
      <div className="card">
        <h2>Add Vehicle</h2>

        <form onSubmit={add} className="row3">
          <div>
            <label>Make</label>
            <input
              value={make}
              onChange={function (e) {
                setMake(e.target.value);
              }}
            />
          </div>

          <div>
            <label>Model</label>
            <input
              value={model}
              onChange={function (e) {
                setModel(e.target.value);
              }}
            />
          </div>

          <div>
            <label>Year</label>
            <input
              value={year}
              onChange={function (e) {
                setYear(e.target.value);
              }}
            />
          </div>

          <div>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>My Vehicles</h2>

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
            {list.map(function (item) {
              return (
                <tr key={item._id}>
                  <td>
                    <input
                      value={item.make}
                      onChange={function (e) {
                        item.make = e.target.value;
                        setList([...list]);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      value={item.model}
                      onChange={function (e) {
                        item.model = e.target.value;
                        setList([...list]);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      value={item.year}
                      onChange={function (e) {
                        item.year = e.target.value;
                        setList([...list]);
                      }}
                    />
                  </td>
                  <td className="btn-container">
                    <button
                      onClick={function () {
                        save(item);
                      }}
                    >
                      Save
                    </button>

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

export default Vehicles;
