const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const room = require('./lib/room');
const id_maker = require('./lib/id_maker');

const port = process.env.PORT || 3000;

server.listen(port, ()=> console.log(`server listening on ${port}`));

const players = [];
const rooms = [];

app.use(express.static('public'));

app.get('/', (req,res) =>
	{
		res.sendFile(__dirname+"/index.html");
	});

app.get('/make', (req,res) =>
	{
		//hash 
		let new_id = id_maker.make_id();
		for(const r in rooms)
		{
			if(r.id === new_id) 
			{
				while(r.id === new_id)
				{
					new_id = id_maker.make_id();
				}
			}
		}

		let room_name = 'room'+new_id;
		let room_obj = new room(new_id, room_name, req.query.max);

		rooms.push(room_obj);
		res.redirect('/game?id='+rooms[rooms.length-1].id);

	});

app.get('/game', (req,res) =>
	{
		res.sendFile(__dirname+"/public/game.html");
	});

io.on('connection', socket =>{
	console.log(`user ${socket.id} has connected`);

	socket.on('joined_lobby', ()=>
	{
		//naprawic to
		socket.join('lobby', ()=>{
			io.sockets.emit('update_rooms', rooms);
			console.log('joined lobby');
		});
	});

	socket.on('joined_game', ()=>
	{
		socket.join('game');
		console.log('joined game');
		socket.in('lobby').emit('update_rooms', rooms);
	});

	socket.in('game').on('init', data => {
		for(let i = 0;  i < rooms.length; i++)
			if(rooms[i].name == data.room)
			{
				if(!rooms[i].is_maxed_out())
				{
					rooms[i].players.push(
						{ id:socket.id,
							room: data.room,
							alive:null,
							board:null
						});

					// console.log(data.room, rooms[i].players.room);
					socket.in('game').join(rooms[i].name);
					//socket.in('lobby').emit('update_rooms', rooms);
					console.info('init');
				}
				else
				{
					socket.emit('gtfo');
				}

			}
			
			socket.in('lobby').emit('update_rooms', rooms);
		
	});

	socket.in('game').on('update', data => {
		let room_name = data.room;
		let index=0;
		for(let i =0; i < rooms.length; i++)
			if(rooms[i].name == room_name)
			{
				index = i;
				for(let j = 0; j <rooms[i].players.length; j++)
					if(rooms[i].players[j].id == data.id)
					{
						rooms[i].players[j].board = data.board;
						rooms[i].players[j].alive = data.alive;
					}

			}

		socket.to(room_name).emit('player_list', rooms[index].players);

	});

	socket.on('disconnect',()=>{
		console.log(`user ${socket.id} has disconnected`);
		socket.leaveAll();
		//leaving depends on the current state of a game
		//set data of this player to "game over"

	});
});


function update_room_timer(){
	for(let room of rooms)
	{
		room.update_countdown();
		room.tick();
		io.to(room.name).emit("countdown", room.game_countdown);
		if(room.flag_update_state)
		{
			io.to("lobby").emit('update_rooms', rooms);
			room.flag_update_state = false;
		}
	}
}
setInterval(update_room_timer,1000);
