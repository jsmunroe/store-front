import { useState } from "react"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "./api"
import * as logger from '../utils/logger'
import * as authActions from '../redux/actions/userActions'
import store from '../redux/store'

onAuthStateChanged(async (authUser) => {
    if (authUser) {
        store.dispatch(authActions.loadUser({
            uid: authUser.uid,
            userName: authUser.email,
            state: 'Authenticated',
        }));
    }
    else {
        store.dispatch(authActions.clearUser());
    }
})

export function useLogin() {
    const [isBusy, setIsBusy] = useState(false);
    const [error, setError] = useState(null);

    const login = async (userName, password) => {
        setIsBusy(true);
        try {
            await signInWithEmailAndPassword(userName, password);
        }
        catch (error) {
            setError(logger.error(error));
        }
        finally {
            setIsBusy(false);
        }
    }

    const logout = async () => {
        setIsBusy(true);
        try {
            await signOut();
        }
        catch (error) {
            setError(logger.error(error));
        }
        finally {
            setIsBusy(false);
        }
    }
    
    return {isBusy, error, login, logout};
}