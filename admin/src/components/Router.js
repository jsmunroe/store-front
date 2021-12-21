import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layout";
import ViewEditor from "../pages/ViewEditor";
import Welcome from "../pages/Welcome";
import Login from "./Login";

export default function Router() {
    return <BrowserRouter>
        <Login>
            <Layout>
                <Routes>
                    <Route path="/" element={<Welcome/>} />
                    <Route path="/view" element={<ViewEditor/>} />
                    <Route path="/view/:id" element={<ViewEditor/>} />
                </Routes>
            </Layout>
        </Login>
    </BrowserRouter>
}