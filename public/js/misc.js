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

	//note here that x and y are like 1,2..
	//then to get thier true x/y i multply by block_size
	static draw_matrix(ctx,mx,w=20,x=0,y=0,ofX=0,ofY=0, g=3) //g stands for gaps 
	{
		for(let i = 0; i < mx.length; i++)
			for(let j = 0; j < mx[i].length; j++)
			{
				if(!mx[i][j]) continue;
				ctx.beginPath();
				if(mx[i][j] === 1) 
				{
					ctx.strokeStyle = "black";
					ctx.fillStyle = "black";
					ctx.strokeRect((x*w)+(j*w)+g+ofX, (y*w)+(i*w)+g+ofY,w-g,w-g);
					ctx.fillRect((x*w)+(j*w)+g+ofX+(w/4),(y*w)+(i*w)+g+ofY+(w/4),w*0.35,w*0.35);
				}

				if(mx[i][j] === 2) 
				{
					ctx.strokeStyle = "black";
					ctx.strokeRect((x*w)+(j*w)+g+ofX, (y*w)+(i*w)+g+ofY,w-g,w-g);
					ctx.moveTo((x*w)+(j*w)+2*g+ofX, (y*w)+(i*w)+2*g+ofY);
					ctx.lineTo((x*w)+(j*w)+ofX+w-g,(y*w)+(i*w)+ofY+w-g);
					ctx.stroke();
				}
				//ctx.fillRect((x*w)+(j*w)+g+ofX, (y*w)+(i*w)+g+ofY,w-g,w-g);
				ctx.closePath();
			}
	}


}
