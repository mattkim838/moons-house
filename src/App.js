import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import picture1 from "./IMG_2473.JPEG"; // Add your image to src/ as IMG_2473.JPEG
import HouseEntry from "./houseentry"; // Import your new page

function Home() {
    // Use the image as a background
    return (
        <div
            className="home-bg"
            style={{
                backgroundImage: `url(${picture1})`,
                minHeight: "100vh",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <h1 className="home-title">Welcome to Moon's House</h1>
        </div>
    );
}

function About() {
    return <div className="page"><h2>About Us</h2><p>Info about Moon's House.</p></div>;
}
function Photo() {
    return <div className="page"><h2>Photo Gallery</h2><p>Photos will go here.</p></div>;
}
function Video() {
    return <div className="page"><h2>Video Gallery</h2><p>Videos will go here.</p></div>;
}
function Product() {
    return <div className="page"><h2>Products</h2><p>Product info goes here.</p></div>;
}

function App() {
    return (
        <Router>
            <nav className="nav">
                <Link to="/">Main</Link>
                <Link to="/about">About us</Link>
                <Link to="/photo">Photo</Link>
                <Link to="/video">Video</Link>
                <Link to="/product">Product</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/photo" element={<Photo />} />
                <Route path="/video" element={<Video />} />
                <Route path="/product" element={<Product />} />
                <Route path="/house" element={<HouseEntry />} />
            </Routes>
        </Router>
    );
}

export default App;