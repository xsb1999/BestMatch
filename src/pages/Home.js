import { useState, useEffect, useRef } from "react";
import * as backend from "../../src/backend";
import { Link } from "react-router-dom";
import malePic from "../components/male.png";
import femalePic from "../components/female.png";
import "bulma/css/bulma.min.css";
import "../App.css";

export default function Home(props) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterGender, setFilterGender] = useState("");
  const [filterSmoker, setFilterSmoker] = useState("");
  const [filterLanguages, setFilterLanguages] = useState("");
  const [filterPets, setFilterPets] = useState("");
  const [filterAgeRange, setFilterAgeRange] = useState([]);
  const [filterLocation, setFilterLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ageDropdownOpen, setAgeDropdownOpen] = useState(false);
  const ageDropdownRef = useRef(null);
  const [savedUsers, setSavedUsers] = useState(new Set());

  const getProfiles = async () => {
    const allUsers = await backend.getAllProfiles();
    const savedProfiles = await backend.getSavedProfiles();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
    setSavedUsers(new Set(savedProfiles.map((user) => user.userId)));
  };

  useEffect(() => {
    getProfiles();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [
    filterGender,
    filterSmoker,
    filterLanguages,
    filterPets,
    filterAgeRange,
    filterLocation,
    searchQuery,
  ]);

  const filterUsers = () => {
    let filtered = users;

    if (filterGender) {
      filtered = filtered.filter((user) => user.gender === filterGender);
    }

    if (filterSmoker) {
      filtered = filtered.filter((user) => user.smoker === filterSmoker);
    }

    if (filterLanguages) {
      filtered = filtered.filter(
        (user) => user.languages && user.languages.includes(filterLanguages)
      );
    }

    if (filterPets) {
      filtered = filtered.filter((user) => user.anyPets === filterPets);
    }

    if (filterLocation) {
      filtered = filtered.filter((user) => user.lookingIn === filterLocation);
    }

    if (filterAgeRange.length > 0) {
      filtered = filtered.filter((user) => {
        return filterAgeRange.some((age) => {
          if (age === "18-25") return user.age >= 18 && user.age <= 25;
          if (age === "26-35") return user.age >= 26 && user.age <= 35;
          if (age === "36-45") return user.age >= 36 && user.age <= 45;
          if (age === "46-60") return user.age >= 46 && user.age <= 60;
          if (age === "60+") return user.age > 60;
          return false;
        });
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.program && user.program.toLowerCase().includes(query)) ||
          (user.languages && user.languages.toLowerCase().includes(query)) ||
          (user.anyPets && user.anyPets.toLowerCase().includes(query)) ||
          (user.sleepAt && user.sleepAt.toLowerCase().includes(query)) ||
          (user.wakeUpAt && user.wakeUpAt.toLowerCase().includes(query)) ||
          (user.interests && user.interests.toLowerCase().includes(query))
        );
      });
    }

    setFilteredUsers(filtered);
  };

  const handleAgeRangeChange = (e) => {
    const { value } = e.target;
    setFilterAgeRange((prev) =>
      prev.includes(value)
        ? prev.filter((age) => age !== value)
        : [...prev, value]
    );
  };

  const resetFilters = () => {
    setFilterGender("");
    setFilterSmoker("");
    setFilterLanguages("");
    setFilterPets("");
    setFilterAgeRange([]);
    setFilterLocation("");
    setSearchQuery("");
  };

  const toggleAgeDropdown = () => {
    setAgeDropdownOpen(!ageDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (
      ageDropdownRef.current &&
      !ageDropdownRef.current.contains(event.target)
    ) {
      setAgeDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const uniqueLocations = [
    ...new Set(
      users.map((user) => user.lookingIn).filter((location) => location)
    ),
  ];
  const uniqueLanguages = [
    ...new Set(
      users.map((user) => user.languages).filter((language) => language)
    ),
  ];

  const selectedAgeText =
    filterAgeRange.length > 0
      ? `${filterAgeRange.length} age range${
          filterAgeRange.length > 1 ? "s" : ""
        } selected`
      : "Select Age Range";

  const showAlert = (message, type) => {
    const alert = document.getElementById("bulma-alert");
    alert.innerText = message;
    alert.className = `notification ${type} show`;
    setTimeout(() => {
      alert.classList.remove("show");
    }, 2500);
  };

  const handleSave = async (user) => {
    let save = await backend.addToSaved(user);
    if (save === true) {
      setSavedUsers((prev) => new Set(prev).add(user.userId));
      showAlert("You have saved the user successfully.", "is-success");
    } else {
      showAlert("You have already saved this user!", "is-danger");
    }
  };

  return (
    <div style={{ marginLeft: "50px", marginTop: "35px", marginRight: "50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="title" style={{ marginLeft: "13px" }}>
          Roommates Exploration
        </h1>
        <input
          className="input"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
      </div>

      <div className="box" style={{ marginBottom: "20px" }}>
        <div className="field is-grouped is-grouped-multiline">
          <div className="control">
            <label className="label" style={{ marginRight: "10px" }}>
              Gender:
            </label>
            <div className="select">
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="control" style={{ marginLeft: "20px" }}>
            <label className="label" style={{ marginRight: "10px" }}>
              Smoker:
            </label>
            <div className="select">
              <select
                value={filterSmoker}
                onChange={(e) => setFilterSmoker(e.target.value)}
              >
                <option value="">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div className="control" style={{ marginLeft: "20px" }}>
            <label className="label" style={{ marginRight: "10px" }}>
              Languages:
            </label>
            <div className="select">
              <select
                value={filterLanguages}
                onChange={(e) => setFilterLanguages(e.target.value)}
              >
                <option value="">All</option>
                {uniqueLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="control" style={{ marginLeft: "20px" }}>
            <label className="label" style={{ marginRight: "10px" }}>
              Any Pets:
            </label>
            <div className="select">
              <select
                value={filterPets}
                onChange={(e) => setFilterPets(e.target.value)}
              >
                <option value="">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div className="control" style={{ marginLeft: "20px" }}>
            <label className="label" style={{ marginRight: "10px" }}>
              Location:
            </label>
            <div className="select">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="">All</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="control" style={{ marginLeft: "20px" }}>
            <label className="label" style={{ marginBottom: "10px" }}>
              Age Range:
            </label>
            <div
              className={`dropdown ${ageDropdownOpen ? "is-active" : ""}`}
              ref={ageDropdownRef}
            >
              <div className="dropdown-trigger" onClick={toggleAgeDropdown}>
                <button
                  className="button"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                >
                  <span>{selectedAgeText}</span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                  <label className="dropdown-item checkbox">
                    <input
                      type="checkbox"
                      value="18-25"
                      checked={filterAgeRange.includes("18-25")}
                      onChange={handleAgeRangeChange}
                    />
                    &nbsp;18-25
                  </label>
                  <label className="dropdown-item checkbox">
                    <input
                      type="checkbox"
                      value="26-35"
                      checked={filterAgeRange.includes("26-35")}
                      onChange={handleAgeRangeChange}
                    />
                    &nbsp;26-35
                  </label>
                  <label className="dropdown-item checkbox">
                    <input
                      type="checkbox"
                      value="36-45"
                      checked={filterAgeRange.includes("36-45")}
                      onChange={handleAgeRangeChange}
                    />
                    &nbsp;36-45
                  </label>
                  <label className="dropdown-item checkbox">
                    <input
                      type="checkbox"
                      value="46-60"
                      checked={filterAgeRange.includes("46-60")}
                      onChange={handleAgeRangeChange}
                    />
                    &nbsp;46-60
                  </label>
                  <label className="dropdown-item checkbox">
                    <input
                      type="checkbox"
                      value="60+"
                      checked={filterAgeRange.includes("60+")}
                      onChange={handleAgeRangeChange}
                    />
                    &nbsp;60+
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            className="control"
            style={{
              marginLeft: "20px",
              marginTop: "34px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button className="button is-light" onClick={resetFilters}>
              Reset
            </button>
            <span style={{ marginLeft: "20px" }}>
              {filteredUsers.length} result
              {filteredUsers.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div id="bulma-alert" className="notification is-success is-hidden">
        <button
          className="delete"
          onClick={() =>
            document.getElementById("bulma-alert").classList.add("is-hidden")
          }
        ></button>
        <strong>Alert!</strong> You have saved the user successfully.
      </div>
      <div
        id="bulma-alert-fail-to-save"
        className="notification is-danger is-hidden"
      >
        <button
          className="delete"
          onClick={() =>
            document
              .getElementById("bulma-alert-fail-to-save")
              .classList.add("is-hidden")
          }
        ></button>
        <strong>Alert!</strong> You have already saved it!
      </div>

      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          alignContent: "flex-start",
        }}
      >
        {filteredUsers.map((user, index) => {
          const isSaved = savedUsers.has(user.userId);
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
                        <p className="subtitle is-6">{user.program}</p>
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
                              <p style={{ marginRight: "18px" }}>
                                <b>Wake up at </b>
                              </p>
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
                      Profile
                    </Link>
                    <button
                      className={`button ${
                        isSaved ? "is-light" : "is-info"
                      } card-footer-item`}
                      disabled={isSaved}
                      onClick={() => handleSave(user)}
                    >
                      {isSaved ? "Saved" : "Save"}
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
