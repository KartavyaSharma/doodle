import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
// import DesktopFeed from "../components/DesktopFeed";
import "../App.css"
import { useQuery } from "convex/react";
import { api } from '../../convex/_generated/api'
const QR_IMAGE_PATH = "src/assets/qr-sample.png";

function Live() {
  const [showResults, setShowResults] = useState(false);
  const images = useQuery(api.functions.list, {});


  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false)
  };

  const fadeOutProps = useSpring({
    opacity: !showResults ? 1 : 0,
    display: !showResults ? "block" : "none",
    config: { duration: 500 },
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
                    <span className="live-link">bit.ly/example</span>
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

      <div className="results-grid">
          {Array.isArray(images) && images[0]?.url && (
          images.map((image) => (

          <img  
          key={image._id} src={image.url} alt="Sample" />
          ))
          )}
      </div>
      




    </>
  );
}

export default Live;
