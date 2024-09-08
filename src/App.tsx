import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { privateRoutes, publicRoutes } from "./pages/ROUTES";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <header>
          <div className="w-3/12">
            <a href="/support">Prisidėk</a>
          </div>
          <div className="w-4/12 text-center">
            <a href="/" className="text-2xl text-black">
              Skafis testavimo platforma
            </a>
          </div>
          <div className="w-3/12 text-right">
            <a href="/user-guide" target="_blank">
              Naudotojo gidas
            </a>
          </div>
        </header>
        <main>
          <aside></aside>
          <section>
            <Routes>
              {publicRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              {privateRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<PrivateRoute />}
                >
                  <Route path={route.path} element={route.element} />
                </Route>
              ))}
            </Routes>
          </section>
          <aside></aside>
        </main>
        <footer>
          <p>
            © 2024 MB Skafis. Visos teisės saugomos. Susisiekite{" "}
            <a href="mailto:info@skafis.lt">info@skafis.lt</a>
          </p>
          <p>v1.0.0 - Paskutinį kartą atnaujinta: 2024-05-23</p>
        </footer>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
