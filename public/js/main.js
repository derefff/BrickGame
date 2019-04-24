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

	function game_loop(){
		if(!init)
		{
			let data = { id: socket.id }
			socket.emit('init', data);
			init = true;
		}

		if(!playing)
		{
			game.update();
			playing = game.is_playing();
			
			let	data = {
				id: socket.id,
				is_alive: playing,
				board: game.send_data()
			}

			socket.emit('update', data);
		}
	}

	setInterval(game_loop, 1000/30);

}
