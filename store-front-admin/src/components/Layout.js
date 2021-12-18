import Navigation from "./Navigation";

export default function Layout({children}) {
    return <>
        <header className="header">
            <div className="logo">
                <i className="fas fa-store logo__icon"></i>
                <span className="logo__text">Store Front CMS</span>
            </div>
        </header>
        <div className="app__container">
            <Navigation />

            <main className="main">
                {children}
            </main>
        </div>
    </>
}