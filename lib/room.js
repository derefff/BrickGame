module.exports = class room {
  constructor(id, name, max_players)
  {
    this.id = id;
    this.name = name;
    this.max_players = max_players;
    this.players = [];
    this.active_players = []; // those who's leaved = false;
    this.timer = 0;
    this.time_limit = 60*5; // by default idk 5 min
    this.countdown = 30;
    this.flag_room_state = false; 
    this.end_game = false; //kick evry player to the lobbby

    /*waiting for players -> 1 min countdown
    currently playing ->  1min countdown interval  | also time limit here 
    game has ended -> if has players 1min countdown*/
    this.state = "waiting for players";
  }
  
  get game_countdown(){return this.countdown;}
  get current_state(){return this.state;}

  //true if room is full {or game is currently playing}<add
  is_maxed_out(){ return !(this.players.length < this.max_players);}

  change_state(next_state){this.state = next_state;}

  tick(){this.timer++;}

  is_empty()
  { 
      let num_players = this.players.length;
      let counter = 0;
      for(let p of this.players)
        if(p.leave) counter++;

      if(counter == num_players)  return true;
      return false;
  }

  update_active_players()
  {
    this.active_players = [];
    for(const pl of this.players)
      if(!pl.leaved) this.active_players.push(pl);
  }

  how_many_active_players()
  {
    return this.active_players.length;
  }

  in_play()
  {
    let counter = 0;
    for(const pl of this.players)
      if(pl.alive == false) counter++;

    return counter;
  }

  update_countdown()
  {
    if(this.countdown > 0 && (this.current_state == "game has ended" || this.in_play() != 1))// or game time limit is false  
    {
      this.countdown --;
    }
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
          if(this.check_time_limit() && this.in_play() != 1)
          {
            this.countdown = 20;
          }
          else //if(there is only 1 player in the game or time limit is over) :todo
          {
            this.change_state("game has ended");
            this.countdown = 10;
            this.flag_room_state = true;
          }
        break;
          
        case "game has ended":
            this.end_game = true;
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
