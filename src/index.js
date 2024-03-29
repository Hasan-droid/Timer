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


import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const initialState = {
  breaklength: 5,
  sessionlength: 25,
  session: 'Session',
  timeleft: '25:00',
  clicked: false,
  interInterval: null,
  reset: false,
  breakTime: false,
  sessionTime:false

}

class App extends React.Component {
  audioRef = React.createRef();
  constructor(props) {
    super(props)
    this.state =initialState;
  }
  handleReset(e) {
    e.preventDefault()
    clearInterval(this.state.interInterval)
    this.setState(initialState)
  }
  
  breakDecrement(e) {
    if (this.state.breaklength > 0)
      this.setState({
        breaklength: this.state.breaklength - 1
      })
  }
  breakIncrement(e) {
    if (this.state.breaklength < 60)
      this.setState({
        breaklength: this.state.breaklength + 1
      })
  }
  sessionIncrement(e) {
    if (this.state.sessionlength < 60)
      this.setState({
        sessionlength: this.state.sessionlength + 1,
        timeleft: `${this.state.sessionlength +1}:00`
      })
  }



  sessionDecrement() {
    if (this.state.sessionlength > 0)
      this.setState({
        sessionlength: this.state.sessionlength - 1,
        timeleft: `${this.state.sessionlength -1}:00`
      })
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.sessionlength !== this.state.sessionlength && this.state.reset === true) {
    //   console.log('prevState',prevState )
    //   this.setState({
    //     timeleft: `${this.state.sessionlength}:00`,
    //     reset: false
    //   })
    // }
    

  }

  
  
  setTimer(length){

    // let audio = document.getElementById('beep');
    
//  console.log('audio', audio)
//     audio.src = "alarm.mp3";
//     audio.play();



    
    
    console.log('starting interval' , length);
    let deadline = new Date();
    let addMinutes = deadline.setMinutes(deadline.getMinutes() + length);
    let sessionBegin = {
      session: 'Session',
      timeleft: `${this.state.sessionlength}:00`,
      clicked: false,
      breakTime:false,
      sessionTime:true
      
    }
    let breakBegin = {
      session: 'Break',
      timeleft: `${this.state.breaklength}:00`,
      clicked: false,
      breakTime:true,
      sessionTime:false
      
    }
 
    
    let yx = setInterval(() => {
      
      console.log('addMinutes', addMinutes)
      let now = new Date().getTime();
      //get the minutes and seconds from the now variable
      //  
      // console.log('now', now)
      var t = addMinutes - now;
      // console.log('t', t)
      var days = Math.floor(t / (1000 * 60 * 60 * 24));
      var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      // console.log('minutes', minutes)
      var seconds = Math.floor((t % (1000 * 60)) / 1000);
      // console.log('seconds', seconds)
      var c = hours + ":" + minutes + ":" + seconds;
      // console.log(seconds);
      //set state of timeleft to seconds
      
      if (t < 0 && this.state.session === 'Session') {
 this.audioRef.current.src = 'build.wav';
        this.audioRef.current.play();

         clearInterval(yx);
        this.setState(breakBegin)
        console.log('outI' , this.state)
        return;
      }
      if (t < 0 && this.state.session === 'Break') {
        this.audioRef.current.src = 'build.wav';
        this.audioRef.current.play();
        clearInterval(yx);
        this.setState(sessionBegin)
        console.log('outII')
        return;
      }
      console.log('outIII' , this.state)
      this.setState({
        timeleft: `${minutes}:${seconds}`,
        clicked: true,
        interInterval: yx

       
      });
    }, 950);



  }
  
  startStop(nextState) {
    if (nextState.clicked === false) {
      if(nextState.session==='Session'){
        this.setTimer(nextState.sessionlength)
      }else{
        this.setTimer(nextState.breaklength)
      }
    } else {
      console.log('clearing interval');
      let clear = () => clearInterval(nextState.interInterval);
      clear();
      this.setState({
        clicked: false
      })
    }
    
  }
  componentWillUpdate(nextProps, nextState){
  
      if(nextState.session!=='Session' && nextState.breakTime===true ){
        console.log('nextState', nextState)
         this.startStop(nextState);
         this.setState({
            breakTime:false
          })
      }
  
      if(nextState.session!=='Break' && nextState.sessionTime===true ){
        console.log('nextState', nextState)
         this.startStop(nextState);
         this.setState({
            sessionTime:false
          })
      }
     
      if (nextState.sessionlength !== this.state.sessionlength && this.state.reset === true) {
        console.log('prevState',nextState )
        this.setState({
          timeleft: `${this.state.sessionlength}:00`,
          reset: false
        })
      } 
   
  }
  
  render() {
    return <>
      <audio id="beep" ref={this.audioRef}></audio>
      <div className='row-container'>
        <div className='column-container'>
          <div id='break-label'>break label</div>
          <div className='column-container'>
            <div id='session-label'>session-label</div>


            <div id="timer-label">{this.state.session}</div>


            <div id="time-left">{this.state.timeleft}</div>


          </div>
        </div>
      </div>
      <div className='row-container'>
        <div className='column-container'>
          <button id='break-increment' className='paddelement' onClick={(e) => this.breakIncrement(e)}>break-increment</button>
          <button id='session-increment' className='paddelement' onClick={e => this.sessionIncrement(e)}>session-increment</button>
          <button id="start_stop" className='paddelement' onClick={() => this.startStop(this.state)}>Start_Stop</button>
        </div>
        <div className='column-container'>
          <div id='break-length' className='numbers'>{this.state.breaklength}</div>
          <div id="session-length" >{this.state.sessionlength}</div>
        </div>

        <div className='column-container'>
          <button id='break-decrement' className='paddelement' onClick={(e) => this.breakDecrement(e)}>break-decrement</button>
          <button id='session-decrement' className='paddelement' onClick={(e) => this.sessionDecrement(e)}>session-decrement</button>
          <button id="reset" className='paddelement' onClick={(e) => this.handleReset(e)}>Reset</button>
        </div>



      </div>
    </>
  }
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);