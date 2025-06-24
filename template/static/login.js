import {auth} from './script'
import { signInWithEmailAndPassword } from 'firebase/auth'

const Login=()=>{
const handleLogin=async()=>{
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
      })
      .catch((error) => {
        console.error(error.message);
      });
}
}