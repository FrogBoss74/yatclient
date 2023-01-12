import React from "react";
import "./style.css";

import {score_labels } from "./const.js";
import Players from "./Players.js";
import ScoreRow from "./ScoreRow.js";
import Dice from "./Dice.js";
import {YGame} from "./yscore.js";

export default class Scores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: props.lobby.StartGame()
    };

    this.handleClickRoll = this.handleClickRoll.bind(this);
    this.handleClickHold = this.handleClickHold.bind(this);
    this.clickScore = this.clickScore.bind(this);
    this.switchClass = this.switchClass.bind(this);
    this.resetClass = this.resetClass.bind(this);
  }

  handleClickRoll = e => {
    e.preventDefault( );
   
    let game = Object.assign( new YGame(), this.state.game); 
    
    if (game.canrollagain){
      game.Roll();

      this.setState (state => ({game: game}), () => console.log("roll",game.roll, "\nhold",game.holdmask));
    
    }
     console.log(game.GetCurrentPlayerRoll());
   
  };

  switchClass = (i, trueCond, fromClass, toClass) => {
    const el = document.getElementById("d" + i);
    if (trueCond) {
      el.classList.remove(fromClass);
      el.classList.add(toClass);
    } else {
      el.classList.remove(toClass);
      el.classList.add(fromClass);
    }
  };



  resetClass = (i, fromClass, toClass) => {
    const el = document.getElementById("d" + i);
    if (el.classList.contains(fromClass)) {
      el.classList.remove(fromClass);
      el.classList.add(toClass);
    } else {
      
    }
  };


  handleClickHold = (e, i) => {
 
    e.preventDefault();     

    let game = Object.assign( new YGame(), this.state.game); 
    let h = [0,0,0,0,0];
      
    if (!game.beginingofturn){

      h = game.holdmask.slice();// this.state.diceHoldsArr;
      
      h[i] = !h[i];

      this.switchClass(i, h[i] === true, "DiceRoll", "DiceHold");

    }

   game.holdmask = h;

   this.setState (state => ({game: game}), () => console.log(h));

  };

  clickScore = (e, i, enableClick) => {
    
    let game = Object.assign( new YGame(), this.state.game); 

    //const canBePlayed =  this.state.canBePlayed;
    //const canbeplayedarray = game.GetCurrentPlayer().yscore.canbeplayedarray.slice();

    const clickarray = game.enableclick;

    e.preventDefault();

    if (clickarray && clickarray[i]) {
       
      game.ValidateScore(i);
      game.PassTurn();

      game.holdmask.map((v,i)=>this.resetClass(i,"DiceHold","DiceRoll"));

      this.setState (state => ({game: game}), () => console.log("begining of turn", game.GetCurrentPlayer().yscore));

      if (game.endgame) {
        this.setState(state => ({
          endGame: true
        }));
      }
    }
  };

  render() {

    let myroll             = this.state.game.roll.slice();
    const previousplayerroll = this.state.game.previousroll.slice();

    const score_preview      = this.state.game.currentplayerscorepreview.slice();
    
    const players_names      = this.state.game.allplayernames.slice();
    const players_score      = this.state.game.allplayerscores.slice();
    const currentplayerindex = this.state.game.currentplayerindex;

    const enableclick        = this.state.game.enableclick.slice();

    const displayprevious    = myroll.every(v => v===0);

    if (displayprevious)
      myroll = previousplayerroll;
       
    const displaydice         = !(displayprevious && previousplayerroll.every(v => v===0));

    
    const getScoreLabels = () => score_labels;

    
 
    return (
      <>
        <table>
            <tbody>
     
            <Players key={players_names}
              players={players_names}
              handleClickRoll={this.handleClickRoll}
              activePlayerInd={currentplayerindex}
            />

            {getScoreLabels().map((l, r) => (
              <ScoreRow key={"sr"+r}
                labels={l}
                score_preview={score_preview}
                display_preview = {!this.state.game.beginingofturn && !this.state.game.endgame}
                row={r}
                allowHover={enableclick[r]}
                handleClickScore={this.clickScore}
                scoreRow={players_score.map(p =>p[r])}
              />
              
            ))}

          </tbody>
        </table>
        <Dice key="Dice"
          roll={myroll} 
          handleClickHold={this.handleClickHold}
          display={displaydice}
        />

      </>
    );
  }
}
