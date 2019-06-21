module.exports = class room {
  constructor(id, name, max_players)
  {
    this.id = id;
    this.name = name;
    this.max_players = max_players;
    this.players = [];
    this.timer = 0;
    this.countdown = 30 * 10;
    /*
    waiting for players 
    currently playing
    game has ended
    */
    this.state = "waiting for players";
  }
  
  get game_countdown(){return this.timer;}
  get current_state(){return this.state;}

  //true if room is full {or game is currently playing}<add
  is_maxed_out(){ return !(this.players.length < this.max_players);}

  change_state()
  {
    if(this.state === "waiting for players")
      this.state = "currently playing";
  }

  tick()
  {
    //30 => 1 second
    if(this.timer < this.countdown)
    {
      this.timer++;
    }
  }

  check_time()
  {
    if(this.timer < this.countdown)
      return false;

    return true;
  }

}
