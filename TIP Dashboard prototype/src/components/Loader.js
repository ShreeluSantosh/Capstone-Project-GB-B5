import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = () => {
    const [blips, setBlips] = useState([]);

    useEffect(() => {
        const loaderDuration = 3000;  // 3 seconds in milliseconds
        const angularInterval = 60;  // Degrees between blips
        const firstBlipAngle = 45;  // First blip at 45 degrees
        const blipIntervalCount = 360 / angularInterval;  // Number of blips
        const delayBeforeFirstBlip = 350; // Small delay to sync with sweep

        const addBlipAtAngle = (angle) => {
            const radius = 65;
            const angleInRadians = (-angle * Math.PI) / 180; // Changed to clockwise

            const x = radius * Math.cos(angleInRadians);
            const y = radius * Math.sin(angleInRadians);

            setBlips(prevBlips => [
                ...prevBlips,
                {
                    id: Date.now() + angle,
                    style: {
                        top: `${80 - y}px`,
                        left: `${80 + x}px`,
                        position: 'absolute',
                    },
                },
            ]);
        };

        let currentAngle = 330; // Start from 330 degrees to sync with the sweep
        const intervalTime = (loaderDuration - delayBeforeFirstBlip) / blipIntervalCount;  // Time interval for each blip

        const startBlips = setTimeout(() => {
            const intervalId = setInterval(() => {
                if (currentAngle < 690) { // Stop after 690 degrees
                    addBlipAtAngle(currentAngle);
                    currentAngle += angularInterval;
                } else {
                    clearInterval(intervalId);  // Stop after 690 degrees
                }
            }, intervalTime);

            // Cleanup after the loader duration
            const cleanupTimer = setTimeout(() => {
                setBlips([]);
                clearInterval(intervalId);  // Clear the interval
            }, loaderDuration);

            return () => {
                clearInterval(intervalId);
                clearTimeout(cleanupTimer);
            };
        }, delayBeforeFirstBlip);

        return () => clearTimeout(startBlips);

    }, []);

    return (
        <div className="loader-wrapper">
            <h2>Loading Activities...</h2>
            <div className="loader">
                <div className="sweep" ></div>
                {blips.map((blip) => (
                    <div key={blip.id} className="blip" style={blip.style}></div>
                ))}
            </div>
        </div>
    );
};

export default Loader;