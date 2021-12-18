import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.scss';
import Layout from "./components/Layout";
import { Welcome } from "./pages/Welcome";

function App() {
  return (
    <div className="app">
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Welcome/>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    </div>
  );
}

export default App;
