import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import createScrollRestoration from "../../src/createScrollRestoration/createScrollRestoration";

const Home = () => {
  const [scrollElement, setScrollElement] = createSignal<HTMLDivElement | null>(null);
  const scrollKey = () => "main-scroll";

  // Test the createScrollRestoration function
  createScrollRestoration(scrollElement, scrollKey, { persist: "sessionStorage" });

  const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

  return (
    <div style={{ padding: "20px", display: "flex", "flex-direction": "column", gap: "20px", "max-width": "600px", margin: "0 auto" }}>
      <h1>Scroll Restoration Dev App</h1>
      <p>Scroll down inside the box, click the link to go to About, and then click back to see scroll restore.</p>
      
      <A href="/about" style={{ display: "inline-block", padding: "10px 15px", background: "#007bff", color: "white", "text-decoration": "none", "border-radius": "4px", "text-align": "center" }}>
        Go to About Page
      </A>

      <div 
        ref={setScrollElement}
        style={{ 
          height: "400px", 
          overflow: "auto", 
          border: "2px solid #ccc",
          padding: "10px",
          "background-color": "white",
          "border-radius": "8px",
          "box-shadow": "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        <For each={items}>
          {(item) => (
            <div style={{ 
              padding: "15px 10px", 
              "border-bottom": "1px solid #eee",
              "font-size": "16px"
            }}>
              {item}
            </div>
          )}
        </For>
        <div style={{ padding: "15px 10px", "font-weight": "bold", color: "green" }}>
          Bottom of the list
        </div>
      </div>
    </div>
  );
};

export default Home;
