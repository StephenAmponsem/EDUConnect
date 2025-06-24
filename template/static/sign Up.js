import {auth} from './script'
    import { createUserWithEmailAndPassword } from "firebase/auth";
    reateUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed up:", userCredential.user);
      })
      .catch((error) => {
        console.error(error.message);
      });