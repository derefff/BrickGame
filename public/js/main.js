window.onload = () =>
{
	console.info("canvas loaded: game started");
	const socket = io.connect();

	/*---------------------*/
	const canvas = document.getElementById('c');
	const ctx = canvas.getContext('2d');
	const WIDTH = c.width, HEIGHT = c.height;

	const game = new Game(ctx, WIDTH, HEIGHT);
	let playing = false;
	let init = false;
	let tok;

	function game_loop(){

		socket.on('connect', ()=>{
			if(!init)
			{
				console.log(socket.connected);
				let data = { id: socket.id }

				socket.emit('init', data);
				//to jest lewe ;-:
				socket.on('init', data=>{
					tok = data;
				});

				game.id = socket.id;
				init = true;
			}
		});

		if(!playing)
		{
			game.update();
			playing = game.is_playing();
			
			let	data = {
				id: socket.id,
				//arr_index: tok,
				is_alive: playing,
				board: game.send_data()}

			if(init)
			{
				socket.emit('update', data);
				socket.on('player_list', pl =>{
				let index = pl.findIndex(element => element.id == socket.id);
				game.other_players = pl;	
//					console.log(game.other_players);	
			//	game.other_players.splice(index,1);
					
				});
			}
		}
	}

	setInterval(game_loop, 1000/30);

}
