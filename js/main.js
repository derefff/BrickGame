window.onload = () =>
{
	console.info("canvas loaded: game started");

	const canvas = document.getElementById('c');
	const ctx = canvas.getContext('2d');
	const WIDTH = c.width, HEIGHT = c.height;

	const game = new Game(ctx, WIDTH, HEIGHT);
	let playing = false;

	function game_loop(){
		if(!playing)
		{
			game.update();
			playing = game.is_playing();
		}
	}

	setInterval(game_loop, 1000/30);

}
