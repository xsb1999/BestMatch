import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const config = {
  apiKey: "AIzaSyD1YuA--X2QmcVBMarVCot3jEcadZvZhqI",
  authDomain: "best-match-ad834.firebaseapp.com",
  projectId: "best-match-ad834",
  storageBucket: "best-match-ad834.appspot.com",
  messagingSenderId: "412822855143",
  appId: "1:412822855143:web:da223fdd1af02bd2b87142",
  measurementId: "G-PR7RPDXDPQ",
};

firebase.initializeApp(config);
const firestoreDb = firebase.firestore();

export const addToProfile = async () => {
  const profiles = await getProfile();
  if (profiles.length === 0) {
    await firestoreDb.collection("profiles").add({
      username: firebase.auth().currentUser.email,
      name: firebase.auth().currentUser.displayName,
      userId: firebase.auth().currentUser.uid,
    });
  }
};

export const getProfile = async () => {
  const querySnapshot = await firestoreDb
    .collection("profiles")
    .where("userId", "==", firebase.auth().currentUser.uid)
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return results;
};

export const getOthersProfile = async (userId) => {
  if (userId === null) {
    userId = firebase.auth().currentUser.uid;
  }
  const querySnapshot = await firestoreDb
    .collection("profiles")
    .where("userId", "==", userId)
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return results;
};

export const getSavedProfiles = async () => {
  const querySnapshot = await firestoreDb
    .collection("saved")
    .where("userId", "==", firebase.auth().currentUser.uid)
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  let savedUserIds = [];
  results.forEach((r) => {
    savedUserIds.push(r.savedUserId);
  });
  let results2 = [];
  if (savedUserIds.length > 0) {
    const querySnapshot2 = await firestoreDb
      .collection("profiles")
      .where("userId", "in", savedUserIds)
      .get();
    querySnapshot2.forEach((doc) => {
      results2.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  }
  return results2;
};

export const addToSaved = async (s) => {
  let flag = true;
  const querySnapshot = await firestoreDb
    .collection("saved")
    .where("userId", "==", firebase.auth().currentUser.uid)
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  results.forEach((r) => {
    if (r.savedUserId === s.userId) {
      flag = false;
    }
  });
  if (flag) {
    await firestoreDb.collection("saved").add({
      userId: firebase.auth().currentUser.uid,
      savedUserId: s.userId,
    });
    const alert = document.getElementById("bulma-alert");
    alert.classList.remove("is-hidden");
  }
  if (flag) {
    return true;
  }
  return false;
};

export const deleteSaved = async (s, showAlert) => {
  const querySnapshot = await firestoreDb
    .collection("saved")
    .where("userId", "==", firebase.auth().currentUser.uid)
    .where("savedUserId", "==", s.userId)
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  if (results.length > 0) {
    await firestoreDb.collection("saved").doc(results[0].id).delete();
    showAlert("Successfully deleted!", "is-success");
  }
};
export const getAllProfiles = async () => {
  const querySnapshot = await firestoreDb
    .collection("profiles")
    .where("userId", "!=", firebase.auth().currentUser.uid)
    .get();
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return results;
};

export const updateProfile = async (profile, showAlert) => {
  await firestoreDb.collection("profiles").doc(profile.id).update({
    totalBudget: profile.totalBudget,
    availability: profile.availability,
    lookingIn: profile.lookingIn,
    amenitiesRequired: profile.amenitiesRequired,
    gender: profile.gender,
    age: profile.age,
    program: profile.program,
    smoker: profile.smoker,
    anyPets: profile.anyPets,
    languages: profile.languages,
    sleepAt: profile.sleepAt,
    wakeUpAt: profile.wakeUpAt,
    interests: profile.interests,
    smokerOk: profile.smokerOk,
    petsOk: profile.petsOk,
    genderR: profile.genderR,
    bio: profile.bio,
  });
  showAlert("Edit Successful!", "is-success");
};
