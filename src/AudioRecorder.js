import React, { useState, useRef } from "react";
import RecordImage from "./components/views/RecordImage";
import MicImage from "./components/images/mic.png";
import StopImage from "./components/images/stop.png";
import styled, { keyframes, css } from "styled-components";
import MidiPlayer from "./components/views/MidiPlayer";
import axios from "axios";

const AudioRecorder = ({ isButtonClicked }) => {
  const aRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [midiUrl, setMidiUrl] = useState(null);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);
  // const printconsole = () => {
  //   console.log("clicked");
  // };
  const startRecording = async () => {
    console.log("click");
    setIsError(false);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      recordedChunks.current = [];
      // Create a FormData object to send the file
      const formData = new FormData();
      const filename = `recording_${Date.now()}.wav`;
      formData.append("file", blob, filename);

      console.log(formData["file"]);
      setIsLoading(true);
      // Make Axios POST request
      axios
        .post("http://15.164.61.1:65400/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(
            "File uploaded and processed successfully:",
            response.data
          );
          if (response.data.success) {
            const blob = dataURLtoBlob(
              "data:audio/midi;base64," + response.data.midi_data
            );
            const blobURL = URL.createObjectURL(blob);
            // Save the blob as a file
            // const link = document.createElement("a");
            // link.href = blobURL;
            // link.download = "output.mid"; // Name for the downloaded file
            // console.log("blobURL", blobURL);
            // console.log("link", link);
            // console.log(blobURL);
            setMidiUrl(blobURL);
            setIsLoading(false);
            const link = aRef.current;
            link.href = blobURL;
            link.download = "output.mid"; // Name for the downloaded file
            link.innerText = "Download MIDI"; // Text that appears to the user
            // Append the link to the body (or another container)
          }
        })
        .catch((error) => {
          setIsError(true);
          setIsLoading(false);
          console.error("Error uploading or processing file:", error);
        });
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  return (
    <div
      style={{ backgroundColor: "#393C4F", height: "100vh", width: "100vw" }}
    >
      {!recording ? (
        <div>
          <img
            src={MicImage}
            style={{ marginTop: 80, marginLeft: -30 }}
            width="500"
            height="500"
            alt="mic"
            onClick={startRecording}
          />
          <StyledDiv isButtonClicked={isButtonClicked}>
            <div>Press MIC Button</div>
            <div>And Record Your Own Melody.</div>
          </StyledDiv>
        </div>
      ) : (
        <div>
          <img
            src={StopImage}
            style={{ marginTop: 80, marginLeft: -30 }}
            width="500"
            height="500"
            alt="stop"
            onClick={stopRecording}
          />
          <StyledDiv isButtonClicked={isButtonClicked}>
            <div>Press MIC Button</div>
            <div>And Record Your Own Melody.</div>
          </StyledDiv>
        </div>
      )}
      {/* <RecordImage></RecordImage> */}

      {/* {audioURL && (
        <div>
          <h3>Recorded Audio:</h3>
          <audio controls>
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )} */}
      <div style={{ fontFamily: "pixelGraphic", fontSize: "20px" }}>
        {/* Rest of your component code */}
        {isLoading && <p>We Are Making Your Song...</p>}
        {isError && <p>Error Occuredㅠㅠ Press F5 And Try Again!</p>}
      </div>
      {/* {midiUrl && <MidiPlayer blobURL={midiUrl}></MidiPlayer>} */}
      <div
        style={{
          fontFamily: "pixelGraphic",
          fontSize: "20px",
          paddingTop: "20px",
          marginLeft: -20,
        }}
      >
        <a ref={aRef}></a>
      </div>
    </div>
  );
};
const blink = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
`;

const StyledDiv = styled.div`
  margin-top: -120px;
  margin-left: -10px;
  font-family: "pixelGraphic";
  color: white;
  font-size: 40px;
  text-shadow: -5px 0 black, 0 5px black, 5px 0 black, 0 -5px black;
  animation: ${blink} 1.5s infinite both;
  display: ${(props) => (props.isButtonClicked ? "block" : "none")};
`;

export default AudioRecorder;
