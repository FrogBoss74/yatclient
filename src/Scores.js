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
      game: props.lobby.StartGame(),
      gameundo: new YGame()
    };

    this.handleClickRoll = this.handleClickRoll.bind(this);
    this.updateAfterRoll = this.updateAfterRoll.bind(this);
    this.handleClickHold = this.handleClickHold.bind(this);
    this.clickScore      = this.clickScore.bind(this);
    this.updateAfterScore  = this.updateAfterScore.bind(this);
    this.switchClass     = this.switchClass.bind(this);
    this.resetClass      = this.resetClass.bind(this);
    this.handleClickUndo = this.handleClickUndo.bind(this);
    //this.handlemessages  = this.handlemessages.bind(this);

 
  }

  componentDidMount(){
    if (this.state.game.islocalgame){
      this.props.emitter.on("LOBBY_READY", (m) => console.log(m));
      this.props.emitter.on("ROLL_CLICKED",(m) => this.updateAfterRoll(m));
      this.props.emitter.on("SCORE_CLICKED",(m) => this.updateAfterScore(m));
  
    }

  };


  handleClickRoll = e => {
    e.preventDefault( );
   
    if (this.state.game.canrollagain){
      this.props.emitter.emit("ROLL_CLICKED", this.state.game.Export());
    }
   
  };

  updateAfterRoll = (json) => {
    let game = this.state.game.JsonToYgame(json); 
    
    if (game.islocalgame){
      game.Roll();
      }

    this.setState (state => ({game: game}), () => console.log("roll",game.roll, "\nhold",game.holdmask));
    console.log(game.GetCurrentPlayerRoll());


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
    let gameundo = game.Clone(game); 

    const clickarray = game.enableclick;

    e.preventDefault();
    
    this.setState (state => ({gameundo:gameundo}), () => console.log("begining of turn", game.GetCurrentPlayer().yscore));


    if (clickarray && clickarray[i]) {
      this.props.emitter.emit("SCORE_CLICKED", {game:this.state.game.Export(),row:i});     

    }
  };

  updateAfterScore = (json) => {
    
    if (!json.game || !json.row){
      console.log('Json.game not available');
      return;
    }

    let game = this.state.game.JsonToYgame(json.game); 
    
    if (game.islocalgame) {
      const i = parseInt(json.row,10);   
      game.ValidateScore(i);
      game.PassTurn();
    } 
      
    game.holdmask.map((v,i)=>this.resetClass(i,"DiceHold","DiceRoll"));
      
    this.setState (state => ({game: game}), () => console.log("begining of turn", game.GetCurrentPlayer().yscore));

    if (game.endgame) {
        this.setState(state => ({
          endGame: true
        }));  
    }
    
  };

  handleClickUndo = (e, enableClick) => {
    
    let game = Object.assign( new YGame(), this.state.game); 
    let gameundo = Object.assign( new YGame(), this.state.gameundo); // no need deep copy here

    e.preventDefault();

    if (game.beginingofturn && !(this.state.gameundo.gameid === undefined)){
      this.setState (state => ({game: gameundo, gameundo:gameundo}), () => console.log("Undo of score"));

    }

    
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
              handleClickUndo={this.handleClickUndo}
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
