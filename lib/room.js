module.exports = class room {
  constructor(id, name, max_players)
  {
    this.id = id;
    this.name = name;
    this.max_players = max_players;
    this.players = [];
    this.timer = 0;
    this.time_limit = 60 // by default idk 5 min
    this.countdown = 20;
    this.flag_room_state = false; 

    /*
    waiting for players -> 1 min countdown
    currently playing ->  1min countdown interval  | also time limit here 
    game has ended -> if has players 1min countdown
    */
    this.state = "waiting for players";
  }
  
  get game_countdown(){return this.countdown;}
  get current_state(){return this.state;}

  //true if room is full {or game is currently playing}<add
  is_maxed_out(){ return !(this.players.length < this.max_players);}

  change_state(next_state){this.state = next_state;}

  tick(){this.timer++;}

  update_countdown()
  {
    if(this.countdown > 0) // or game time limit is false  
      this.countdown --;
    else
    {
      switch(this.current_state)
      {
        case "waiting for players":
          //idk change flag start update and other 
          this.change_state("currently playing");
          this.countdown = 20;
          this.flag_room_state = true;
        break;

        case "currently playing":
          if(this.check_time_limit())
          {
            this.countdown = 20;
            //make turn harder 
          }
          else //if(there is only 1 player in the game or time limit is over) :todo
          {
            
            this.change_state("game has ended");
            this.countdown = 10;
            this.flag_room_state = true;
          }
        break;
          
        case "game has ended":
            //fireworks show who has won
            this.countdown = 20;
            this.flag_room_state = true;
            //check if anybody is still in the room
            //if so start new game
            //if not DESTROY the ROOM
        break;
      }
    }

  }

  check_time_limit()
  {
    if(this.timer < this.countdown)
      return false;

    return true;
  }

}
