import { path, setDoc, readCollection } from "./api";
import store from '../redux/store';
import * as viewActions from '../redux/actions/viewActions';
import { deleteDoc } from "./api.firebase";

(async () => {
    const views = await readCollection(path('views'));
    store.dispatch(viewActions.loadViews(views));
})();

export async function saveView(view) {
    await setDoc(path('views', view.id), view);
}

export async function deleteView(view) {
    await deleteDoc(path('views', view.id));
}