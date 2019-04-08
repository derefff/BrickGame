class Element{
	/*	I: [1,1,1,1],
	J: [1,1,1,0,0,0,1],
	L: [1,1,1,0,1],
	O: [1,1,0,0,1,1],
	S: [0,1,1,0,1,1],
	T: [1,1,1,0,0,1],
	Z: [1,1,0,0,0,1,1]
*/	
	constructor(x,y,w)
	{
		this.width = w;
		this._x = x;
		this._y = y;
		this._r = 0;
		this.letters = ['I','J','L','O','S','Z','T'];
		this.peaces = {
			I:[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
			J:[[1,0,0],[1,1,1],[0,0,0]],
			L:[[0,0,0],[1,1,1],[0,0,1]],
			O:[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
			S:[[0,1,1],[1,1,0],[0,0,0]],
			Z:[[1,1,0],[0,1,1],[0,0,0]],
			T:[[0,1,0],[1,1,1],[0,0,0]]};
		this.data;
		this.history=['Z','Z','S','S'];
		this.next_data;
		this.set_new_shape();
		this.min = this.check_min();
		this.max = this.check_max();
		this.h_max = this.check_h_max();
		this.is_dead = false;
	}

//!REFECTOR
	get y(){return this._y}
	get x(){return this._x}
	get rotation(){return this._r}
	get current_shape() {return this.data}

	set y(a){this._y = a}
	set x(a){this._x= a}
	set rotation(a){this._r=a}

	dead(){this.is_dead = true;}

	check_min()
	{
		let temp;

		for(let i = 0; i < this.data.length; i++)
			for(let j = 0; j < this.data.length; j++)
				if(temp == undefined && this.data[j][i] == 1)
				{
					temp =i;
					break;
				}

		return temp;
	}

	check_max()
	{
		let temp;

		for(let i = this.data.length -1; i > 0; i--)
			for(let j = 0; j < this.data.length; j++)
				if(temp == undefined && this.data[j][i] == 1)
				{
					temp =i;
					break;
				}

			
		 return temp;
	}

	check_h_max()
	{
		let temp;

		for(let i = this.data.length -1; i > 0; i--)
			for(let j = 0; j < this.data.length; j++)
				if(this.data[i][j] == 1 && !temp)
					temp=i+1;
			
		 return temp;
	}

//!IMPORTANT add rotation parameter or other solution needed
	set_new_shape()
	{
		/*
			historia 4 ostatnich figur
			the history begins with a Z,Z,S,S sequence.
			as the first piece overwrites the first Z rather than 
			pushing off the last S, 
			this is effectively a Z,S,S,Z or Z,S,Z,S sequence.
		*/
		let rand_letter = Math.floor(Math.random()*7);

		//while(this.last_data == this.peaces[this.letters[rand_letter]])
				//rand_letter = Math.floor(Math.random()*7);

		this.data = this.peaces[this.letters[rand_letter]];
	}


	rotate()
	{
		let temp = this.data;
		this.data = Misc.rotate_matrix(this.data);
		if(this.x<0) this.data = temp;
		//if something is wrong with tetromino and right boundry of the board
		//this line is for this responsible
		if(this.x+this.check_max()>9) this.data = temp;

		this.min =this.check_min();
		this.max =this.check_max();
		this.h_max =this.check_h_max();
	}

	//baord.data
	colide(board)
	{
			let arr_len = this.data.length;
			for(let i = 0; i < arr_len; i++)
				for(let j = 0; j < arr_len; j++)
				{
					//this.data[i + 1][j];
					/*
						<- j->
						_____
						l l l gora dol i 
						------
					*/
					if(this.y+i > 19) return true;

						if(board[this.y+i][this.x+j] == 1)
							{
								return true;
							}
							return false;

				}

			return false;
	}
	
	draw(ctx)
	{
		for(let i = 0; i < this.data.length; i++)	
			for(let j = 0; j< this.data[i].length; j++)
				if(this.data[j][i] == 1)
				{
					//!REFACTOR matrix draw function
					ctx.beginPath()
					ctx.fillStyle = "green";
					ctx.fillRect(
						(this.x*this.width)+(this.width*i),
						(this.y*this.width)+(this.width*j),
						this.width,
						this.width);				
					ctx.closePath();
				}
		
	}

}
