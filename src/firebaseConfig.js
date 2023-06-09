import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { query } from "firebase/database";
import { doc, getDocs, deleteDoc, getFirestore, collection, setDoc, updateDoc } from 'firebase/firestore'

/* #region  initialize app */
const firebaseConfig = {
  apiKey: "AIzaSyDqfroQMI18BvDXHVCXblUNebiIXvQ7O10",
  authDomain: "border-control-66718.firebaseapp.com",
  databaseURL: "https://border-control-66718-default-rtdb.firebaseio.com",
  projectId: "border-control-66718",
  storageBucket: "border-control-66718.appspot.com",
  messagingSenderId: "144293640895",
  appId: "1:144293640895:web:0eb6e96f6903a37286240a",
  measurementId: "G-XMQJEG80EW"
};
const app = initializeApp(firebaseConfig);
/* #endregion */
const auth = getAuth();
const provider = new GoogleAuthProvider();
/* #region extra Functioons */
function TodaysDate() {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  const newdate = year + "/" + month + "/" + day;
  return newdate
}
function autoId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return autoId
}
/* #endregion */
const firestore = getFirestore();

const documentQuery = doc(firestore, 'posts/2020-2-2')
function writeToDocument(header, text) {
  const docData = {
    id: autoId(),
    date: TodaysDate(),
    poster: localStorage.getItem('email').replace(/\@.*/, ''),
    email: localStorage.getItem('email'),
    header: header,
    text: text
  }
  setDoc(documentQuery, docData)
}

async function queryFireStore(collectionQuery) {
  const firestore = getFirestore()
  const postsQuery = query(
    collection(firestore, collectionQuery),)
  const querySnapeShot = await getDocs(postsQuery);
  const dataArray = [];
  querySnapeShot.forEach((snap) => {
    const data = snap.data()
    data.docId = snap.id
    dataArray.push(data);
  });
  return dataArray
}

async function verifyUser(userId, password) {
  const firestore = getFirestore()

  const postsQuery = query(collection(firestore, 'users'),)

  const querySnapeShot = await getDocs(postsQuery);

  const users = []


  querySnapeShot.forEach((snap) => {
    users.push(
      {
        id: snap.data().userId,
        password: snap.data().password
      }
    )
  });

  let result = false
  
  for(let i=0; i<users.length; i++){
    if(userId == users[i].id){
      if(password == users[i].password){
        result = true
        break
      } else { result = false}
    } else { result = false}
  }

  return result
}

const usersQuery = doc(firestore, 'users/'+autoId())
async function writeNewUser(userId, password, institution, institutionEmail, lat, lng) {
  const docData = {
    userId:userId,
    password:password,
    institution:institution,
    institutionEmail:institutionEmail,
    hospitalCords:{
      lat:lat,
      lng:lng
    }
  }
  await setDoc(usersQuery, docData)
}

async function deleteDocument(docId){
  await deleteDoc(doc(firestore, docId))
}

async function updateUserRecord(docId, userId, password, institution, institutionEmail, lat, lng){
  const userDoc = doc(firestore, 'users/' + docId)
  const docData = {
    userId: userId,
    password: password,
    institution: institution,
    institutionEmail: institutionEmail,
    hospitalCords:{
      lat: lat,
      lng: lng
    }
  }
  await updateDoc(userDoc, docData)
}

/* ------------------------------ exports here ------------------------------ */
export {
  auth,
  provider,
  firebaseConfig,
  queryFireStore,
  verifyUser,
  writeNewUser,
  deleteDocument,
  updateUserRecord
}
