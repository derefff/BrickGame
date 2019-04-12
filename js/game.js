class Game{
	constructor(ctx,W,H)
	{
		this.ctx = ctx;
		this.WIDTH = W;
		this.HEIGHT = H;
		this.board = new Board();
		this.tetromino = new Element(this.board.cell_width/2-2,0,20);

		this.up_key_flag = false;
		this.tick = 0;
		this.MAX_TICK = 20;	
		this.stop_playing = false;
	}
	is_playing()
	{
		return this.stop_playing;
	}

	render(ctx)
	{
		//drawing background
		ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
		ctx.fillStyle='#5b6856';
		ctx.strokeStyle = 'black';
		ctx.fillRect(0,0, this.WIDTH, this.HEIGHT);

	
		//drawing other things
		this.board.render(ctx);
		this.tetromino.draw(ctx);

		ctx.beginPath();
		ctx.strokeStyle= 'white';
		ctx.moveTo(201,0);
		ctx.lineTo(201, 400);
		ctx.stroke();
		ctx.closePath();

	}

	update()
	{	
		//time delay
		setTimeout(()=>{

		if(this.tick == this.MAX_TICK)
		{
			this.tetromino.y += 1;
			if(this.tetromino.collide(this.board.current_board))
			{
			  this.tetromino.y -= 1;
				this.board.add_tetromino(this.tetromino);
				this.board.check_rows();
				this.tetromino.dead();
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
		
		//render function
		this.render(this.ctx);

		this.tick++;

		},500);
	}


}
