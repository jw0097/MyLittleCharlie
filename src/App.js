import logo from "./logo.svg";
import "./App.css";
import AudioRecorder from "./AudioRecorder";
import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import MainImage from "./components/views/MainImage";

function App() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [isButtonClickedDelayed, setisButtonClickedDelayed] = useState(false);

  useEffect(() => {
    if (isButtonClicked) {
      setTimeout(() => {
        setAnimationCompleted(true);
        setisButtonClickedDelayed(true);
      }, 1000); // 1000ms = 1s which is the duration of your animation
    }
  }, [isButtonClicked]);

  const splashRef = useRef();
  const splashScreen = splashRef.current;

  const onClickHandler = () => {
    setIsButtonClicked(true);
  };

  return (
    <div className="App">
      <SplashDiv
        ref={splashRef}
        isbuttonclicked={isButtonClicked}
        animationCompleted={animationCompleted}
      >
        <div
          onClick={onClickHandler}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "#393C4F",
            display: "block",
            margin: "0px",
            padding: "0px",
          }}
        >
          <MainImage></MainImage>
        </div>
      </SplashDiv>
      <AudioRecorder isButtonClicked={isButtonClickedDelayed}></AudioRecorder>
    </div>
  );
}

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
`;
const SplashDiv = styled.div`
  width: 100%;
  height: 100%;
  background-color: "#393C4F";
  animation: ${(props) =>
    props.isbuttonclicked
      ? css`
          ${fadeOut} 1s ease-out both
        `
      : "none"};
  z-index: ${(props) => (props.isbuttonclicked ? -1 : 0)};
  display: ${(props) => (props.animationCompleted ? "none" : "block")};
`;

export default App;
