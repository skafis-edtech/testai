import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { routes } from "./pages/ROUTES";

function App() {
  return (
    <BrowserRouter>
      <header></header>
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
      <footer></footer>
    </BrowserRouter>
  );
}

export default App;
