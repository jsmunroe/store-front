import { combineReducers  } from "redux";
import views from './viewsReducer';
import view from './viewReducer';

const rootReducer = combineReducers({
    views,
    view,
});

export default rootReducer;