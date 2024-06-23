import { useState, useEffect } from "react";
import * as backend from "../../src/backend";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom";
import malePic from "../components/male.png";
import femalePic from "../components/female.png";

export default function Profile(props) {
  const [profile1, setProfile1] = useState([]);

  const getProfile = async () => {
    const profile = await backend.getProfile();
    setProfile1(profile);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const buildSubtitle = (profile1) => {
    const parts = [];
    if (profile1.gender) parts.push(profile1.gender);
    if (profile1.age) parts.push(profile1.age);
    if (profile1.program) parts.push(profile1.program);
    parts.push(firebase.auth().currentUser.email);

    return parts.join(" | ");
  };

  return (
    <div>
      {profile1.map((profile1, index) => {
        return (
          <div key={index} style={{ marginLeft: "15px" }}>
            <section className="section" id="about">
              <div className="columns has-same-height is-gapless">
                <div className="column">
                  <div
                    className="card-image"
                    style={{ marginLeft: "50px", marginTop: "10px" }}
                  >
                    <img
                      src={profile1.gender === "Female" ? femalePic : malePic}
                      width={"80%"}
                      alt="profile"
                    />
                    <p
                      style={{
                        marginLeft: "120px",
                        marginTop: "-10px",
                        color: "grey",
                      }}
                    >
                      Change the image by editing gender
                    </p>
                    <h3 className="title is-4" style={{ marginTop: "8px" }}>
                      Bio
                    </h3>
                    <div
                      className="container"
                      style={{ marginRight: "110px", marginTop: "-15px" }}
                    >
                      <p>{profile1.bio}</p>
                    </div>
                  </div>
                </div>

                <div className="column" style={{ marginRight: "50px" }}>
                  <div className="section-heading">
                    <h3 className="title is-2">
                      {firebase.auth().currentUser.displayName}
                    </h3>
                    <h4 className="subtitle is-5">{buildSubtitle(profile1)}</h4>
                  </div>
                  <br />
                  <div className="card">
                    <div className="card-content">
                      <div style={{ textAlign: "right" }}>
                        <Link
                          to="/ProfileEdit"
                          state={{ userId: firebase.auth().currentUser.uid }}
                        >
                          <button className="button is-info">
                            Edit Profile
                          </button>
                        </Link>
                      </div>
                      <div className="content">
                        <table className="table-profile">
                          <tbody>
                            <tr>
                              <th colSpan="1"></th>
                              <th colSpan="2"></th>
                            </tr>
                            <tr>
                              <td>
                                <b>Total Budget</b>
                              </td>
                              <td>{profile1.totalBudget}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Availability</b>
                              </td>
                              <td>{profile1.availability}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Looking in</b>
                              </td>
                              <td>{profile1.lookingIn}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Amenities Required</b>
                              </td>
                              <td>{profile1.amenitiesRequired}</td>
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
                              <th colSpan="1"></th>
                              <th colSpan="2"></th>
                            </tr>
                            <tr>
                              <td>
                                <b>Gender</b>
                              </td>
                              <td>{profile1.gender}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Age</b>
                              </td>
                              <td>{profile1.age}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Profession</b>
                              </td>
                              <td>{profile1.program}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Smoker?</b>
                              </td>
                              <td>{profile1.smoker}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Any pets?</b>
                              </td>
                              <td>{profile1.anyPets}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Languages</b>
                              </td>
                              <td>{profile1.languages}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Sleep at</b>
                              </td>
                              <td>{profile1.sleepAt}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Wake up at</b>
                              </td>
                              <td>{profile1.wakeUpAt}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Interests</b>
                              </td>
                              <td>{profile1.interests}</td>
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
                              <th colSpan="1"></th>
                              <th colSpan="2"></th>
                            </tr>
                            <tr>
                              <td>
                                <b>Smoker OK?</b>
                              </td>
                              <td>{profile1.smokerOk}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Pets OK?</b>
                              </td>
                              <td>{profile1.petsOk}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Gender</b>
                              </td>
                              <td>{profile1.genderR}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
