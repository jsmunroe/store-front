import { combineReducers  } from "redux";
import views from './viewsReducer';
import view from './viewReducer';
import user from './userReducer';
import viewEditor from './viewEditorReducer';

const rootReducer = combineReducers({
    user,
    views,
    view,
    viewEditor,
});

export default rootReducer;