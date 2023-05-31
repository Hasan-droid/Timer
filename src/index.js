///////////////////////
// Welcome to Cursor //
///////////////////////

/*
Step 1: Try generating a react component that lets you play tictactoe with Cmd+K or Ctrl+K on a new line.
  - Then integrate it into the code below and run with npm start

Step 2: Try highlighting all the code with your mouse, then hit Cmd+k or Ctrl+K. 
  - Instruct it to change the game in some way (e.g. add inline styles, add a start screen, make it 4x4 instead of 3x3)

Step 3: Hit Cmd+L or Ctrl+L and ask the chat what the code does

Step 4: To try out cursor on your own projects, go to the file menu (top left) and open a folder.
*/

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const initialState = {
  breaklength: '05',
  sessionlength: 25,
  session: "Session",
  timeleft: "25:00",
  clicked: false,
  interInterval: null,
  reset: false,
  isRunning:true,
  pause:true,
  canChangeBreak:true,
  canChangeSession:true

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
    this.setState ({
      isRunning:false
    })
  }
getTimeLeft(){
  let [minutesOfTimeLeft , secoundsOfTimeLeft]=this.state.timeleft.split(":");
  return [minutesOfTimeLeft , secoundsOfTimeLeft]
}
  getPlusMinutes(mintues) {
    let mintuesDigits=/^\d{1}$/.test(mintues)?`0${parseInt(mintues)}`:parseInt(mintues)
    return mintuesDigits;
  }
getMinusMinutes(mintues){
  let minusMintuesDigits=/^\d{2}$/.test(mintues)?mintues:`0${mintues}`
  return minusMintuesDigits;
}

  breakDecrement(e) {
    let [minutesOfTimeLeft , secoundsOfTimeLeft]=this.getTimeLeft();
    let mintues=this.getMinusMinutes(minutesOfTimeLeft-1);
    if (this.state.breaklength > 0 && this.state.pause === true )
     this.state.canChangeBreak?
     this.setState({
        breaklength: this.getMinusMinutes(this.state.breaklength - 1),
       
      }):this.setState({
        breaklength: mintues,
        timeleft: `${mintues}:${secoundsOfTimeLeft}`
      });
  }
  breakIncrement(e) {
    let [minutesOfTimeLeft , secoundsOfTimeLeft]=this.getTimeLeft();
    let mintues=this.getPlusMinutes(parseInt(minutesOfTimeLeft)+1);
    if (this.state.breaklength < 60 && this.state.pause === true )
      this.state.canChangeBreak?this.setState({
        breaklength: this.getPlusMinutes(parseInt(this.state.breaklength) + 1),
        
      }):this.setState({
        breaklength: mintues,
        timeleft: `${mintues}:${secoundsOfTimeLeft}`
      });
  }
  sessionIncrement(e) {
    console.log("sessionlength" , this.state)
    let [minutesOfTimeLeft , secoundsOfTimeLeft]=this.getTimeLeft();
    let mintues=this.getPlusMinutes(parseInt(minutesOfTimeLeft)+1);
    console.log("mintues" , mintues)
   
    if (this.state.sessionlength < 60 && this.state.pause === true )
     this.state.canChangeSession?this.setState({
        sessionlength: mintues,
        timeleft: `${mintues}:${secoundsOfTimeLeft}`,
      }):this.setState({
        sessionlength: this.getPlusMinutes(parseInt(this.state.sessionlength) + 1)
      });

  }

  sessionDecrement() {
   
    let [minutesOfTimeLeft , secoundsOfTimeLeft]=this.getTimeLeft();
    let minusMintues=this.getMinusMinutes(minutesOfTimeLeft-1);
    if (this.state.sessionlength > 0 && this.state.pause === true )
     this.state.canChangeSession?this.setState((prevState) =>({
        sessionlength: minusMintues,
        timeleft: `${minusMintues}:${secoundsOfTimeLeft}`,
      })):this.setState({
        sessionlength: this.getMinusMinutes(parseInt(this.state.sessionlength) - 1)
      });
  }



 
  
  startStop(nextState) {
    if (nextState.clicked === false) {
      console.log("entering one CLICKED state")
      if (nextState.session === "Session") {
       console.log("entering session SESSION")
        this.setTimer( "Session");
      } else {
        console.log("entring session BREAK")
        this.setTimer( "Break");
      }
     this.setState({
      pause:false
      })
     
    } else {
      if(nextState.interInterval){
        console.log("clearing intervalII" , nextState);
     clearTimeout(nextState.interInterval);
      }
    
    
      this.setState({
        clicked: false,
        isRunning:false,
        interInterval:null,
        pause:true
      });
      // let timeLeftInSecounds=this.getNumberOfSecounds(nextState.timeleft)
      // console.log('timeleftInSecounds' , timeLeftInSecounds)
      // nextState.sessionlength=nextState.timeleft;
      console.log('next state session' , nextState)
    }
    
  }
  setTimer(sessionType) {
    let [minutesOfTimeLeft , secoundsOfTimeLeft]=this.getTimeLeft();
  
    const endTime = new Date().getTime() + (parseInt(minutesOfTimeLeft) * 60000) + (parseInt(secoundsOfTimeLeft) * 1000);
    this.updateTimer(sessionType , endTime)
    console.log("this.state.interIntrival" , this.state.interInterval)
  }

   updateTimer(sessionType , endTime ){
    // console.log("addMinutes", addMinutes);
    if(this.state.isRunning === false){
      console.log("stop running" , this.state.interInterval)
      this.setState({
        isRunning:true
      })
      return
    }
 
    //get the minutes and seconds from the now variable
    //
    // console.log('now', now)
    let now = new Date().getTime();
     console.log('now', now)
    let t = endTime - now;
    // console.log('t', t)
    let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    // console.log('minutes', minutes)
    let seconds = Math.floor((t % (1000 * 60)) / 1000);
    // console.log('seconds', seconds)
    // var c = hours + ":" + minutes + ":" + seconds;
    // console.log(seconds);
    //set state of timeleft to seconds

    minutes=minutes.toString().padStart(2, '00');
    seconds=seconds.toString().padStart(2, '00');

    if (t < 0 ) {
      console.log("t smaller")
      this.audioRef.current.src = "build.wav";
      this.audioRef.current.play();

    
      if(sessionType ==='Session'){
        this.setState({
          timeleft:`${this.state.breaklength}:00`,
          session:"Break",
          canChangeBreak:false,
          canChangeSession:false
        })
        console.log("Break")
        setTimeout(() => {
          this.setTimer("Break")
        }, 3000);
         
        return
      }else {
        this.setState({
          timeleft:`${this.state.sessionlength}:00`,
          session:"Session",
          canChangeBreak:true,
          canChangeSession:true
        })
        console.log("Session")
        setTimeout(() => {
          this.setTimer('Session')
        }, 3000);
       
        return
      }
    }
    const setTime=()=> setTimeout(() => this.updateTimer(sessionType , endTime), 950);
    console.log("outIII", this.state);
    this.setState({
      timeleft: `${minutes}:${seconds}`,
      clicked: true,
      interInterval:setTime
    });
    console.log("outIV", this.state);
    console.log("interInterval" , this.state.interInterval)
    if(this.state.isRunning !== false){
      console.log("setTime")
        setTime()
     }
     
     
    }

  componentDidUpdate(nextProps, nextState) {
 
    // if(nextState.isRunning===false ){
    //   console.log("nextState.isRunning===false")
    //   this.setState({
    //     isRunning:true
    //   })
    //  }
    if (nextState.sessionlength !== this.state.sessionlength && this.state.reset === true) {
      console.log("prevState", nextState);
   
      this.setState({
        timeleft: `${this.state.sessionlength}:00`,
        reset: false,
      });
    }
  }

  //stop the timer
  //clear the setTimeOut
  //



  

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
            <button id="break-increment" className="paddelement" onClick={(e) => this.breakIncrement(e)}>
              break-increment
            </button>
            <button id="session-increment" className="paddelement" onClick={(e) => this.sessionIncrement(e)}>
              session-increment
            </button>
            <button id="start_stop" className="paddelement" onClick={() => this.startStop(this.state)}>
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
            <button id="break-decrement" className="paddelement" onClick={(e) => this.breakDecrement(e)}>
              break-decrement
            </button>
            <button id="session-decrement" className="paddelement" onClick={(e) => this.sessionDecrement(e)}>
              session-decrement
            </button>
            <button id="reset" className="paddelement" onClick={(e) => this.handleReset(e)}>
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
