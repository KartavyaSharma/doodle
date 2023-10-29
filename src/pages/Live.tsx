import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
// import DesktopFeed from "../components/DesktopFeed";
import "../App.css";
import "./Live.css";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
const QR_IMAGE_PATH = "src/assets/qr-sample.png";

const maxAngle = 8;

function Live() {
  const [showResults, setShowResults] = useState(false);
  const images = useQuery(api.functions.list, {});
  const [initialAngle, _] = useState(
    () => Math.random() * (maxAngle * 2) - maxAngle
  );
  let [angle, setAngle] = useState(initialAngle);

  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  const fadeOutProps = useSpring({
    opacity: !showResults ? 1 : 0,
    display: !showResults ? "block" : "none",
    config: { duration: 500 },
  });

  const fadeInProps = useSpring({
    opacity: showResults ? 1 : 0,
    display: showResults ? "block" : "none",
    config: { duration: 1000 },
  });

  return (
    <>
      <animated.div style={fadeOutProps}>
        <div className="appContainer">
          <div className="super-parent">
            <div className={`parent`}>
              <div className={`column-60 text`}>
                <div className="live-text">
                  <div className="live-large">Scan to start drawing!</div>
                  <div className="live-normal">
                    Or visit&nbsp;
                    <br />
                    <span className="live-link">bit.ly/prompt-doodle</span>
                  </div>
                </div>
              </div>
              <div className={`column-40`}>
                <img src={QR_IMAGE_PATH} alt="QR Image" />
              </div>
            </div>
            <div className="button-container">
              <button
                className="sqs-block-button-element"
                onClick={handleShowResults}
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      </animated.div>
      <animated.div style={fadeInProps}>
        <div className="appContainer">
          <div className="super-parent">
            <div className="parent-feed-maximized">
              <div className="column-1-maximized text">
                <div className="live-text-maximized">
                  <div className="live-large-feed-maximized">
                    Scan to start drawing!
                  </div>
                  <div className="live-normal-feed-maximized">
                    Or visit&nbsp;
                    <br />
                    <span className="live-link">bit.ly/prompt-doodle</span>
                  </div>
                </div>
                <div className="qr-maximized">
                  <img src={QR_IMAGE_PATH} alt="QR Image" />
                </div>
              </div>
              <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "flex-end"}}>
                <div style={{display: "flex", paddingTop: "50px", paddingRight: "80px", fontWeight: "bolder", fontSize: "45px"}}>Prompt: "An air fryer"</div>
              <div className="results-grid">
                {Array.isArray(images) &&
                  images[0]?.url &&
                  images.map((image) => {
                    // setAngle(Math.random() * (maxAngle * 2) - maxAngle);
                    angle = Math.random() * (maxAngle * 2) - maxAngle;
                    return (
                      <div
                        className="drawing-container-live"
                        style={{
                          transform: `rotate(` + angle + "deg)",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <img
                            className="drawing-live drawing-image"
                            key={image._id}
                            src={image.url}
                            alt="Sample"
                          />
                          <div style={{ padding: "5px" }}>{image.author}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </>
  );
}

export default Live;
