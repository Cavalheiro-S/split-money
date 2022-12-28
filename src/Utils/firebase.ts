import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
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