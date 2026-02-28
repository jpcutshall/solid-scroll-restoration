import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";

const App = () => {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
    </Router>
  );
};

render(() => <App />, document.getElementById("root") as HTMLElement);
