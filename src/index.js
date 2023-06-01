import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const initialState = {
  breaklength: "05",
  sessionlength: "03",
  session: "Session",
  timeleft: "03:00",
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
    let [minutesOfTimeLeft, secoundsOfTimeLeft] =
      this.state.timeleft.split(":");
    return [minutesOfTimeLeft, secoundsOfTimeLeft];
  }
  getPlusMinutes(mintues) {
    let mintuesDigits = /^\d{1}$/.test(mintues)
      ? `0${parseInt(mintues)}`
      : parseInt(mintues);
    return mintuesDigits;
  }
  getMinusMinutes(mintues) {
    if (mintues < 0) return "00";
    let minusMintuesDigits = /^\d{2}$/.test(mintues) ? mintues : `0${mintues}`;
    return minusMintuesDigits;
  }

  breakDecrement(e) {
    let [minutesOfTimeLeft, secoundsOfTimeLeft] = this.getTimeLeft();
    let mintues = this.getMinusMinutes(minutesOfTimeLeft - 1);
    if (parseInt(this.state.breaklength) > 0 && this.state.pause === true) {
      this.state.canChangeBreak
        ? this.setState({
            breaklength: this.getMinusMinutes(this.state.breaklength - 1),
          })
        : this.setState({
            breaklength: mintues,
            timeleft: `${mintues}:${secoundsOfTimeLeft}`,
          });
    }
  }
  breakIncrement(e) {
    let [minutesOfTimeLeft, secoundsOfTimeLeft] = this.getTimeLeft();
    let mintues = this.getPlusMinutes(parseInt(minutesOfTimeLeft) + 1);
    if (this.state.breaklength < 60 && this.state.pause === true)
      this.state.canChangeBreak
        ? this.setState({
            breaklength: this.getPlusMinutes(
              parseInt(this.state.breaklength) + 1
            ),
          })
        : this.setState({
            breaklength: mintues,
            timeleft: `${mintues}:${secoundsOfTimeLeft}`,
          });
  }
  sessionIncrement(e) {
    let [minutesOfTimeLeft, secoundsOfTimeLeft] = this.getTimeLeft();
    let mintues = this.getPlusMinutes(parseInt(minutesOfTimeLeft) + 1);

    if (this.state.sessionlength < 60 && this.state.pause === true)
      this.state.canChangeSession
        ? this.setState({
            sessionlength: mintues,
            timeleft: `${mintues}:${secoundsOfTimeLeft}`,
          })
        : this.setState({
            sessionlength: this.getPlusMinutes(
              parseInt(this.state.sessionlength) + 1
            ),
          });
  }

  sessionDecrement() {
    let [minutesOfTimeLeft, secoundsOfTimeLeft] = this.getTimeLeft();
    let minusMintues = this.getMinusMinutes(minutesOfTimeLeft - 1);
    if (this.state.sessionlength > 0 && this.state.pause === true)
      this.state.canChangeSession
        ? this.setState((prevState) => ({
            sessionlength: minusMintues,
            timeleft: `${minusMintues}:${secoundsOfTimeLeft}`,
          }))
        : this.setState({
            sessionlength: this.getMinusMinutes(
              parseInt(this.state.sessionlength) - 1
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
    let [minutesOfTimeLeft, secoundsOfTimeLeft] = this.getTimeLeft();

    const endTime =
      new Date().getTime() +
      parseInt(minutesOfTimeLeft) * 60000 +
      parseInt(secoundsOfTimeLeft) * 1000;
    this.updateTimer(sessionType, endTime);
  }

  updateTimer(sessionType, endTime) {
    if (this.state.isRunning === false) {
      this.setState({
        isRunning: true,
      });
      return;
    }
    if (this.state.sessionlength === "00" && this.state.breaklength === "00") {
      let [minutesOfTimeLeft, secoundsOfTimeLeft] = this.getTimeLeft();
      if (minutesOfTimeLeft === "00" && secoundsOfTimeLeft === "00") {
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
          timeleft: `${this.state.breaklength}:00`,
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
          timeleft: `${this.state.sessionlength}:00`,
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
      timeleft: `${minutes}:${seconds}`,
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
      nextState.sessionlength !== this.state.sessionlength &&
      this.state.reset === true
    ) {
      this.setState({
        timeleft: `${this.state.sessionlength}:00`,
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

              <div id="time-left">{this.state.timeleft}</div>
            </div>
          </div>
        </div>
        <div className="row-container">
          <div className="column-container">
            <button
              id="break-increment"
              className="paddelement"
              onClick={(e) => this.breakIncrement(e)}
            >
              break-increment
            </button>
            <button
              id="session-increment"
              className="paddelement"
              onClick={(e) => this.sessionIncrement(e)}
            >
              session-increment
            </button>
            <button
              id="start_stop"
              className="paddelement"
              onClick={() => this.startStop(this.state)}
            >
              Start_Stop
            </button>
          </div>
          <div className="column-container">
            <div id="break-length" className="numbers">
              {this.state.breaklength}
            </div>
            <div id="session-length">{this.state.sessionlength}</div>
          </div>

          <div className="column-container">
            <button
              id="break-decrement"
              className="paddelement"
              onClick={(e) => this.breakDecrement(e)}
            >
              break-decrement
            </button>
            <button
              id="session-decrement"
              className="paddelement"
              onClick={(e) => this.sessionDecrement(e)}
            >
              session-decrement
            </button>
            <button
              id="reset"
              className="paddelement"
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
