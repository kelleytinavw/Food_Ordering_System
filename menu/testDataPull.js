var jcontent = {
    "fname":"kt",
    "lname":"will"
}

var output = document.getElementById('output');
output.innerHTML = 'new content';

output.innerHTML = jcontent.fname + ' ' jcontent.lname;