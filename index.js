const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app); 
const io = require('socket.io')(server);

const port = 3000;

server.listen(port, ()=> console.log(`server listening on ${port}`));

const players = [];

let timer = 60;

app.use(express.static('public'));

app.get('/', (req,res) =>
	{
		res.sendFile(__dirname+"/index.html");

	});

app.get('/game', (req,res) =>
	{
		res.send(`game request on ${req.query.id} this will be working in the future`);
	});

io.on('connection', socket =>{
	console.log(`user ${socket.id} has connected`);

	socket.on('init', data=>{
		players.push(
			{ id:socket.id,
				alive:null,
				board:null
			}); 

		let index = players.findIndex(element => element.id == data.id);
		let current_player = players[index];
//		console.log(`init ${index}, ${players[index]}`);
//		current_player.arr_index = index;

		current_player.alive = false;

		console.info(`init`);

	});

	socket.on('update', data =>{
		let room ="";
			
		for(let i =0; i < players.length; i++)
		{
			if(players[i].id == data.id) 
				{
					players[i].board = data.board;
					players[i].alive = data.alive;
				}
			//dodac room playera
		}

		io.sockets.emit('player_list', players);
	});

	socket.on('disconnect',()=>{
		console.log(`user ${socket.id} has disconnected`);

		// for(let i in players)
		// 	if(players[i].id = socket.id) players.splice(i,1); 

	});
	//console.log(players);
});

