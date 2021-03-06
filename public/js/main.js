const socket = io.connect();
let run = false;
window.addEventListener('DOMContentLoaded', ()=>{run = true;});
socket.on('connect', ()=>{
	socket.on('gtfo', ()=> {window.location = '/?gtfo=♥'});
	socket.emit('joined_game');

	window.addEventListener('resize', resize_canvas);

	if(run) content();

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
		let trigger_once;

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
			ctx.fillText(`${fps.toFixed(0)} fps`, 5, HEIGHT - 10);
			ctx.closePath();
		}

		function game_loop(){
			
			socket.on('end_game', ()=> {
				window.location = '/?game_is_over';
			});

			if(!init)
			{
				//query value
				const usp = new URLSearchParams(window.location.search).get("id");
				_room="room"+usp;
				//sending id/room name to the server
				let data = { 
					id: socket.id, 
					room: 'room'+usp
				}
				socket.emit('init', data);
				socket.on('get_room_state', data =>
				{
					for(const s in game.states)
						if(data == game.states[s])
							game.state_index = s;
						
					game.update_state();
				})

				console.log(data.room);
				game.id = socket.id;
				init = true;
			}

			if(!playing)
			{	
				if(socket.disconnected) playing = true;
				if(game.state == "waiting for players")
				{
					trigger_once = true;
				}
			

				if(game.state == "currently playing")
				{
					if(game.countdown == 0) 
					{
						if(!trigger_once) 
						{
							game.make_harder();
							trigger_once = true;
						}
					}
					else 
					{
						game.update();
						trigger_once = false;
					}
				}

				playing = game.is_playing();
			}
			
			if(init)
			{
				if(playing) socket.emit("get_player_place", _room)
				game.render();
				
				if(game.state  == "currently playing") 
				{
					let	data = {
						id: socket.id,
						alive: playing,
						room: _room,
						board: game.send_data() };

					socket.emit('update', data);
				}
				socket.on('countdown', data =>{
					game.countdown = data.countdown;

					for(const s in game.states)
						if(data.state == game.states[s])
							game.state_index = s;
						
					game.update_state();
				});

				socket.on('player_list', pl =>{
					game.other_players = pl;	
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

	function resize_canvas()
	{
		let canvas = document.getElementById('c');
		if(canvas)
		{
			canvas.style.height = (window.innerHeight-10)+'px';
			canvas.style.width = 'auto';
			console.log("resize");
		}
	}
});
