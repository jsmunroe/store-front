import { Provider as ReduxProvider } from 'react-redux';
import Router from './components/Router';
import { ModalHarness } from './components/Modal';
import store from "./redux/store";
import './api/views.api';
import './redux/store.handlers.js';
import './App.scss';

function App() {
  return (
    <div className="app">
        <ReduxProvider store={store}>
            <ModalHarness>
                <Router/>
            </ModalHarness>
        </ReduxProvider>
    </div>
  );
}

export default App;
