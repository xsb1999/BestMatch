import { useState, useEffect } from "react";
import * as backend from "../../src/backend";
import { Link } from "react-router-dom";
import malePic from "../components/male.png";
import femalePic from "../components/female.png";
import "bulma/css/bulma.min.css";
import "../App.css";

export default function Saved(props) {
  const [users, setUsers] = useState([]);

  const getSavedProfiles = async () => {
    const allUsers = await backend.getSavedProfiles();
    setUsers(allUsers);
  };

  useEffect(() => {
    getSavedProfiles();
  }, []);

  const showAlert = (message, type) => {
    const alert = document.getElementById("bulma-alert");
    alert.innerText = message;
    alert.className = `notification ${type} show`;
    setTimeout(() => {
      alert.classList.remove("show");
    }, 2500);
  };

  return (
    <div style={{ marginLeft: "50px", marginTop: "35px", marginRight: "50px" }}>
      <div id="bulma-alert" className="notification is-hidden">
        <button
          className="delete"
          onClick={() =>
            document.getElementById("bulma-alert").classList.add("is-hidden")
          }
        ></button>
        <strong></strong>
      </div>

      <h1 className="title" style={{ marginLeft: "13px" }}>
        Saved Roommates
      </h1>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          alignContent: "flex-start",
        }}
      >
        {users.map((user, index) => {
          return (
            <div key={index} style={{ flex: "0 0 33.33%" }}>
              <div className="column">
                <div className="card">
                  <div className="card-content">
                    <div className="media">
                      <div className="media-left">
                        <figure className="image is-48x48">
                          <img
                            src={user.gender === "Female" ? femalePic : malePic}
                            width={"80%"}
                            alt="profile"
                          />
                        </figure>
                      </div>
                      <div className="media-content">
                        <p className="title is-4">{user.name}</p>
                        <p className="subtitle is-6">{user.username}</p>
                      </div>
                    </div>
                    <div>
                      <table
                        className="table-profile"
                        style={{ marginLeft: "5px" }}
                      >
                        <tbody>
                          <tr>
                            <td>
                              <b>Age </b>
                            </td>
                            <td>{user.age}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Smoker? </b>
                            </td>
                            <td>{user.smoker}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Any pets? </b>
                            </td>
                            <td>{user.anyPets}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Sleep at </b>
                            </td>
                            <td>{user.sleepAt}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Wake up at </b>
                            </td>
                            <td>{user.wakeUpAt}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Interests</b>
                            </td>
                            <td>{user.interests}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <footer className="card-footer">
                    <Link
                      to="/ProfileOthers"
                      state={{ userId: user.userId }}
                      className="button is-info card-footer-item"
                    >
                      <button className="button is-info card-footer-item">
                        Profile
                      </button>
                    </Link>
                    &nbsp;&nbsp;
                    <button
                      className="button is-danger card-footer-item"
                      onClick={async () => {
                        await backend.deleteSaved(user, showAlert);
                        getSavedProfiles();
                      }}
                    >
                      Delete
                    </button>
                  </footer>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
