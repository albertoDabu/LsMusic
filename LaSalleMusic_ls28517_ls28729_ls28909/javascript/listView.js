//***************************************INICIALIZACIONES*********************************
//tema reordenar la BBDD
window.onload = function () {
	//queremos reordenar el localStorage
	if (typeof(Storage) !== "undefined") {
		var aux;
		for (var i = 0; i < localStorage.length; i++) {
			//guardamos el valor
			aux = localStorage.getItem(localStorage.key(i));
			//reventamos la antigua clave
			localStorage.removeItem(localStorage.key(i));
			//incorporamos el nuevo {clave, valor}
			localStorage.setItem(i.toString(), aux);
		}
	}
}
window.location.href = "#!";
//tema de las templates, que no salgan
var aux_busqueda_template = document.getElementById("busquedaView-template");
var aux_favoritos_template = document.getElementById("favoritosView-template");
aux_busqueda_template.style.display = "none";
aux_favoritos_template.style.display = "none";

//tema del botón de favoritos, para que te lleve a los favoritos
$("#cielo").click(function () {
    $('html,body').animate({
        scrollTop: $("#favoritosView").offset().top -120
    }, 500);
});

//tema de los recomendados
function recomendados() {
	try {
		var xhr = new XMLHttpRequest();
		xhr.addEventListener("load", function () {
			try {
				var json = JSON.parse(this.responseText);
				var aux;
				for (var i = 0; i < json.tracks.track.length; i++) {
					aux = json.tracks.track[i];
					document.getElementById("hover"+i).getElementsByClassName("hover_img")[0].src = aux.image[3]["#text"];
					document.getElementById("hover"+i).getElementsByClassName("nombreArtista")[0].innerHTML = aux.artist.name;
					document.getElementById("hover"+i).getElementsByClassName("nombreCancion")[0].innerHTML = aux.name;
				}
			}catch (err) {
				console.log(err);
			}	
		});
		xhr.open("GET", "http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&limit=5&format=json&api_key=9d87d6c9c3e84d9e663fb108741bc07d");
		xhr.send();
		//capturamos la respuesta
		
	}catch (error) {
		console.log(error);
	}
}
recomendados();
//***************************************EMPIEZA LA LÓGICA**********************************
/*
irá por todos los botones play/pause-button y los pondrá en el estado inicial
*/
function callarTodos () {
	var objs = document.getElementsByClassName("play/pause-button");
	for (var i = 0; i < objs.length; i++) {
		if (objs[i].dataset.play === "1" || objs[i].dataset.play === "0") {
		  	objs[i].dataset.play = "-1";
		  	objs[i].className = "glyphicon glyphicon-play-circle play/pause-button";
	  	}
	};
}
document.getElementById("audioPlayer").addEventListener("ended", callarTodos);
var reproductor = {
	cargar: function (src) {
		var vid = document.getElementById("audioPlayer");
		vid.src = src;
		vid.load();
		vid.play();
	},
	play: function () {
		var vid = document.getElementById("audioPlayer");
		vid.play();
	},
	pause: function () {
		var vid = document.getElementById("audioPlayer");
		vid.pause(); 
	}
};
/*
tipo-> hoverView/listView/...
img->ruta de la imagen
nombreCancion, artista, album->no hace falta explicarlo
song->ruta de la cacnión
*/
function insertarElemento (tipo, img, nombreCancion, album, artista, song, qFavorito) {
	//hacemos visibles las plantillas
	aux_busqueda_template.style.display = "inline";
	aux_favoritos_template.style.display = "inline";
	//según el tipo de plantilla
	var template = document.getElementById(tipo+"-template");
	var nuevo = template.cloneNode(true);
	//la imagen
	var imagen = nuevo.getElementsByClassName("image-element")[0];//nuevo.childNodes[3];
	imagen.src = img;
	//nombre de canción, artista y álbum
	nuevo.getElementsByClassName("nombreCancion")[0].innerHTML = nombreCancion;
	nuevo.getElementsByClassName("nombreAlbum")[0].innerHTML = album;	
	nuevo.getElementsByClassName("nombreArtista")[0].innerHTML = artista;	
	//metemos los listeners
	var btn = nuevo.getElementsByClassName("play/pause-button")[0];
	btn.addEventListener("click", function cambiarPlay () {
		if (btn.dataset.play == "-1"){
			//-1->nunca se ha reproducido (el botón está el play)
			callarTodos();
			//no está cargado
			btn.dataset.play = "1";
			btn.className = "glyphicon glyphicon-pause play/pause-button";
			reproductor.cargar(song);
		}else if (btn.dataset.play === "0") {
			//0->el botón está en play
			//callarTodos();
			//está en play
			btn.dataset.play = "1";
			btn.className = "glyphicon glyphicon-pause play/pause-button";
			reproductor.play();
		}else if (btn.dataset.play === "1"){
			//1->el botón está en pause
			btn.dataset.play = "0";
			btn.className = "glyphicon glyphicon-play play/pause-button";
			reproductor.pause();
		}
	});
	var btnAux = nuevo.getElementsByClassName("aux-button")[0];
	if (btnAux.dataset.button === "1") {
		//botón de papelera
		btnAux.addEventListener("click", function () {
			if (btn.dataset.play === "1") {
				reproductor.pause();
			}
			quitarFavorito(qFavorito);
			nuevo.remove();
		});
	}else if (btnAux.dataset.button === "0") {
		//botón de estrella
		btnAux.addEventListener("click", function () {
			//insertamos en la BBDD
			btnAux.dataset.qFavorito = insertarFavorito (img, nombreCancion, album, artista, song);
			//lo añadimos a la vista de favoritos
			insertarElemento("favoritosView", img, nombreCancion, album, artista, song, btnAux.dataset.qFavorito);
		});
	}
	//lo añadimos al DOM
	nuevo.style.visibility = "visible";
	document.getElementById(tipo).appendChild(nuevo);
	//reventamos las plantillas
	aux_busqueda_template.style.display = "none";
	aux_favoritos_template.style.display = "none";
}

function callBackSpotify (tipo, contexto) {
	//capturamos la respuesta
	try {
	//console.log(contexto.responseText);
		var json = JSON.parse(contexto.responseText);
		var aux;
		for (var i = 0; i < json.tracks.items.length; i++) {
			aux = json.tracks.items[i];
			insertarElemento(tipo, aux.album.images[1].url, aux.name, aux.album.name, aux.artists[0].name, aux.preview_url);
		}	
	}catch (err) {
		console.log(err);
	}
}
/*
string->string de petición (lo del search)
tipo->hoverView-template/listView-template
append->listView...
*/
function listarCanciones (string, tipo) {
	//hacemos la petición
	if (string === undefined) return;
	try {
		var xhr = new XMLHttpRequest();
		xhr.addEventListener("load", function () {
			callBackSpotify(tipo, this);
		});
		xhr.open("GET", "https://api.spotify.com/v1/search?q="+string+"&type=track");
		xhr.send();
	}catch (error) {
		console.log(error);
	}
}

function insertarFavorito (img, nombreCancion, nombreAlbum, nombreArtista, song) {
	if (typeof(Storage) !== "undefined") {
		var aux = img+"@"+nombreCancion+"@"+nombreAlbum+"@"+nombreArtista+"@"+song;
		localStorage.setItem(localStorage.length.toString(), aux);
		return (localStorage.length-1).toString();
	}else {
		console.log("El navegador no admite uso de localStorage")
	}
	return -1;
}

function quitarFavorito (id) {
	localStorage.removeItem(id);
}

function cargarFavoritos (tipo) {
	aux_favoritos_template.style.display = "inline";
	if (typeof(Storage) !== "undefined") {
		var aux, split;
		for (var i = 0; i < localStorage.length; i++) {
			try {
				aux = localStorage.getItem(localStorage.key(i));
				split = aux.split("@");
				insertarElemento (tipo, split[0], split[1], split[2], split[3], split[4], i);
			}catch (err) {
				console.log("---->"+i);
			}
		}
	}else {
		console.log("El navegador no admite uso de localStorage")
	}
	aux_favoritos_template.style.display = "none";
}
//insertarElemento("listView-template", "listView","a.jpeg", "tu puta madre", "Berto", "llele", "https://p.scdn.co/mp3-preview/28fc8b1b9826ddc224d26b4df661fb79f1b94351");
//insertarElemento("listView-template", "listView","header-logo.png", "asdfsdf", "Roer", "lelel", "MANDANGA STYLE REMIX VERSION OFICIAL CON LETRA.mp3");
//localStorage.clear();

document.getElementById("search-button").addEventListener("click", function () {
		window.location.href = "#!";
		reproductor.pause();
		callarTodos();

		aux_busqueda_template.style.display = "inline";
		aux_favoritos_template.style.display = "inline";
		var template = document.getElementById("busquedaView-template");
		while (template.nextSibling) {
		    template.nextSibling.parentNode.removeChild(template.nextSibling);
		}
		if (document.getElementById("search-text").value) {
			listarCanciones(document.getElementById("search-text").value.toString(), "busquedaView");
		}
		aux_busqueda_template.style.display = "none";
		aux_favoritos_template.style.display = "none";
});

cargarFavoritos ("favoritosView");
//listarCanciones("Hey joe", "busquedaView");