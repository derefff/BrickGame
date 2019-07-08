class Game{
	constructor(ctx,W,H)
	{
		this.ctx = ctx;
		this.WIDTH = W;
		this.HEIGHT = H;
		this.block_size = 20;
		this.board = new Board(this.block_size);
		this.tetromino = new Element(this.board.cell_width/2-2,0,20,this.board.x,this.board.y);
		
		this.up_key_flag = false;
		this.tick = 0;
		this.MAX_TICK = 20;	
		this.stop_playing = false;

		this.other_players = [];
		this.id;
		this.countdown = "[]";

		this.state_index = 0;
    this.states = ["waiting for players", "currently playing", "game has ended"];
    this.state = this.states[this.state_index % 3];
		/*waiting for players -> 1 min countdown
    currently playing ->  1min countdown interval  | also time limit here 
    game has ended */
		this.s = false;
	}

	is_playing(){return this.stop_playing;}

	send(){
		if(this.s)
		{
			this.s = false;
			return true;
		}
	}
	
	send_data() { return this.board.current_board; }
	
	change_state()
	{
		this.state_index++;
		this.state = this.states[this.state_index % 3];
	}

	draw_hud(ctx)
	{
		ctx.beginPath();
		ctx.strokeStyle= 'white';
		ctx.moveTo(201,0);
		ctx.lineTo(201, 400);
		ctx.stroke();
		ctx.fillStyle = '#000';
		ctx.font = '0.9em Arial';
		ctx.fillText('next shape', 205, 55);
		ctx.closePath();

		Misc.draw_matrix(ctx,this.tetromino.next_shape,15,0,0,220,60);
	}

	draw_countdown()
	{
			this.ctx.beginPath();
			this.ctx.font = '2em Arial'
			this.ctx.fillStyle = 'black';
			switch(this.state_index)
			{
				case 0: this.ctx.fillText("waiting for players", 20, 450);	break;
				case 1: this.ctx.fillText("next wave in ", 45, 450);	break;
				case 2: this.ctx.fillText("next game in ", 45, 450);	break;
			}
			this.ctx.font = '4em Arial';
			this.ctx.fillText(`${this.countdown}`, 100, 510);
			this.ctx.closePath();
	}

	render_other_players(ctx)
	{
		let x = 0;
		let all_players = this.other_players.length-1;

		for(let i in this.other_players)
			if(this.other_players[i].id != this.id)
			{
				//here gonna be few errors 
				let rows_of_players = Math.floor(all_players/5);
				let bs = 20-(5*rows_of_players);
				let board_width=bs*10;
				let board_height=bs*20;
				let current_row = Math.floor(i/5);
				x%=5;

				ctx.beginPath();
				ctx.strokeStyle = 'black';
				// ctx.fillStyle = 'darkgray';
				ctx.strokeRect(310+(board_width * x + 10), board_height * current_row, board_width, board_height);
				ctx.stroke();
				ctx.closePath();

				if(!this.other_players[i].alive)
				{
					Misc.draw_matrix(ctx,this.other_players[i].board,bs,0,0,310+(board_width*x+10),board_height*current_row);
				}
				else
				{
					ctx.beginPath();
					ctx.font = "18px Georgia";
					ctx.fillText("Player has lost!",310 + (board_width * x + board_width / 2 -50 ), board_height * current_row + board_height/2);
					ctx.closePath();
				}
				x++;
			}
	}


	render()
	{
		//drawing background #5b6856
		this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
		this.ctx.fillStyle='darkgray';
		this.ctx.strokeStyle = 'black';
		this.ctx.fillRect(0,0, this.WIDTH, this.HEIGHT);

		//drawing other things
		this.board.render(this.ctx);

		//draw other players	
		this.render_other_players(this.ctx);				
		this.tetromino.draw(this.ctx);
		this.draw_hud(this.ctx);
		this.draw_countdown();
		
	}

	make_game_harder()
	{
		
	}

	update()
	{	
		//time delay
		setTimeout(()=>{

		if(this.tick == this.MAX_TICK)
		{
			if(!key.down)this.tetromino.y += 1;
			if(this.tetromino.collide(this.board.current_board))
			{
			  this.tetromino.y -= 1;
				this.board.add_tetromino(this.tetromino);
				this.board.check_rows();
				this.tetromino.dead();
				this.s = true;
			}
			this.tick = 0;
		}

		if(this.tetromino.is_dead)
		{
			this.tetromino.is_dead = false;
			this.tetromino.set_new_shape();
			this.tetromino.y = 0;
			this.tetromino.x = this.board.cell_width/2-2;
			if(this.tetromino.collide(this.board.current_board))
				this.stop_playing = true;
			
		}
			
		//key response and bondry checking
		if(key.left) 
			{
				if(!(this.tick % 2)) this.tetromino.x -= 1;
				if(this.tetromino.collide(this.board.current_board))
					this.tetromino.x += 1;
			}

		if(key.right) 
			{
				if(!(this.tick % 2)) this.tetromino.x += 1;
				if(this.tetromino.collide(this.board.current_board))
					this.tetromino.x -=1;
			}

		if(key.down)
			{
				if(!(this.tick % 2))this.tetromino.y +=1;
				if(this.tetromino.collide(this.board.current_board))
				{
					this.tetromino.y -= 1;
					this.board.add_tetromino(this.tetromino);
					this.board.check_rows();
					this.tetromino.dead();
				}
			}

		if(key.up) 
		{
			if(!this.up_key_flag)
			{
				this.up_key_flag = true;
				this.tetromino.rotate();
				if(this.tetromino.collide(this.board.current_board))
				{
					this.tetromino.rotate();
					this.tetromino.rotate();
					this.tetromino.rotate();
				}
			}
		}
		else this.up_key_flag = false;

		this.tick++;

		},500);
	}


}
