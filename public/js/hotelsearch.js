$(document).ready(function(){

  var urldapag = window.location.search;
  var parametrosDaUrl = urldapag.split("?")[1];
  var listaDeParametros = parametrosDaUrl.split("&");
  var paramsurl = {}
  for(var i = 0; i < listaDeParametros.length; i++){
    var parametro = listaDeParametros[i].split("=");
    var chave = parametro[0];
    var valor = parametro[1];
    paramsurl[chave] = valor;
  }
  paramsurl["cidade"] = paramsurl["cidade"].split("%2C");
  paramsurl["cidade"][0] = paramsurl["cidade"][0].split("-");
  paramsurl["checkin"] = paramsurl["checkin"].split("%2F");
  paramsurl["checkout"] = paramsurl["checkout"].split("%2F");
  console.log(paramsurl["cidade"][0]);

  if(typeof paramsurl["cidade"][0] === "object"){
    var localfiltrado = paramsurl["cidade"][0][0];
  }else{
    var localfiltrado = paramsurl["cidade"][0];
  }



  
  
  
  var settings = {
	"async": true,
	"crossDomain": true,
	"url": `https://hotels4.p.rapidapi.com/locations/search?locale=pt_BR&query=${localfiltrado}`,
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "hotels4.p.rapidapi.com",
		"x-rapidapi-key": "f763607191msh2e0caad36e8a28ep10b579jsnf6ec2232179e"
	}
}

$.ajax(settings).done(function (response) {

  var idlocal = response.suggestions[0].entities[0].destinationId;
  console.log(idlocal)

	 
  var settings2 = {
	"async": true,
	"crossDomain": true,
	"url": `https://hotels4.p.rapidapi.com/properties/list?currency=BRL&locale=pt_BR&sortOrder=PRICE&destinationId=${idlocal}&pageNumber=1&checkIn=${paramsurl["checkin"][2]}-${paramsurl["checkin"][1]}-${paramsurl["checkin"][0]}&checkOut=${paramsurl["checkout"][2]}-${paramsurl["checkout"][1]}-${paramsurl["checkout"][0]}&pageSize=10&adults1=${paramsurl["adultos"]}`,
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "hotels4.p.rapidapi.com",
		"x-rapidapi-key": "f763607191msh2e0caad36e8a28ep10b579jsnf6ec2232179e"
	}
}

$.ajax(settings2).done(function (response2) {
	
  var resultados = response2.data.body.searchResults.results;
  for(var k in resultados) {
   
    console.log(resultados[k])
   var html = '<div class="card">';
   html += '<img src="'+resultados[k].thumbnailUrl+'" alt="imghotel">';
   html += '<div>';
   html += '<h6>Nome</h6>';
   html += '<h3 class="nomehotel">'+resultados[k].name+'</h3>';
   html += '<h6>Endereço</h6>';
   html += '<h4>'+resultados[k].address.streetAddress+', '+resultados[k].address.locality+'</h4>';
   html += '<h5>'+resultados[k].starRating+' estrela(s)</h5>';
   if(typeof resultados[k].guestReviews != "undefined" ){
    html += '<h5>Nota '+resultados[k].guestReviews.rating+'/'+resultados[k].guestReviews.scale+' segundo avaliação de '+resultados[k].guestReviews.total+' usuários </h5>';
    }
   html += '</div>';
   html += '<div>';
   html += '<h6>Preço</h6>';
   html += '<h3>'+resultados[k].ratePlan.price.current+'</h3>';
   html += '<h6>Por noite</h6>';
   if(typeof resultados[k].ratePlan.price.totalPricePerStay != 'undefined'){
   html += '<h6>'+resultados[k].ratePlan.price.totalPricePerStay+'</h6>';
   }
   html += '</div>';
   html += '<div class="breservar">';
   html += '<a onclick="mandamodal();" target="_blank" class="button" href="https://www.hoteis.com/ho'+resultados[k].id+'/?pa=1&q-check-out='+paramsurl["checkout"][2]+'-'+paramsurl["checkout"][1]+'-'+paramsurl["checkout"][0]+'&tab=description&q-room-0-adults='+paramsurl["adultos"]+'&YGF=2&q-check-in='+paramsurl["checkin"][2]+'-'+paramsurl["checkin"][1]+'-'+paramsurl["checkin"][0]+'&MGT=1&WOE=1&WOD=7&ZSX=0&SYE=3&q-room-0-children=0">Reservar</a>';
   html += '</div>';
   html += '</div>';
   

   $('.aqui').append(html);
}
  /* for each result montar o card com os atributos e o deeplink  */
  
  
  
  
});
  
  
  
  
  
});

});




  
  
  
