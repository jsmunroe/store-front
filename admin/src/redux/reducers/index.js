import { combineReducers  } from "redux";
import views from './viewsReducer';
import view from './viewReducer';
import user from './userReducer';

const rootReducer = combineReducers({
    user,
    views,
    view,
});

export default rootReducer;