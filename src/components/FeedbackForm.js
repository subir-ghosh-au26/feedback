import React, { useState } from "react";
import axios from "axios";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [batch, setBatch] = useState("");
  const [overallFeedback, setOverallFeedback] = useState("");
  const [comments, setComments] = useState("");
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [message, setMessage] = useState("");
    const batches = [
     "Batch A",
     "Batch B",
     "Batch C",
     "Batch D",
     "Batch E",
     "Batch F",
    ];

    const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
           });
            setCameraStream(stream);
            setShowCamera(true);
        } catch (err) {
         console.error("Error accessing camera:", err);
          alert("Could not access camera. Please make sure to provide permissions");
        }
    };

    const captureImage = () => {
       if (cameraStream) {
          const canvas = document.createElement("canvas");
          const video = document.querySelector("video");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
             const file = new File([blob], "image.jpeg", {type: "image/jpeg"})
               setImage(file)
               setShowCamera(false);
               cameraStream.getTracks().forEach(track => track.stop());
            }, "image/jpeg", 0.95);
       }
    };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!image) {
        startCamera();
          return;
      }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobileNumber", mobileNumber);
    formData.append("batch", batch);
    formData.append("overallFeedback", overallFeedback);
    formData.append("comments", comments);
    if(image){
      formData.append("image", image);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/feedback`, formData,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      if (response.status === 201) {
        setMessage("Feedback submitted successfully");
        setName("");
        setMobileNumber("");
        setBatch("");
        setOverallFeedback("");
        setComments("");
        setImage(null);
       }
    } catch (err) {
       console.error("Error submitting feedback:", err);
       setMessage("Failed to submit feedback");
     }
  };

  return (
    <div className="feedback-form-container">
      <h2>Feedback Form</h2>
      {message && <p className="form-message">{message}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number:</label>
             <input type="tel" id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
        </div>
        <div className="form-group">
             <label htmlFor="batch">Batch:</label>
             <select id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} required>
                <option value="">Select Batch</option>
                  {batches.map((batchOption) => (
                    <option key={batchOption} value={batchOption}>
                      {batchOption}
                    </option>
                  ))}
             </select>
        </div>
        <div className="form-group">
            <label htmlFor="overallFeedback">Overall Feedback:</label>
            <select id="overallFeedback"
              value={overallFeedback}
              onChange={(e) => setOverallFeedback(e.target.value)}
              required
           >
            <option value="">Select Feedback</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Average">Average</option>
            <option value="Bad">Bad</option>
          </select>
       </div>
       <div className="form-group">
        <label htmlFor="comments">Comments(optional):</label>
        <textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        ></textarea>
      </div>
        <div className="form-group camera-container">
        {showCamera && (
          <div className="camera-preview">
              <video
                autoPlay
                playsInline
                width="320"
                height="240"
                 ref={(video) => {
                  if(video){
                     video.srcObject = cameraStream;
                   }
                }}
               />
             <button type="button" onClick={captureImage}>
              Capture Image
           </button>
          </div>
           )}
        {image && (
          <div className="image-preview">
             <img
             src={image && URL.createObjectURL(image)}
              alt="preview"
               style={{ width: "100px", height: "100px" }}
               />
            </div>
         )}
         </div>
         <button type="submit" className="submit-button">
           {image ? "Submit Feedback" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
