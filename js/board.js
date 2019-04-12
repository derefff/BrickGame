class Board
{
	constructor()
	{
		this.block_size = 20;
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
			i++;
		}
	}

	render(ctx)
	{
		//white stripes 
		/*for(let i = 0; i < this.cell_width; i++)
		{
			ctx.beginPath();
			ctx.strokeStyle = 'white';	
			ctx.moveTo(this.block_size*i,0);
			ctx.lineTo(this.block_size*i,this.block_size*this.cell_height);
			ctx.stroke();
			ctx.closePath();
		}

		for(let j = 0; j < this.cell_height; j++)
		{
			ctx.beginPath();
			ctx.strokeStyle = 'white';	
			ctx.moveTo(0, this.block_size*j);
			ctx.lineTo(this.cell_width*this.block_size,this.block_size*j);
			ctx.stroke();
			ctx.closePath();
		}
		*/
		this.current_board.forEach((elem,y) =>{
			elem.forEach((sub_elem,x)=>
			{
				if(sub_elem == 1)
				{
					ctx.beginPath();
					ctx.fillStyle = "green";
					ctx.fillRect(x*20+1, y*20+1,19,19);	
					ctx.closePath();
				}
			});
		});

	
	}

}
