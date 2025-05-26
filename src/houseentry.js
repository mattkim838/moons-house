import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./houseentry.css";

export default function HouseEntry() {
    const [zoom, setZoom] = useState(false);
    const navigate = useNavigate();

    const handleDoorClick = () => {
        setZoom(true);
        setTimeout(() => {
            navigate("/");
        }, 1200); // Duration must match animation
    };

    return (
        <div className={`house-entry-bg${zoom ? " zoom" : ""}`}>
            <svg viewBox="0 0 400 400" width="300" height="300">
                {/* House body */}
                <rect x="100" y="150" width="200" height="150" fill="#b6d7a8" />
                {/* Roof */}
                <polygon points="200,60 80,150 320,150" fill="#a0522d" />
                {/* Door */}
                <rect x="180" y="230" width="40" height="70" fill="#654321" />
            </svg>
            <button
                className="door-btn"
                onClick={handleDoorClick}
                aria-label="Enter the house"
            />
            <h2 className="house-label">Click the Door to Enter</h2>
        </div>
    );
}