import { A } from "@solidjs/router";

const About = () => {
  return (
    <div style={{ padding: "20px", display: "flex", "flex-direction": "column", gap: "20px", "max-width": "600px", margin: "0 auto" }}>
      <h1>About Page</h1>
      <p>This is a separate page to test navigating away and back to the home page.</p>
      
      <A href="/" style={{ display: "inline-block", padding: "10px 15px", background: "#6c757d", color: "white", "text-decoration": "none", "border-radius": "4px", "text-align": "center" }}>
        Back to Home
      </A>
    </div>
  );
};

export default About;
