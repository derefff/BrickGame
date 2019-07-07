const socket = io.connect();

/* const btn = document.querySelector('#create-room');
btn.addEventListener('click', ()=>{
	socket.emit('send_id', socket.id);
}) */

socket.on('connect',()=>{
	socket.emit('joined_lobby');
	socket.on('update_rooms', data => {
			display_rooms(data);	
		});
});

function change_site(id)
{
	location = '/game?id='+id;
}

function display_rooms(room_arr){
	const el = document.querySelector("#rooms");
	el.innerHTML = "";
	for(let room of room_arr)
	{
		let current_room = `room ${room.id} 
		where ${room.players.length} / ${room.max_players} players 
		[${room.state}]`;
		
		// console.log(room);
		if(room.players.length < room.max_players || room.current_state !== "currently playing")  
			current_room+=` <input type="button" name="btn" value="join" onclick="change_site('${room.id}')"> <br>`;

		el.innerHTML+= current_room;
	}
	console.log("displayed rooms");

}
