import './App.scss';
import { Provider as ReduxProvider } from 'react-redux';
import store from "./redux/store";
import Router from './components/Router';

function App() {
  return (
    <div className="app">
        <ReduxProvider store={store}>
            <Router/>
        </ReduxProvider>
    </div>
  );
}

export default App;
