window.onload = () =>
{
	console.info("canvas loaded: game started");
	let socket = io.connect();

	/*---------------------*/
	const canvas = document.getElementById('c');
	const ctx = canvas.getContext('2d');
	const WIDTH = c.width, HEIGHT = c.height;

	const game = new Game(ctx, WIDTH, HEIGHT);
	let playing = false;
	let init = false;
	var tok;

	function game_loop(){

		socket.on('connect', ()=>{
			if(!init)
			{
				console.log(socket.connected);
				let data = { id: socket.id }
				socket.emit('init', data);
				socket.on('init', data=>{
					tok = data;
				});
				init = true;
			}
		});

		if(!playing)
		{
			game.update();
			playing = game.is_playing();
			
			let	data = {
				id: socket.id,
				arr_index: tok,
				is_alive: playing,
				board: game.send_data()}

			if(init)
			{
				socket.emit('update', data);
				socket.on('player_list', pl =>{
				game.other_players = pl;	
				});
			}
		}
	}

	setInterval(game_loop, 1000/30);

}
