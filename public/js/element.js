class Element
{
	constructor(x,y,w,ofX=0,ofY=0)
	{
		this.width = w;
		this._x = x;
		this._y = y;
		this.offsetX = ofX;
		this.offsetY = ofY;
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
		this.next_letter = this.get_random_letter(); // next shape
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

	get_random_letter()
	{
		let rand; 
		let res = true;

		while(res)
		{
			rand =  Math.floor(Math.random()*7);
			res = false

			//!REFACTOR this.next... == ths.let is prabably unecessery
			for (let letter of this.history)
				if(letter === this.letters[rand] || this.current_letter === this.letters[rand] || this.next_letter === this.letters[rand] ) res = true;
		}
		return this.letters[rand]; 
	}

	set_new_shape()
	{
		this.update_history();
		this.current_shape = this.peaces[this.next_letter]; 
		this.current_letter = this.next_letter;
		this.next_letter = this.get_random_letter();
	}


	rotate()
	{
		this.current_shape = Misc.rotate_matrix(this.current_shape);
	}

	//baord.data
	collide(board_data) 
	{
		let al=this.current_shape.length;

		for(let i = 0; i < al; i++)
			for(let j = 0; j < al; j++)
				if(this.current_shape[i][j] &&
					 (board_data[this.y + i] && board_data[this.y +i][this.x+j]) !== 0 
					 && board_data[this.y + i] !== 2) 
					return true;

		return false;
	}

	draw(ctx) 
	{ 
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'black';
		Misc.draw_matrix(ctx,this.current_shape,this.width,this.x,this.y,this.offsetX,this.offsetY);
	}

	go_one_up()
	{
		if(this.y != 0) this.y-=2;
	}

}
