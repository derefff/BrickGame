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
			I:[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
			J:[[1,0,0],[1,1,1],[0,0,0]],
			L:[[0,0,0],[1,1,1],[1,0,0]],
			O:[[1,1],[1,1]],
			S:[[0,1,1],[1,1,0],[0,0,0]],
			Z:[[1,1,0],[0,1,1],[0,0,0]],
			T:[[0,1,0],[1,1,1],[0,0,0]]};
		this.data;
		this.history=['Z','Z','S','S'];
		this.current_letter;
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
	set rotation(a){this._r=a}

	dead(){this.is_dead = true;}
	update_history()
	{
		/* historia 4 ostatnich figur
			the history begins with a Z,Z,S,S sequence.
			as the first piece overwrites the first Z rather than 
			pushing off the last S, 
		*/
		if(this.current_letter)
		{
			this.history.pop();
			this.history.unshift(this.current_letter);
		}
	}

	set_new_shape()
	{
		this.update_history();

		let rand; 
		let res = true;
		while(res)
		{
			rand =  Math.floor(Math.random()*7);
			res = false

			for (let letter of this.history)
				if(letter === this.letters[rand]) res = true;
		}

		this.data = this.peaces[this.letters[rand]];
		this.current_letter =this.letters[rand];
	}


	rotate()
	{
		let temp = this.data;
		this.data = Misc.rotate_matrix(this.data);
		if(this.x<0) this.data = temp;
}

	//baord.data
	collide(board) 
	{
		let al=this.data.length;

		for(let i = 0; i < al; i++)
			for(let j = 0; j < al; j++)
				if(this.data[i][j] && (board[this.y + i] && board[this.y +i][this.x+j]) !==0) 
					return true;

		return false;
	}

	draw(ctx) 
	{ 
		for(let i = 0; i < this.data.length; i++)	
			for(let j = 0; j< this.data[i].length; j++) 
				if(this.data[j][i] == 1) { 
					//!REFACTOR matrix draw function 
					ctx.beginPath();
					ctx.fillStyle = "green";
					ctx.fillRect( (this.x*this.width)+(this.width*i), (this.y*this.width)+(this.width*j), this.width, this.width);
					ctx.closePath();
				}
	}

}
