import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const initialState = {
  breaklength: "05",
  sessionLength: "03",
  session: "Session",
  timeLeft: "03:00",
  clicked: false,
  interInterval: null,
  reset: false,
  isRunning: true,
  pause: true,
  canChangeBreak: true,
  canChangeSession: true,
};

class App extends React.Component {
  audioRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleReset(e) {
    e.preventDefault();
    clearInterval(this.state.interInterval);
    this.setState(initialState);
    this.setState({
      isRunning: false,
    });
  }
  getTimeLeft() {
    let [minutesOfTimeLeft, secondsOfTimeLeft] = this.state.timeLeft.split(":");
    return [minutesOfTimeLeft, secondsOfTimeLeft];
  }
  getPlusMinutes(minutes) {
    let minutesDigits = /^\d{1}$/.test(minutes)
      ? `0${parseInt(minutes)}`
      : parseInt(minutes);
    return minutesDigits;
  }
  getMinusMinutes(minutes) {
    if (minutes < 0) return "00";
    let minusMinutesDigits = /^\d{2}$/.test(minutes) ? minutes : `0${minutes}`;
    return minusMinutesDigits;
  }

  breakDecrement(e) {
    let [minutesOfTimeLeft, secondsOfTimeLeft] = this.getTimeLeft();
    let minutes = this.getMinusMinutes(minutesOfTimeLeft - 1);
    if (parseInt(this.state.breaklength) > 0 && this.state.pause === true) {
      this.state.canChangeBreak
        ? this.setState({
            breaklength: this.getMinusMinutes(this.state.breaklength - 1),
          })
        : this.setState({
            breaklength: minutes,
            timeLeft: `${minutes}:${secondsOfTimeLeft}`,
          });
    }
  }
  breakIncrement(e) {
    let [minutesOfTimeLeft, secondsOfTimeLeft] = this.getTimeLeft();
    let minutes = this.getPlusMinutes(parseInt(minutesOfTimeLeft) + 1);
    if (this.state.breaklength < 60 && this.state.pause === true)
      this.state.canChangeBreak
        ? this.setState({
            breaklength: this.getPlusMinutes(
              parseInt(this.state.breaklength) + 1
            ),
          })
        : this.setState({
            breaklength: minutes,
            timeLeft: `${minutes}:${secondsOfTimeLeft}`,
          });
  }
  sessionIncrement(e) {
    let [minutesOfTimeLeft, secondsOfTimeLeft] = this.getTimeLeft();
    let minutes = this.getPlusMinutes(parseInt(minutesOfTimeLeft) + 1);

    if (this.state.sessionLength < 60 && this.state.pause === true)
      this.state.canChangeSession
        ? this.setState({
            sessionLength: minutes,
            timeLeft: `${minutes}:${secondsOfTimeLeft}`,
          })
        : this.setState({
            sessionLength: this.getPlusMinutes(
              parseInt(this.state.sessionLength) + 1
            ),
          });
  }

  sessionDecrement() {
    let [minutesOfTimeLeft, secondsOfTimeLeft] = this.getTimeLeft();
    let minusMinutes = this.getMinusMinutes(minutesOfTimeLeft - 1);
    if (this.state.sessionLength > 0 && this.state.pause === true)
      this.state.canChangeSession
        ? this.setState((prevState) => ({
            sessionLength: minusMinutes,
            timeLeft: `${minusMinutes}:${secondsOfTimeLeft}`,
          }))
        : this.setState({
            sessionLength: this.getMinusMinutes(
              parseInt(this.state.sessionLength) - 1
            ),
          });
  }

  startStop(nextState) {
    if (nextState.clicked === false) {
      if (nextState.session === "Session") {
        this.setTimer("Session");
      } else {
        this.setTimer("Break");
      }
    } else {
      if (nextState.interInterval) {
        clearTimeout(nextState.interInterval);
      }

      this.setState({
        clicked: false,
        isRunning: false,
        interInterval: null,
        pause: true,
      });
    }
  }
  setTimer(sessionType) {
    let [minutesOfTimeLeft, secondsOfTimeLeft] = this.getTimeLeft();

    const endTime =
      new Date().getTime() +
      parseInt(minutesOfTimeLeft) * 60000 +
      parseInt(secondsOfTimeLeft) * 1000;
    this.updateTimer(sessionType, endTime);
  }

  updateTimer(sessionType, endTime) {
    if (this.state.isRunning === false) {
      this.setState({
        isRunning: true,
      });
      return;
    }
    if (this.state.sessionLength === "00" && this.state.breaklength === "00") {
      let [minutesOfTimeLeft, secondsOfTimeLeft] = this.getTimeLeft();
      if (minutesOfTimeLeft === "00" && secondsOfTimeLeft === "00") {
        this.audioRef.current.src = "build.wav";
        this.audioRef.current.play();
        this.setState(initialState);

        return;
      }
    }
    let now = new Date().getTime();
    let t = endTime - now;
    let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((t % (1000 * 60)) / 1000);
    minutes = minutes.toString().padStart(2, "00");
    seconds = seconds.toString().padStart(2, "00");

    if (t < 0) {
      this.audioRef.current.src = "build.wav";
      this.audioRef.current.play();

      if (sessionType === "Session") {
        this.setState({
          timeLeft: `${this.state.breaklength}:00`,
          session: "Break",
          canChangeBreak: false,
          canChangeSession: false,
        });
        setTimeout(() => {
          this.setTimer("Break");
        }, 3000);

        return;
      } else {
        this.setState({
          timeLeft: `${this.state.sessionLength}:00`,
          session: "Session",
          canChangeBreak: true,
          canChangeSession: true,
        });
        setTimeout(() => {
          this.setTimer("Session");
        }, 3000);

        return;
      }
    }
    const setTime = () =>
      setTimeout(() => this.updateTimer(sessionType, endTime), 950);
    this.setState({
      timeLeft: `${minutes}:${seconds}`,
      clicked: true,
      interInterval: setTime,
    });
    if (this.state.isRunning !== false) {
      setTime();
      this.setState({
        pause: false,
      });
    }
  }

  componentDidUpdate(nextProps, nextState) {
    if (
      nextState.sessionLength !== this.state.sessionLength &&
      this.state.reset === true
    ) {
      this.setState({
        timeLeft: `${this.state.sessionLength}:00`,
        reset: false,
      });
    }
  }

  render() {
    return (
      <>
        <audio id="beep" ref={this.audioRef}></audio>
        <div className="row-container">
          <div className="column-container">
            <div id="break-label">break label</div>
            <div className="column-container">
              <div id="session-label">session-label</div>

              <div id="timer-label">{this.state.session}</div>

              <div id="time-left">{this.state.timeLeft}</div>
            </div>
          </div>
        </div>
        <div className="row-container">
          <div className="column-container">
            <button
              id="break-increment"
              className="paddingElement"
              onClick={(e) => this.breakIncrement(e)}
            >
              break-increment
            </button>
            <button
              id="session-increment"
              className="paddingElement"
              onClick={(e) => this.sessionIncrement(e)}
            >
              session-increment
            </button>
            <button
              id="start_stop"
              className="paddingElement"
              onClick={() => this.startStop(this.state)}
            >
              Start_Stop
            </button>
          </div>
          <div className="column-container">
            <div id="break-length" className="numbers">
              {this.state.breaklength}
            </div>
            <div id="session-length">{this.state.sessionLength}</div>
          </div>

          <div className="column-container">
            <button
              id="break-decrement"
              className="paddingElement"
              onClick={(e) => this.breakDecrement(e)}
            >
              break-decrement
            </button>
            <button
              id="session-decrement"
              className="paddingElement"
              onClick={(e) => this.sessionDecrement(e)}
            >
              session-decrement
            </button>
            <button
              id="reset"
              className="paddingElement"
              onClick={(e) => this.handleReset(e)}
            >
              Reset
            </button>
          </div>
        </div>
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
