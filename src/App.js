import React from "react";
import "./style.css";
import Scores from "./Scores.js";
import {YLobby, GAMETYPE} from "./yscore.js"

function App(props) {

  let lobby = new YLobby("Herve",0,"pros",0);
  lobby.AddPlayer("Lea",1,"pros");
  lobby.SetGameMode (GAMETYPE.doublebonus, false);

  return (
    <div className="App">
      <header className="App-header">
        <h1> <div id='oT'> Yatzee 3D </div> <div id='o3D'> 3D </div> </h1>
      <Scores lobby={lobby}/> 
      </header>
    </div>
  );
}

export default App;
