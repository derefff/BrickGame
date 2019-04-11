class Game{
	constructor(ctx,W,H)
	{
		this.ctx = ctx;
		this.WIDTH = W;
		this.HEIGHT = H;
		this.board = new Board();
		this.tetromino = new Element(this.board.cell_width/2-2,0,20);

		this.up_key_flag = false;
		this.tick=0;
	}

	render(ctx)
	{
		//drawing background
		ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
		ctx.fillStyle='gray';
		ctx.strokeStyle = 'black';
		ctx.fillRect(0,0, this.WIDTH, this.HEIGHT);
	
		//drawing other things
		this.board.render(ctx);
		this.tetromino.draw(ctx);

	}

	update()
	{	
		//time delay
		setTimeout(()=>{

		//!REFACTOR better time thingy
		if(this.tick == 20)
		{
			this.tetromino.y = this.tetromino.y +1;
			if(this.tetromino.collide(this.board.board_data))
			{
			  this.tetromino.y--;
				this.board.add_tetromino(this.tetromino);
				this.board.check_rows();
				this.tetromino.dead();
			}
			this.tick = 0;
		}

		//!REFACTOR temporary thing 
		if(this.tetromino.is_dead)
		{
			this.tetromino.is_dead = false;
			this.tetromino.set_new_shape();
			this.tetromino.y = 0;
			this.tetromino.x = this.board.cell_width/2-2;
			if(this.tetromino.collide(this.board.board_data))
				console.log("the game is over");

		}
			
		//Response for keys
		//also checking boundiers
		if(key.left) 
			{
				this.tetromino.x = this.tetromino.x-1;
				if(this.tetromino.collide(this.board.board_data))
					this.tetromino.x +=1;
			}

		if(key.right) 
			{
				this.tetromino.x = this.tetromino.x+1;
				if(this.tetromino.collide(this.board.board_data))
					this.tetromino.x -=1;
			}

		if(key.up) 
		{
			if(!this.up_key_flag)
			{
				this.up_key_flag = true;
				this.tetromino.rotate();
			}
		}
		else this.up_key_flag = false;
		
		//render function
		this.render(this.ctx);
		this.tick++;

		},500);
	}


}
