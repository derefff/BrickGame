const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app); 
const io = require('socket.io')(server);

server.listen(3000, ()=> console.log("server listening"));

const players = [];
app.use(express.static('public'));

app.get('/', (req,res) =>
	{
		res.sendFile(__dirname+"/index.html");
	});

//io.on('update', data =>console.log(data));

io.on('connection', socket =>{
	console.log(`user ${socket.id} has connected`);

	socket.on('init', data=>{
//		console.dir(`${data}`);
		players.push(
			{ id:socket.id,
	//			arr_index:null,
				is_alive:null,
				board:null
			}); 

		let index = players.findIndex(element => element.id == data.id);
		let current_player = players[index];
//		console.log(`init ${index}, ${players[index]}`);
//		current_player.arr_index = index;
		current_player.is_alive = false;

		socket.emit('init', index); 
		console.info(`init`);

	});

	socket.on('update', data =>{
		let index = players.findIndex(element => element.id == data.id);
		players[index].is_alive = data.is_alive;
		players[index].board = data.board;
		//wysylawnie listy graczy
		socket.emit('player_list', players);

	});


	socket.on('disconnect',()=>{
		console.log(`user ${socket.id} has disconnected`);

		for(let i in players)
			if(players[i].id = socket.id) players.splice(i,1); 

	});
	//console.log(players);
});

