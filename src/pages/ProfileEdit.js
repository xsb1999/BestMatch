import { useState, useEffect } from "react";
import * as backend from "../backend";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom";
import malePic from "../components/male.png";
import femalePic from "../components/female.png";
import "bulma/css/bulma.min.css";
import "../App.css";

export default function ProfileEdit(props) {
  const [profile, setProfile] = useState([]);

  const getProfile = async () => {
    const profile = await backend.getProfile();
    setProfile(profile);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const showAlert = (message, type) => {
    const alert = document.getElementById("bulma-alert");
    alert.innerText = message;
    alert.className = `notification ${type} show`;
    setTimeout(() => {
      alert.classList.remove("show");
    }, 2500);
  };

  const buildSubtitle = (profile) => {
    const parts = [];
    if (profile.gender) parts.push(profile.gender);
    if (profile.age) parts.push(profile.age);
    if (profile.program) parts.push(profile.program);
    parts.push(firebase.auth().currentUser.email);

    return parts.join(" | ");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await backend.updateProfile(
      {
        id: profile[0].id,
        totalBudget: e.target["totalBudget"].value,
        availability: e.target["availability"].value,
        lookingIn: e.target["lookingIn"].value,
        amenitiesRequired: e.target["amenitiesRequired"].value,
        program: e.target["program"].value,
        gender: e.target["gender"].value,
        age: e.target["age"].value,
        smoker: e.target["smoker"].value,
        anyPets: e.target["anyPets"].value,
        languages: e.target["languages"].value,
        sleepAt: e.target["sleepAt"].value,
        wakeUpAt: e.target["wakeUpAt"].value,
        interests: e.target["interests"].value,
        smokerOk: e.target["smokerOk"].value,
        petsOk: e.target["petsOk"].value,
        genderR: e.target["genderR"].value,
        bio: e.target["bio"].value,
      },
      showAlert
    );

    showAlert("Edit Successful!", "is-success");
    setTimeout(() => {
      window.location.href = "/Profile";
    }, 900);
  };

  return (
    <div>
      <div id="bulma-alert" className="notification is-hidden">
        <button
          className="delete"
          onClick={() =>
            document.getElementById("bulma-alert").classList.add("is-hidden")
          }
        ></button>
        <strong></strong>
      </div>

      {profile.map((profile, index) => {
        return (
          <div style={{ marginLeft: "15px" }} key={index}>
            <form onSubmit={onSubmit}>
              <section className="section" id="about">
                <div className="columns has-same-height is-gapless">
                  <div className="column">
                    <div
                      className="card-image"
                      style={{ marginLeft: "50px", marginTop: "10px" }}
                    >
                      <img
                        src={profile.gender === "Female" ? femalePic : malePic}
                        width={"80%"}
                        alt="profile"
                      />
                      <h3 className="title is-4" style={{ marginTop: "5px" }}>
                        Bio
                      </h3>
                      <div
                        className="container"
                        style={{ marginRight: "110px", marginTop: "-15px" }}
                      >
                        <textarea
                          name="bio"
                          className="textarea is-info"
                          placeholder="Bio"
                          defaultValue={profile.bio}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="column" style={{ marginRight: "50px" }}>
                    <div className="section-heading">
                      <h3 className="title is-2">
                        {firebase.auth().currentUser.displayName}
                      </h3>
                      <h4 className="subtitle is-5">
                        {buildSubtitle(profile)}
                      </h4>
                    </div>
                    <br />
                    <div className="card">
                      <div className="card-content">
                        <div style={{ textAlign: "right" }}>
                          <Link
                            to="/Profile"
                            state={{ userId: firebase.auth().currentUser.uid }}
                          >
                            <button className="button is-danger">Cancel</button>
                          </Link>
                          &nbsp;&nbsp;
                          <button className="button is-info">Submit</button>
                        </div>
                        <div className="content">
                          <table className="table-profile">
                            <tbody>
                              <tr>
                                <td>
                                  <b>Total Budget</b>
                                </td>
                                <td>
                                  <input
                                    name="totalBudget"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Total Budget"
                                    defaultValue={profile.totalBudget}
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Availability</b>
                                </td>
                                <td>
                                  <input
                                    name="availability"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Availability"
                                    defaultValue={profile.availability}
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Looking in</b>
                                </td>
                                <td>
                                  <input
                                    name="lookingIn"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Looking in"
                                    defaultValue={profile.lookingIn}
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Amenities Required</b>
                                </td>
                                <td>
                                  <input
                                    name="amenitiesRequired"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Amenities Required"
                                    defaultValue={profile.amenitiesRequired}
                                  ></input>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <br />
                        <h3 className="title is-4">About Me</h3>
                        <div className="content">
                          <table className="table-profile">
                            <tbody>
                              <tr>
                                <td>
                                  <b>Gender</b>
                                </td>
                                <td>
                                  <div className="select is-info">
                                    <select name="gender">
                                      <option>
                                        {profile.gender != null
                                          ? profile.gender
                                          : "Male"}
                                      </option>
                                      <option>
                                        {profile.gender != null
                                          ? profile.gender === "Male"
                                            ? "Female"
                                            : "Male"
                                          : "Female"}
                                      </option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Age</b>
                                </td>
                                <td>
                                  <input
                                    name="age"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Age"
                                    defaultValue={profile.age}
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Profession</b>
                                </td>
                                <td>
                                  <input
                                    name="program"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Profession"
                                    defaultValue={profile.program}
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Smoker?</b>
                                </td>
                                <td>
                                  <div className="select is-info">
                                    <select name="smoker">
                                      <option>
                                        {profile.smoker != null
                                          ? profile.smoker
                                          : "Yes"}
                                      </option>
                                      <option>
                                        {profile.smoker != null
                                          ? profile.smoker === "Yes"
                                            ? "No"
                                            : "Yes"
                                          : "No"}
                                      </option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Any pets?</b>
                                </td>
                                <td>
                                  <div className="select is-info">
                                    <select name="anyPets">
                                      <option>
                                        {profile.anyPets != null
                                          ? profile.anyPets
                                          : "Yes"}
                                      </option>
                                      <option>
                                        {profile.anyPets != null
                                          ? profile.anyPets === "Yes"
                                            ? "No"
                                            : "Yes"
                                          : "No"}
                                      </option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Languages</b>
                                </td>
                                <td>
                                  <input
                                    name="languages"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Languages"
                                    defaultValue={profile.languages}
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Sleep at</b>
                                </td>
                                <td>
                                  <input
                                    name="sleepAt"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Sleep at"
                                    defaultValue={profile.sleepAt}
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Wake up at</b>
                                </td>
                                <td>
                                  <input
                                    name="wakeUpAt"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Wake up at"
                                    defaultValue={profile.wakeUpAt}
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Interests</b>
                                </td>
                                <td>
                                  <input
                                    name="interests"
                                    className="input is-info"
                                    type="text"
                                    placeholder="Interests"
                                    defaultValue={profile.interests}
                                  ></input>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <br />
                        <h3 className="title is-4">Roommate Preference</h3>
                        <div className="content">
                          <table className="table-profile">
                            <tbody>
                              <tr>
                                <td>
                                  <b>Smoker OK?</b>
                                </td>
                                <td>
                                  <div className="select is-info">
                                    <select name="smokerOk">
                                      <option>
                                        {profile.smokerOk != null
                                          ? profile.smokerOk
                                          : "Yes"}
                                      </option>
                                      <option>
                                        {profile.smokerOk != null
                                          ? profile.smokerOk === "Yes"
                                            ? "No"
                                            : "Yes"
                                          : "No"}
                                      </option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Pets OK?</b>
                                </td>
                                <td>
                                  <div className="select is-info">
                                    <select name="petsOk">
                                      <option>
                                        {profile.petsOk != null
                                          ? profile.petsOk
                                          : "Yes"}
                                      </option>
                                      <option>
                                        {profile.petsOk != null
                                          ? profile.petsOk === "Yes"
                                            ? "No"
                                            : "Yes"
                                          : "No"}
                                      </option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Gender</b>
                                </td>
                                <td>
                                  <div className="select is-info">
                                    <select name="genderR">
                                      <option>
                                        {profile.genderR != null
                                          ? profile.genderR
                                          : "Male"}
                                      </option>
                                      <option>
                                        {profile.genderR != null
                                          ? profile.genderR === "Male"
                                            ? "Female"
                                            : "Male"
                                          : "Female"}
                                      </option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>
        );
      })}
    </div>
  );
}
