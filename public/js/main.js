const socket = io.connect();
socket.on('connect', ()=>{
	socket.on('gtfo', ()=> {window.location = '/?gtfo=♥'});
	socket.emit('joined_game');
	window.onload = content;
	
	function content()
	{
		console.info("canvas loaded: game started");
		console.info(socket.id);
		/*---------------------*/
		const canvas = document.getElementById('c');
		const fps_div = document.querySelector('#fps');
		const time_div = document.querySelector('#timer');
		const ctx = canvas.getContext('2d');
		const WIDTH = c.width, HEIGHT = c.height;

		const game = new Game(ctx, WIDTH, HEIGHT);
		let playing = false;
		let init = false;
		let _room="";
		let room_countdown=0;

		//stolen code from stack overflow
		let last_loop = Date.now();
		let this_loop;
		let frame_time = 0;
		let filter_str = 20;
		let fps;

		function game_loop(){
			if(!init)
			{
				// console.log(socket.connected);
				//query value
				const usp = new URLSearchParams(window.location.search).get("id");
				console.log(typeof(usp))
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
				game.update();
				playing = game.is_playing();
			}

			
			if(init)
			{
				game.render(ctx);

				let	data = {
					id: socket.id,
					alive: playing,
					room: _room,
					board: game.send_data() };

				socket.emit('update', data);
				socket.on('countdown', time=>{
					room_countdown = time;
				});

				socket.on('player_list', pl =>{
				let index = pl.findIndex(element => element.id == socket.id);
				game.other_players = pl;	
				// console.log(pl);
				// console.log(game.other_players);	
				//game.other_players.splice(index,1);
				
					game.render_other_players(ctx);
				});
			}

			this_loop = Date.now();
			let this_frame_time = this_loop - last_loop;
			frame_time+= (this_frame_time - frame_time)/filter_str;
			fps = 1000/(frame_time);
			last_loop = this_loop;
			
			// console.log(this_frame_time);
			// setTimeout(game_loop, frame_time);
			
		}

		setInterval(game_loop, 1000/30);
		// game_loop();

		//displaying fps counter on the bototm
		setInterval(()=>{
				fps_div.innerHTML = fps.toFixed(1);
				time_div.innerHTML = room_countdown;

		},1000);

	};
});
