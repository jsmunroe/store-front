import { Provider } from 'react-redux';
import Router from './components/Router';
import { ModalHarness } from './components/Modal';
import store from "./redux/store";
import './api/views.api';
import './redux/store.handlers.js';
import './App.scss';

function App() {
  return (
    <div className="app">
        <Provider store={store}>
            <ModalHarness>
                <Router/>
            </ModalHarness>
        </Provider>
    </div>
  );
}

export default App;
