import React, { useState } from "react";
import { connect } from "react-redux";
import { useLogin } from "../api/user.api";
import { toValue } from "../utils/htmlHelpers";
import Busy from './Busy';
import Error from './Error';
import './Login.scss';

export const UserContext = React.createContext({});

function Login({user, children}) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const {isBusy, error, login} = useLogin();

    if (isBusy || user.state === 'Unknown') {
        return <Busy />
    }

    if (user.state === 'Authenticated') {
        return <UserContext.Provider value={user}>{children}</UserContext.Provider>
    }

    const handleFormSubmit = async (event) => {
        await login(userName, password);
        navigator.toWelcome();
    }

    return <div className="login">
        <form className="form" onSubmit={handleFormSubmit}>
            {error && <Error message={error}/>}

            <label className="form__label">User Name</label>
            <input className="form__input" type="text" name="userName" placeholder="User Name" required autoFocus value={userName} onChange={toValue(setUserName)} />

            <label className="form__label">Password</label>
            <input className="form__input" type="password" name="password" placeholder="Password" required value={password} onChange={toValue(setPassword)} />

            <div className="form__buttons">
                <button type="submit" className="form__submit">Log in</button>
            </div>
        </form>
    </div>
}

function mapStateToProps({user}, ownProps) {
    return {
        user,
    }
}

export default connect(mapStateToProps)(Login);