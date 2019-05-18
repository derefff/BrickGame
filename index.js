const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app); 
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;
//socket namespaces

const lobby = io.of();
const game = io.of('/game'); 

//TODO
//socket.join();
//
//

server.listen(port, ()=> console.log(`server listening on ${port}`));

const players = [];
const rooms = [];

let timer = 60;

app.use(express.static('public'));

app.get('/', (req,res) =>
	{
		res.sendFile(__dirname+"/index.html");

	});

app.get('/make', (req,res) =>
	{
		/* rozkminic dzilanie socketu
		 * value w req sa zalezne od name pola
		 * */

		let room_obj = {
			id: rooms.length,
			name: 'room'+rooms.length,
			max_players: req.query.max,
			players: []
		}

//		console.log(req);

		//console.log(room_obj.max_players, room_obj.name);
		rooms.push(room_obj);
		res.redirect('/game?id='+rooms[rooms.length-1].id);
		
	});

app.get('/game', (req,res) =>
	{
		//res.send(`game request on ${req.query.id} this will be working in the future`);
		res.sendFile(__dirname+"/public/game.html");
	});

io.on('connection', socket =>{
	console.log(`user ${socket.id} has connected`);

	socket.on('init', data=>{
		
		for(let i = 0;  i < rooms.length; i++)
		{
			if(rooms[i].name == data.room) 
			{
				rooms[i].players.push(
					{ id:socket.id,
						room: data.room,
						alive:null,
						board:null
					}); 
			}
		}


		//let index = players.findIndex(element => element.id == data.id);
		//let current_player = players[index];
//		console.log(`init ${index}, ${players[index]}`);
//		current_player.arr_index = index;

		//current_player.alive = false;

		console.info(`init`);
			
	});

	socket.on('update', data =>{
		let room_name =data.room;
		let index=0;	
		for(let i =0; i < rooms.length; i++)
		{
			if(rooms[i].name == room_name)
			{
				index = i;
				for(let j = 0; j <rooms[i].players.length; j++)
				{
					if(rooms[i].players[j].id == data.id)
					{
						rooms[i].players[j].board = data.board;
						rooms[i].players[j].alive = data.alive;
					}
				}
			}

			
			//dodac room playera
		}



		io.sockets.emit('player_list', rooms[index].players);
	});

	socket.on('disconnect',()=>{
		console.log(`user ${socket.id} has disconnected`);

	});
});

