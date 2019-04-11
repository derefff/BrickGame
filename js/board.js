class Board
{
	constructor()
	{
		this.block_size = 20;
		this.cell_height = 20;
		this.cell_width = 10;
		this.data = Misc.create_matrix(this.cell_width, this.cell_height);
	}

	get board_data(){return this.data};

	add_tetromino(tetromino)
	{
		let t_data = tetromino.current_shape;

		for(let i = 0; i<t_data.length; i++)
			for(let j = 0; j<t_data[i].length; j++)
				if(t_data[i][j]!==0) 
					this.data[tetromino.y+i][tetromino.x+j] = 1;
	}

	check_rows()
	{
		check: for(let i = this.data.length-1; i > 0; i--)
		{
			for(let j = 0; j< this.data[i].length; j++)
				if(this.data[i][j] === 0) 
					continue check;

			this.data.splice(i,1);
			this.data.unshift([0,0,0,0,0,0,0,0,0,0]);
		}
	}

	render(ctx)
	{
		//white stripes 
		for(let i = 0; i < this.cell_width; i++)
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

		this.data.forEach((elem,y) =>{
			elem.forEach((sub_elem,x)=>
			{
				if(sub_elem == 1)
				{
					ctx.beginPath();
					ctx.fillStyle = "green";
					ctx.fillRect(x*20, y*20,20,20);	
					ctx.closePath();
				}
			});
		});

	
	}

}
