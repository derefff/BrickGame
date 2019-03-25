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
		this.last_data;
		//throw out ^this and replace it with history array
		//this.history=['Z','Z','S','S'];
		this.next_data;
		this.set_new_shape();
		this.is_dead = false;
	}

//!REFECTOR
	get y(){return this._y}
	get x(){return this._x}
	get rotation(){return this._r}
	get current_shape() {return this.data}

	set y(a){this._y = a}
	set x(a){this._x= a}
	//set is_dead(a){this.is_dead = a}
	set rotation(a){this._r=a}

	dead()
	{
		this.is_dead = true;;
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

		//this.last_data = this.data;
		this.data = this.peaces[this.letters[rand_letter]];
	}


	rotate()
	{
		//!REFACTOR 
		let temp = (this.data.length == 4)?[[0,0,0,0],[0,0,0,0],
		[0,0,0,0],[0,0,0,0]] : [[0,0,0],[0,0,0],[0,0,0]];

		for(let i = 0; i < this.data.length; i++)
			for(let j =0; j<this.data[i].length; j++)
				temp[j][i] = this.data[i][j];

		temp.forEach(arr_item =>{arr_item.reverse()});

		this.data = temp;
 		//console.table(temp);
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
			{
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

}