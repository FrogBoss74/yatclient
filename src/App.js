import React from "react";
import "./style.css";
import Scores from "./Scores.js";
import {YLobby, GAMETYPE} from "./yscore.js";
import Emitter from './events.js';
import IO from './Socketio.js';
import "./title3d.js";


class App extends React.Component{
  constructor(){
    super();  
    let lobby = new YLobby("Herve",0,"pros",0);
    
    lobby.AddPlayer("Lea",1,"pros");
    lobby.SetGameMode (GAMETYPE.doublebonus, true);

    if (lobby.islocalgame) {
       this.state = {lobby:lobby, emitter:Emitter};
      } 
    else {
      this.state = {lobby:lobby, emitter:IO}
    }
  };

  async componentDidMount(){
    this.state.emitter.emit("LOBBY_READY","Emitter: Lobby is Ready");

    fetch("http://127.0.0.1:8000/auth/getWebsocketIp",{
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin':'http://localhost:3000',
        'Authorization':'abcd'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
      // redirect: 'follow', // manual, *follow, error
      // //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //body: JSON.stringify({greeting:"hello"}) // body data type must match "Content-Type" header
    })
    .then(resp => 
      resp.json())
    .then(data=> 
      console.log(data));
    //console.log(resp);
  };

  render(){
  

    return (
        <div className="App">
          <header className="App-header">
            <h1> <div id='oT'> Yatzee 3D </div> <div id='o3D'> 3D </div> </h1>
          <Scores lobby={this.state.lobby} emitter={this.state.emitter}/> 
          </header>
        </div>
      );
  };
}

export default App;
