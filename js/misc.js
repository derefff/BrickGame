class Misc
{
//static class for a use 
	
 static create_matrix(w,h)
	{
		let temp = new Array(h);
		for(let i = 0; i < h; i++) temp[i] = new Array(w).fill(0);
		return temp;
	}

	static rotate_matrix(mx)
	{
		//assuming that this func will be useed for tetromino/rectange matrixes
		let temp = this.create_matrix(mx.length, mx.length);

		for(let i = 0; i < mx.length; i++)
			for(let j = 0; j < mx[i].length; j++)
				temp[j][i] = mx[i][j];

		temp.forEach(arr_item => arr_item.reverse());

		return temp;
	}

}
