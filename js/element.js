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
		this.next_letter; // next shape
		this.set_new_shape();
		this.is_dead = false;
	}

//!REFECTOR
	get y(){return this._y}
	get x(){return this._x}
	get current_shape() {return this.data}
	get next_shape(){return this.peaces[this.next_letter]};

	set y(a){this._y = a}
	set x(a){this._x= a}
	set current_shape(new_data){this.data = new_data;}
	dead(){this.is_dead = true;}

	update_history()
	{
		/* the history (of last 4 peaces) begins with a Z,Z,S,S,
			first piece overwrites the first Z */
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

		this.current_shape = this.peaces[this.letters[rand]];
		this.current_letter =this.letters[rand];
	}


	rotate()
	{
		let temp = this.current_shape;
		this.current_shape = Misc.rotate_matrix(this.current_shape);
	}

	//baord.data
	collide(board_data) 
	{
		let al=this.current_shape.length;

		for(let i = 0; i < al; i++)
			for(let j = 0; j < al; j++)
				if(this.current_shape[i][j] && (board_data[this.y + i] && board_data[this.y +i][this.x+j]) !==0) 
					return true;

		return false;
	}

	draw(ctx) 
	{ 
		Misc.draw_matrix(ctx,this.current_shape,this.width, this.x, this.y);
	}

}
