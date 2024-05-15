import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { routes } from "./pages/ROUTES";

function App() {
  return (
    <BrowserRouter>
      <header>
        <div>Skafis testavimo platforma</div>
      </header>
      <main>
        <aside></aside>
        <section>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </section>
        <aside></aside>
      </main>
      <footer>
        <p>
          Platformos kūrėjo blog'as bei daugiau įdomių dalykų čia:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.npw.lt"
          >
            npw.lt
          </a>
        </p>
        <p>Paskutinį kartą atnaujinta: 2024-05-13</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
