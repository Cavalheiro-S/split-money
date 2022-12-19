import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDdb4LTlvTMt_3JfW0447OFbvcx1r17MCk",
  authDomain: "split-money-84bdf.firebaseapp.com",
  projectId: "split-money-84bdf",
  storageBucket: "split-money-84bdf.appspot.com",
  messagingSenderId: "819188300370",
  appId: "1:819188300370:web:ca6f729a4cdf949772bd8b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);