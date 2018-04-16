import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyBLfujupDZv_5fwXucn_ESrXvRR4cnsUFE",
  authDomain: "todo-7db5e.firebaseapp.com",
  databaseURL: "https://todo-7db5e.firebaseio.com",
  projectId: "todo-7db5e",
  storageBucket: "todo-7db5e.appspot.com",
  messagingSenderId: "42139029411"
};

const fire = firebase.initializeApp(config);

export default fire;
