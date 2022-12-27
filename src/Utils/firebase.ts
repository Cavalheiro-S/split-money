import { initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDdb4LTlvTMt_3JfW0447OFbvcx1r17MCk",
  authDomain: "split-money-84bdf.firebaseapp.com",
  projectId: "split-money-84bdf",
  storageBucket: "split-money-84bdf.appspot.com",
  messagingSenderId: "819188300370",
  appId: "1:819188300370:web:ca6f729a4cdf949772bd8b"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const returnErrorMessage = (code: string) => {

    switch (code) {
        case 'auth/invalid-email':
            return 'Email inválido';
        case 'auth/user-disabled':
            return 'Usuário desabilitado';
        case 'auth/user-not-found':
            return 'Usuário não encontrado';
        case 'auth/wrong-password':
            return 'Senha incorreta';
        case 'auth/email-already-in-use':
            return 'Email já está em uso';
        case 'auth/weak-password':
            return 'Senha fraca';
        default:
            return 'Erro encontrado';
    }
}