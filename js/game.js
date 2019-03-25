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
			if(this.tetromino.y+2<20)
				this.tetromino.y = this.tetromino.y +1;
			this.tick = 0;
		}
		// console.log(this.tetromino.is_dead);
		
		if(this.tetromino.is_dead)
		{
			this.tetromino.is_dead = false;
			this.tetromino.set_new_shape();
			this.tetromino.y = 0;
		}
		if(this.tetromino.colide(this.board.board_data))
		{
			this.board.add_tetromino(this.tetromino);
			this.tetromino.dead();
		}
		//Response for keys
		if(key.left && this.tetromino.x > 0) 
			this.tetromino.x = this.tetromino.x-1;

		if(key.right && this.tetromino.x+4 < 10) 
			this.tetromino.x= this.tetromino.x+1;

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