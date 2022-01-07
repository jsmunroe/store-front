import { Provider as ReduxProvider } from 'react-redux';
import Router from './components/Router';
import { MobileHarness } from './components/Dialog';
import store from "./redux/store";
import './api/views.api';
import './App.scss';

function App() {
  return (
    <div className="app">
        <ReduxProvider store={store}>
            <MobileHarness>
                <Router/>
            </MobileHarness>
        </ReduxProvider>
    </div>
  );
}

export default App;
