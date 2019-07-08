const socket = io.connect();
socket.on('connect', ()=>{
	socket.on('gtfo', ()=> {window.location = '/?gtfo=♥'});
	socket.emit('joined_game');
	window.addEventListener('load', content)
	
	function content()
	{
		console.info("canvas loaded: game started");
		console.info(socket.id);
		/*---------------------*/
		const canvas = document.getElementById('c');
		canvas.style.height = (window.innerHeight-10)+'px';
		canvas.style.width = "auto";
		const ctx = canvas.getContext('2d');
		const WIDTH = c.width, HEIGHT = c.height;

		const game = new Game(ctx, WIDTH, HEIGHT);
		let playing = false;
		let init = false;
		let _room="";

		//stolen code from stack overflow
		let last_loop = Date.now();
		let this_loop;
		let frame_time = 0;
		let filter_str = 20;
		let fps;
		
		function draw_fps()
		{
				ctx.beginPath();
				ctx.font = '1em Arial';
				ctx.fillStyle = 'black';
				ctx.fillText(`${fps.toFixed(1)} fps`, 5, HEIGHT - 10);
				ctx.closePath();
		}

		function game_loop(){
			

			if(!init)
			{
				// console.log(socket.connected);
				//query value
				const usp = new URLSearchParams(window.location.search).get("id");
				_room="room"+usp;
				//sending id/room name to the server
				let data = { 
					id: socket.id, 
					room: 'room'+usp
				}
				socket.emit('init', data);

				console.log(data.room);
				game.id = socket.id;
				init = true;
			}

			if(!playing)
			{	
				// socket.on("change_state", () =>{});
				if(game.state == "waiting for players")
				{
					if(game.countdown == 0) game.change_state();
				}
			

				if(game.state == "currently playing")
				{
					game.update();
				}

				playing = game.is_playing();
			}

			if(init)
			{
				game.render();
				
				let	data = {
					id: socket.id,
					alive: playing,
					room: _room,
					board: game.send_data() };

				socket.emit('update', data);
				socket.on('countdown', time=>{
					game.countdown = time;
				});

				socket.on('player_list', pl =>{
				let index = pl.findIndex(element => element.id == socket.id);
				game.other_players = pl;	
				//game.other_players.splice(index,1);
				});
			}

			this_loop = Date.now();
			let this_frame_time = this_loop - last_loop;
			frame_time+= (this_frame_time - frame_time)/filter_str;
			fps = 1000/(frame_time);
			last_loop = this_loop;
			draw_fps();
		}

		setInterval(game_loop, 1000/30);
	};
});
