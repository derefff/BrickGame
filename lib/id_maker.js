const hash = require('hash.js');

make_id =()=>{
  let id = Math.floor(Math.random()*100);

  for(let i = 0; i< Math.ceil(Math.random()*9)+1; i++)
  {
    id = hash.sha1().update(id).digest('hex');
    let start = Math.floor(Math.random()*id.length);
    if(start >= id.length - 4) start-=4
    id = id.substr(start,4);
  }

  return id.toUpperCase();
}

module.exports = {make_id};