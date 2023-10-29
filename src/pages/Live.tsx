import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";

const QR_IMAGE_PATH = "src/assets/qr-sample.png";

function Live() {
  return (
    <>
      <div className="appContainer">
        <div className="super-parent">
          <div className="parent">
            <div className="column-60 text">
              <div className="live-text">
                <div className="live-large">Scan to start drawing!</div>
                <div className="live-normal">
                  Or visit&nbsp;<br />
                  <span className="live-link">bit.ly/example</span>
                </div>
              </div>
            </div>
            <div className="column-40">
              <img src={QR_IMAGE_PATH} alt="QR Image" />
            </div>
          </div>
          <div className="button-container">
            <button className="sqs-block-button-element">View Results</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Live;

// const images = useQuery(api.functions.list, undefined);

{
  /* {
  images.map((image) => {
    if (image.url){
      return (
        <img src={image.url} alt="Sample" />
      )
    }
  })
} */
}
