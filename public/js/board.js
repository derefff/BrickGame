class Board
{
	constructor(b_size,cx=0,cy=0)
	{
		this.x = cx;
		this.y = cy;

		this.block_size = b_size;
		this.cell_height = 20;
		this.cell_width = 10;
		this.data = Misc.create_matrix(this.cell_width, this.cell_height);
	}

	get current_board(){return this.data};

	add_tetromino(tetromino)
	{
		//tetromino data
		let t_data = tetromino.current_shape;

		for(let i = 0; i<t_data.length; i++)
			for(let j = 0; j<t_data[i].length; j++)
				if(t_data[i][j]!==0) 
					this.current_board[tetromino.y+i][tetromino.x+j] = 1;
	}

	check_rows()
	{
		check: for(let i = this.data.length-1; i > 0; i--)
		{
			for(let j = 0; j< this.data[i].length; j++)
				if(this.data[i][j] === 0) 
					continue check;

			this.current_board.splice(i,1);
			this.current_board.unshift([0,0,0,0,0,0,0,0,0,0]);
			++i;
		}
	}

	render(ctx)
	{
		//white stripes 
		/*
		for(let j = 0; j < this.cell_height; j++)
		{
			ctx.beginPath();
			ctx.strokeStyle = 'white';	
			ctx.moveTo(0, this.block_size*j);
			ctx.lineTo(this.cell_width*this.block_size,this.block_size*j);
			if(j < this.cell_width)
			{
			ctx.moveTo(this.block_size*j,0);
			ctx.lineTo(this.block_size*j,this.block_size*this.cell_height);
			}	
			ctx.stroke();
			ctx.closePath();
		}*/
		
		Misc.draw_matrix(ctx,this.current_board,this.block_size,0,0,this.x,this.y);
	}

}