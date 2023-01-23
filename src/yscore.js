// Define Yatzee score object constants

export const BONUS_ROW=7;
export const BONUS_VAL=35;
export const BONUS_THRESHOLD = 62;

export const INIT_SCORE_DISPLAY = Array(15).fill("");

export const INIT_CANBEPLAYED =
[
  ...Array(6).fill(true), // top row
  false,                  // bonus
  ...Array(7).fill(true), // bottom row
  false                   // total row
] 

export const INIT_SCORE = Array(13).fill(0);

// Extended Array Object 

/** 
 * YArray is an extension of Array with additional functions
 * 
 * @class
 * @classdescription 
 * The purpose of this class is to be able to apply chainable custom array 
 * methods such as Sum, Unique, Count, etc
 * 
 * @example
 * let arr = new YArray(1,2,3,4);
 * console.log(arr)
 * for (const e of arr){console.log(e)};
 * arr.Sum()
 * // 10
 * 
 **/

export class YArray extends Array{

  /**
   * Check is the input set is in the YArray
   * 
   * @param {Set<Number>} set: set of number
   * 
   * @example
   * (new YArray(1,2,3,4,5).IsIn(new Set([1,2,3]))
   * // return true
   * 
   **/

  IsIn (set) {
      return this.every(v => set.has(v));
    };

  // Sum of YArray elements
  Sum () {
      return this.reduce((c, v) => c + v);
    };   
  
  // Count of values in YArray
  Count (val) {
    return this.filter(v => v === val).length;
  };
  
  // Extract the unique values in the YArray
  Unique () {
    return [...new Set(this)];
  };
  
  // Check if all values in the YArray are identical
  AreValsIdentical () {
      return this.Unique().length === 1;
  };
    
  /**
  * Decompose a YArray into all permutations of two arrays with first one of lenght byN
  * 
  * @param {Number} byN 
  * @returns YArray of Array
  */

  Decomp2 (byN) {

      const arr = this.reduce((c, v, i, a) => {

        if (i <= a.length - byN){

          const digitset = 
          [
            a.slice(i, byN + i), 
            a.slice(0, i).concat(a.slice(byN + i))
          ];  

          c.push(digitset);

        }
        return c;

      }, []);

      return new YArray(...arr);
  };
    
  /**
   * Reorder the decomposed YArray of Array to ensure the longer length is first
   * 
   * @returns Reordered YArray
   */

  ReorderArr () {

      const arr = this.map(v =>
        v[0].length > v[1].length ? 
           new YArray( v[0], v[1]) : 
           new YArray( v[1], v[0])  
      );

      return arr;
  };
    
}


export class YRoll extends YArray{

  NROUNDS = 3;  

  constructor(arr,holdmask){
    const input = arr || [0,0,0,0,0];
    const inputhold = holdmask || [0,0,0,0,0];
    super(...input);
    this._holdmask = inputhold;
    this._score = INIT_SCORE;
    this._nextrollnumber = 1;
    this._doublebonus = false;
  }l

  // iterator

  *[Symbol.iterator]() {
    for (const [,v] of this.entries())
       yield v;
  } 

  // properties

  /**
   * Return the array of YArray for dice roll
   **/
  get roll (){
    return new YArray(...this)
  }

  /**
   * Set the array of YArray for dice roll
   **/
  set roll (arr){
    return arr.map((v,i)=>this[i]=arr[i]);
  }

  /**  
   * Check status of doublebonus
   **/
  get doublebonus () {
    return this._doublebonus}

  /**
   * Set status of doublebonus
   **/
  set doublebonus (bool){
    this._doublebonus=bool;
  }

  /**
   * Get the nextrollnumber used to limit how many times 
   * the user can roll dice
   **/
  get nextrollnumber() {
    return this._nextrollnumber;
  }

  get canrollagain(){
    return (this._nextrollnumber>3)?false:true;
  }

  /**
   * Set the nextrollnumber used to limit how many times 
   * the user can roll dice
   **/
  set nextrollnumber(n) {
    this._nextrollnumber=n;
  }

  /**
   * Increment the nextrollnumber 
   **/
  IncRollNumber (){
    this._nextrollnumber++;
  }

  /**
   * Get the current score values the user can select
   */
  get score() {
    return this._score;
  }

  /**
   * Get the current mask that marks which dice cannot be rolled
   */
  get holdmask() {
    return this._holdmask;
  }

  /**
   * Set the current mask that marks which dice cannot be rolled
   */
   set holdmask (holdarr){
    this._holdmask = holdarr;
  }
  

  // methods

  /**
   * Convert YRoll array to Array
   * @returns {Array} Array of values
   */
  ToArray() {
    return [...this.roll.values()];
  }

  /**
   * Check if straight of 4
   * @returns 
   */
  IsStraight4 () {
    
    return (
      new YArray(1, 2, 3, 4).IsIn(new Set(this)) ||
      new YArray(2, 3, 4, 5).IsIn(new Set(this)) ||
      new YArray(3, 4, 5, 6).IsIn(new Set(this))
    );

  };

  /**
   * Check if straight of 5
   * @returns 
   */  
  IsStraight5 () {

      return (
        new YArray(1, 2, 3, 4, 5).IsIn(new Set(this)) || 
        new YArray(2, 3, 4, 5, 6).IsIn(new Set(this))
      );

  };

  /**
   * Check if Full
   * 
   * @returns 
   */
  IsFull () {

    const arr = new YArray(...this.sort())
      .Decomp2(3) // return list of YArray
      .ReorderArr();  // this is called as it will transformed the inner Array in YArray

    return arr.reduce(
      (c, v) => c || (v[0].AreValsIdentical() && v[1].AreValsIdentical()),
      false
    );

  };
    
  /**
   * Check if N of Kind
   * @param {Number} n 
   * @returns 
   */
  NOfKind (n) {

    const arr = new YArray(...this.sort())
      .Decomp2(n) // return list of YArray
      .ReorderArr();

    return arr.reduce((c, v) => (
      c + v[0].AreValsIdentical() ? v[0].Sum() + v[1].Sum() : 0),
      0 // initial cumulative value
    );
    
  };
  
  /**
   * Save score to Array(13)
   */
  SetScore () {

    const arr = new YRoll(this.roll.slice()); // Make sure constructor is passed

    if (arr.Unique() === 0) 
      this._score = Array(15).fill("");

    else {
      this._score = 
      [
        arr.roll.Count(1),
        arr.roll.Count(2) * 2,
        arr.roll.Count(3) * 3,
        arr.roll.Count(4) * 4,
        arr.roll.Count(5) * 5,
        arr.roll.Count(6) * 6,
        arr.NOfKind(3) * (this.doublebonus?2:1),
        arr.NOfKind(4) * (this.doublebonus?2:1),
        (arr.IsFull() ? 25 : 0) * (this.doublebonus?2:1),
        (arr.IsStraight4() ? 25 : 0) * (this.doublebonus?2:1),
        (arr.IsStraight5() ? 35 : 0) * (this.doublebonus?2:1),
        (arr.AreValsIdentical(5) ? 50 : 0) * (this.doublebonus?2:1),
        arr.roll.Sum()
      ];
    } 

  };
    
  /**
   * Display score to Array(15) to match DOM
   */
  get scoredisplay () {
    this.SetScore();
    return [
            ...this._score.slice(0, BONUS_ROW-1), // top
            "", // Bonus row
            ...this._score.slice(BONUS_ROW-1), // bottom
            ""  // Total row
            ];
  };

  /**
   * Export Roll object to JSON
   **/
  Export () {

    let scoremsg = new IYRoll();

    scoremsg.roll = this.ToArray();
    scoremsg.score = this.score;
    scoremsg.preview = this.scoredisplay;
    scoremsg.holdmask = this.holdmask;
    scoremsg.nextrollnumber = this.nextrollnumber;
    
    return JSON.stringify(scoremsg);
    
  }

  /**
   * Import score JSON to Roll object and override values
   * @param {Object} json 
   * @returns 
   */
  static Import (json) {

    const rollobject = JSON.parse(json);   // to.do check if valid

    let r = new YRoll();

    r.roll= rollobject.roll;
    r.holmask = rollobject.holdmask;
    r.nextrollnumber = rollobject.nextrollnumber;
    
    r.SetScore();

    return r;

  }

 
  /**
   * Roll dice (depending on user holds) and store YArray of 5 dice elements and return IYArray object
   * 
   * @param {Array} holdArr: Array of holds with 1 being hold and 0 being rolled
   * @param {Boolena} doublebonusmode: Apply double bonus mode or not 
   * @param {Number} diceMax: default to 6 {other values currently not supported}
   * @returns 
   */

  Roll (holdArr = this.holdmask, doublebonusmode=true, diceMax = 6) {

      //check if roll is allowed
      if (this.nextrollnumber > this.NROUNDS)
         return new IYRoll(this.ToArray(), this.score, this.scoredisplay, this.holdmask, this.nextrollnumber); 

      // update roll array   
      if (holdArr)
         this.holdmask = holdArr;

      // make sure array is flattened
      const ha = [...this.holdmask]; 

      // get random dice 
      let arr = this.roll.map((v, i) => 
        ha[i % ha.length] ? v : Math.floor(Math.random() * diceMax + 1)
      ); 

      // check double bonus status
      this.doublebonus = (this.nextrollnumber === 1) && doublebonusmode ?true:false;

      this.roll= arr;  

      // update score
      this.SetScore();
      
      // inc nextrollnumber
      this._nextrollnumber++;
      
      return new IYRoll(this.ToArray(), this.score, this.scoredisplay, this.holdmask, this.nextrollnumber); 
  };
  
}



/**
 * Define interface for Score
 * Object that will be exchanged with Server
 * @interface
 **/ 

export class IYRoll {
  constructor(roll,score,preview,holdmask,nextrollnumber){
    this.roll=roll;
    this.score=score;
    this.preview =preview;
    this.holdmask = holdmask;
    this.nextrollnumber = nextrollnumber;
  }
}




/**
* YScore (overallscore, scoredisplay) initialising preview score and overallscore
* @class
* The objective of YScore is to perform Score addition with selected value index from the DOM
* as well as computing overall score
*
* @example
* y =new YRoll();
* y.Roll();
* 
* console.log(y.roll);
* console.log(y.score);
* console.log(y.Export());
* 
* console.log(y);
*
* s = new YScore([3,6,9,16,20,0,"",20,20,25,25,35,50,30,""])
* s.AddRollValue(5,[3,6,9,16,20,24,"",20,20,25,25,35,50,30,""]) // return 24
* s.Bonus()
* s.GetFinalScore()
* 
* console.log(s);
*
**/

export class YScore {

    /**
    * YScore (overallscore, canbeplayed) 
    * @param {Array<number>} overallscore: Overall Score array of length 15 from database
    * @param {Array<boolean>} canbeplayed: Bool array of length 15 giving status of 
    * which values have been played (false) or can be played (true)
    * @example
    **/

    constructor (overallscore, canbeplayed){
      this._overallscore = overallscore || INIT_SCORE_DISPLAY.slice(); // slice ensures new instances of INIT obj
      this._canbeplayed = canbeplayed || INIT_CANBEPLAYED.slice();
    }
    
    /**
     * Check if usersection is playable
     * @param {Number} userselectedrollindex 
     */
        
    CanBePlayed(userselectedrollindex){
      return this._canbeplayed[userselectedrollindex];
    }

    RoundsLeftToPlay(){
      return this._canbeplayed.reduce((c,v)=> c += (v?1:0));
    }

    /**
     * Get canbeplayed array
     */

    get canbeplayedarray (){
       return this._canbeplayed;
    }

    /**
    * Add selected roll score value to existing score then return the added value
    * @param {number} userselectedrollindex Displayscore array (of length 15) index of DOM array 
    * @param {Array<number|string>} scoredisplay: Score preview array of length 15 to extract added value (note it may be empty strings) 
    * representing user selection
    * @return {number} the added value 
    **/

     AddRollValue(userselectedrollindex, scoredisplay) {
     
      if (!this.CanBePlayed(userselectedrollindex))
         throw Error("This value has already be played");

      const rollvalue = scoredisplay[userselectedrollindex];
      const rollvalueparsed = parseInt(rollvalue,10);

      const score = this._overallscore[userselectedrollindex] + rollvalueparsed;
      const scoreparsed = parseInt(score,10);

      this._overallscore[userselectedrollindex] = scoreparsed;
      this._canbeplayed[userselectedrollindex] = false;

      return rollvalueparsed;

    }
    
    /**
     * Returns YArray of the top row of the Yatzee table excluding bonus row
     * @returns
     */
    TopRow() {
      return new YArray ( ...this._overallscore.slice(0, BONUS_ROW-1).map(v=>parseInt(v?v:0,10)));
    }

    /**
     * Returns YArray of the bottom row of the Yatzee table excluding total row
     * @returns 
     */
     BottomRow() {
      return new YArray ( ...this._overallscore.slice(BONUS_ROW, - 1).map(v=>parseInt(v?v:0,10)));
    }

    /**
     * Returns Bonus value if applicable
     * @returns 
     */
    Bonus () {
      return this.TopRow().Sum() > BONUS_THRESHOLD ? BONUS_VAL : 0;
    };

    /**
     * Return the sum of values for top row including bonus
     * @returns 
     */
    TopRowSum(){
       return this.TopRow().Sum() + this.Bonus();
    }

    /**
     * Return the sum of values of the bottom row
     * @returns 
     */
    BottomRowSum(){
       return this.BottomRow().Sum();
    }

    /**
     * Return the sum of top and bottom rows including bonus
     * @returns 
     */
    Sum (){
      return this.BottomRowSum() + this.TopRowSum();
    }
      
    /**
     * Return total score Array(15) for directly displaying on DOM
     * @returns 
     */
    GetFinalScore () 
    {
         return [
                  ...this._overallscore.slice(0, BONUS_ROW-1), // top triming bonus
                  this.Bonus(), 
                  ...this._overallscore.slice(BONUS_ROW,-1), // bottom triming total
                  this.Sum()
                ];
    };

    /**
     * Export function to transfer score object to server
     */

    Export(){
      return JSON.stringify({overallscore: this._overallscore, canbeplayed: this._canbeplayed});
    }

    /**
     * Import function to transfer score from server
     */

    Import(json, parsed){
      let obj = json;
      if (!parsed)
         obj = JSON.parse(json);
      return new YScore (obj._overallscore,obj._canbeplayed);
    }
      
      
}


export class YPlayer {
  constructor(name, id=0, team){
    this.name = name;
    this.team = team;
    this.id = id;
    this.yscore = new YScore();
    this.yroll = new YRoll();
  }
}

export const GAMETYPE = {
  classic: "Classic",
  doublebonus: "Doublebonus"
}

export class YLobby {
  constructor(name, id, team, socketid=0){
    this.hostid = socketid;
    this.players = [new YPlayer(name,id,team)];
    this.playerscount = 1;
    this.gametype = GAMETYPE.doublebonus;
    this.islocalgame = false;
  }

  SetGameMode (gametype = GAMETYPE.doublebonus, islocalgame = false){
    this.gametype = gametype;
    this.islocalgame = islocalgame;
    
    console.log(`GameMode Selected: ${this.gametype}, local:${this.islocalgame}`);
  }

  AddPlayer(name, id, team){
    this.players.push(new YPlayer(name,id,team));
    this.playerscount++;
  }

  SearchPlayer(id) {
    return this.players.find(p => p.id===id);
  }

  GetIndexOfPlayerByName(name){
    return this.players.indexOf(this.SearchPlayerByName(name));
  }

  GetIndexOfPlayerByID(id){
    return this.players.indexOf(this.SearchPlayer(id));
  }

  SearchPlayerByName(name){
    return this.players.find(p => p.name===name);
  }

  RemovePlayer(id) {
    const index = this.GetIndexOfPlayerByID(id);
    const playerreomoved = this.players.splice(index,1);
    this.playerscount--;

    console.log(`${playerreomoved.name} has left the lobby`)
  }

  StartGame(){
    return new YGame(this.hostid, this.players, this.gametype, this.islocalgame, 0)
  }
}

export class YGame {
  constructor(gameid, players, gametype, islocalgame, currentplayerindex, beginingofturn, inputhold, nextrollnumber){
    this.gameid = gameid;
    this.lobby = players || [];
    this.gametype = gametype || GAMETYPE.doublebonus;
    this.islocalgame = islocalgame || false;
    this.currentplayerindex = currentplayerindex || 0;
    this._beginingofturn = beginingofturn || true;
    this._holdmask = inputhold || [0,0,0,0,0];  // only sync and used for import and export
    this._nextrollnumber = nextrollnumber || 1;                     // only sync and used for import and export
  }


  GetCurrentPlayer(){
    return this.lobby[this.currentplayerindex];
  }
 
  GetPreviousPlayer(){
    return this.lobby[(this.currentplayerindex-1+this.lobby.length)%this.lobby.length];
  }
    

  GetCurrentPlayerRoll(){
    return this.GetCurrentPlayer().yroll;
  }

  GetPreviousPlayerRoll(){
    return this.GetPreviousPlayer().yroll;
  }

  Roll() {
    
    
    const yroll = this.GetCurrentPlayerRoll();
    const isdoublebonus = this.gametype === GAMETYPE.doublebonusmode;

    if (yroll.nextrollnumber>3){
      this.PassTurn();

    } else {
      this._beginingofturn = false;
      yroll.Roll(yroll.holdmask, isdoublebonus);

      console.log("Rolled");
    }
  }

  ValidateScore(index) {
    const player = this.GetCurrentPlayer();
    const roll = this.GetCurrentPlayerRoll();
    player.yscore.AddRollValue(index,roll.scoredisplay);
  }


  PassTurn (){

    if (this.endgame) 
    {
        console.log("End of Game");
    }

    this._beginingofturn=true;

    this.currentplayerindex = (this.currentplayerindex + 1) % this.nplayers;
    const nextplayer = this.GetCurrentPlayer();
    nextplayer.yroll = new YRoll();
    

    console.log("Pass Turn");
    
  }

  UpdateHoldMask(arr){
    const yroll = this.GetCurrentPlayerRoll();
    yroll.holdmask=arr.slice();

    console.log("Hold mask updated");
  }

  Export(){
    this._holdmask = this.holdmask;
    this._nextrollnumber = this.nextrollnumber;
    return JSON.stringify(this);
  }

  Clone (yg){
    const clone = yg.JsonToYgame(yg.Export());
    return clone;
  }
  
  JsonToYgame(json){

    let yg = Object.assign(new YGame(), JSON.parse(json));

    

    let players = yg.lobby.map(
      p => {
        let p2 = Object.assign(new YPlayer(),p);
        p2.yscore = new YScore().Import(p2.yscore, true);
        p2.yroll = new YRoll(p2.yroll,[0,0,0,0,0]);
        p2.yroll.SetScore();
        return p2;
      });

    
    yg.lobby = players;

    yg.nextrollnumber = yg._nextrollnumber;
    yg.holdmask = yg._holdmask;

    
    return yg;
  }
 
  get nextrollnumber (){
    return this.GetCurrentPlayerRoll().nextrollnumber;
  }

  set nextrollnumber (n){
    this.GetCurrentPlayerRoll().nextrollnumber = n;
  }


  get canrollagain (){
    return this.GetCurrentPlayerRoll().canrollagain && !this.endgame;
  }

  get allplayernames (){
    return this.lobby.map(p=>p.name);
  }

  get allplayerscores(){
    return this.lobby.map(p=>p.yscore.GetFinalScore());
  }

  get currentplayername(){
    return this.GetCurrentPlayer().name;
  }

  get currentplayerscorefinal(){
    return this.GetCurrentPlayer().yscore.GetFinalScore();
  }


  get currentplayerscorepreview(){
    return this.GetCurrentPlayerRoll().scoredisplay;
  }

  get roll(){
    return this.GetCurrentPlayerRoll().roll;
  }

  get holdmask(){
    return this.GetCurrentPlayerRoll().holdmask;
  }

  set holdmask(arr){
    this.UpdateHoldMask(arr);
  }

  get previousroll(){
     return this.GetPreviousPlayerRoll().roll;
  }

  get endgame (){
    return this.lobby.every(p => p.yscore.RoundsLeftToPlay()===0 );
  }

  get canbeplayed (){
    return this.GetCurrentPlayer().yscore.canbeplayedarray;
  }

  get enableclick (){
    return this.canbeplayed.map(v => v && !this.beginingofturn && !this.endgame);
  }

  get nplayers (){
    return this.lobby.length;
  }

  get beginingofturn(){
    return this._beginingofturn;
  }

}

export class IOClientDispatcher {
  constructor(emitter){
    this.emitter = emitter;
  }

  requestRoll(holdarray){
    this.emitter.emit('HasRolled',holdarray);
  }

  requestScoreUpdate(yplayer){
    this.emitter.emit('HasUpdatedScore',yplayer);
  }

  requestPassTurn(nextplayer){
    this.emitter.emit('NextPlayer', nextplayer);
  }

}

export class IOServerListener {
  constructor(emitter, game){
    this.emitter = emitter
    this.game = game;
  }
  
  Start(){
    this.emitter.on('HasRolled', rollarray => this.game.Roll(rollarray) );
    
  }

  requestScoreUpdate(yplayer){
    this.emitter.emit('HasUpdatedScore',yplayer);
  }

  requestPassTurn(nextplayer){
    this.emitter.emit('NextPlayer', nextplayer);
  }

}


export class IOServerDispatcher {
  constructor(emitter){
    this.emitter = emitter;
  }


  
}

export class IOlistener {
  constructor(emitter){
    this.emitter = emitter;
  }
  
 // this.emitter.on('ReturnRoll',()=>())
}



export class UIHandler {
  PlayerHasRolled  (yroll){
//    sendToOthers(yroll);

  }
}
