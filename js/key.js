let key ={};

const KEY_CODE = {
	37:'left',
	39:'right',
	40:'down',
	38:'up',
	//wsad
	65:'left',
	68:'right',
	83:'down',
	87:'up'
};

const key_down = function(e){
	let code = KEY_CODE[e.keyCode];
	key[code] = true;
}

const key_up = function(e){
	let code = KEY_CODE[e.keyCode];
	key[code] = false;
}

window.addEventListener('keydown', key_down);
window.addEventListener('keyup', key_up);