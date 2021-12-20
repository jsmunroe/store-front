import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./Layout";
import ViewEditor from "../pages/ViewEditor";
import Welcome from "../pages/Welcome";

export default function Router() {
    return <BrowserRouter>
        <Layout>
            <Routes>
                <Route path="/" element={<Welcome/>} />
                <Route path="/view" element={<ViewEditor/>} />
                <Route path="/view/:id" element={<ViewEditor/>} />
            </Routes>
        </Layout>
    </BrowserRouter>
}