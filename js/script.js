//necesitamos unas variables globales para el mapa que se mostrará en la página
let coordenadas;
let mapa;
let marker;

//al cargar la página
//$(funtion()... equivale al evento onload y se ejecuta cuando esté cargada la página
$(function(){
    //evento click en el boton de mostrar el tiempo actual
    $("#tiempo_actual").click(trabajandoAjax);
    $("#prevision").click(trabajandoAxios);
    $("#mapa").click(trabajandoFetch);

    //evitamos que al pulsar intro en el input text se mande nada
    $("#localidad").preventDefault;
    //PARA EL MAPA
    //iba a obtener las coordenadas del usuario con el objeto geolocation de navigator pero requiere que el usuario acepte
    //compartir las coordenadas con el sitio y si no lo hace no tenemos coordenadas asi que 
    //usamos unas coordenadas iniciales por defecto, son las de Sevilla que también es el valor por defecto de localidad
    coordenadas={
            lat: 37.3886,
            lon: -5.9823
        };
    map = L.map('mapa_leaftlet').setView([coordenadas.lat, coordenadas.lon], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    marker = L.marker([coordenadas.lat, coordenadas.lon]).addTo(map);
    marker.bindPopup("<b>Hola!</b><br>Estás en Sevilla.").openPopup();
});

//funcion en la que trabajamos con $.ajax y jquery
function trabajandoAjax() {
    let localidad='Sevilla,es'; //por defecto por si no escriben nada en el input
    let cadena='<div id="tiempo_hoy"><h2>Tiempo Actual en ';
    let urlTiempo='http://api.weatherapi.com/v1/current.json';
    //mostramos el icono de carga ajax
    $("#cambiar").html("<img src='images/ajax_loader.webp'>");
    //con un tamaño pequeño
    $("#cambiar>img").css("width", "15%");
    //si no está vacío recogemos el valor del input en el momento de hacer clic
    if($("#localidad").val()!==''){
        //concatemos con ,es para asegurarnos que la localidad está en España
        localidad=$("#localidad").val()+',es';
    }
    //montamos la url para la consulta tipo get partiendo de la url base y añadimos los parametros de la consulta
    //usamos $.ajax
    $.ajax(
    {
        url: urlTiempo, 
        data: {
            //la APIKEY está en config.js
            key: APIKEY,
            q: localidad,
            //queremos que nos mande a calidad del aire
            aqi: 'yes',
            //y los datos en español
            lang: 'es'
        },
        type: "GET",
        dataType: "json",
        async : true,
        //si la consulta se ha realizado con exito
        success: function (datos_devueltos){
            //trabajamos con los datos devueltos 
            cadena+=datos_devueltos.location.name+"</h2>";
            cadena+="<p><img src='https:"+datos_devueltos.current.condition.icon+"'</img></p>";
            console.log(datos_devueltos.current.condition.icon);
            cadena+="<h3>"+datos_devueltos.current.condition.text+"</h3>";
            cadena+="<br><p>Temperatura actual: "+datos_devueltos.current.temp_c+"°</p>";
            //si hay viento lo mostramos, nos basamos en si la velocidad del viento no es 0
            if(datos_devueltos.current.wind_kph!==0){
                //hacemos un switch para mostrar la direccion del viento como una palabra
                switch(datos_devueltos.current.wind_dir){
                    case "N":
                        cadena+="<p>Dirección del viento: Norte (N)</p>";
                        break;
                    case "S":
                        cadena+="<p>Dirección del viento: Sur (S)</p>";
                        break;
                    case "E":
                        cadena+="<p>Dirección del viento: Este (E)</p>";
                        break;
                    case "W":
                        cadena+="<p>Dirección del viento: Oeste (W)</p>";
                        break;
                    case "NE":
                        cadena+="<p>Dirección del viento: Noreste (NE)</p>";
                        break;
                    case "NW":
                        cadena+="<p>Dirección del viento: Noroeste (NW)</p>";
                        break;
                    case "NNE":
                        cadena+="<p>Dirección del viento: Nornoreste (NNE)</p>";
                        break;
                    case "NNW":
                        cadena+="<p>Dirección del viento: Nornoroeste (NNW)</p>";
                        break;
                    case "SE":
                        cadena+="<p>Dirección del viento: Sureste (SE)</p>";
                        break;
                    case "SW":
                        cadena+="<p>Dirección del viento: Suroeste (SW)</p>";
                        break;
                    case "SSE":
                        cadena+="<p>Dirección del viento: Sursureste (SSE)</p>";
                        break;
                    case "SSW":
                        cadena+="<p>Dirección del viento: Sursuroeste (SSW)</p>";
                        break;
                    case "ENE":
                        cadena+="<p>Dirección del viento: Estenoreste (ENE)</p>";
                        break;
                    case "ESE":
                        cadena+="<p>Dirección del viento: Estesureste (ESE)</p>";
                        break;
                    case "WNW":
                        cadena+="<p>Dirección del viento: Oestenoroeste (WNW)</p>";
                        break;
                    case "WSW":
                        cadena+="<p>Dirección del viento: Oestesuroeste (WSW)</p>";
                        break;
                    default: 
                        cadena+="<p>Error en la dirección del viento</p>";
                        break;
                }
                cadena+="<p>Velocidad del viento: "+datos_devueltos.current.wind_kph+" km/h"
            }
            //si llueve lo mostramos, llueve si no hay 0 mm de precipitaciones
            if(datos_devueltos.current.precip_mm!==0){
                cadena+="<p>Lluvia con precipitaciones acumuladas de "+datos_devueltos.current.precip_mm+" mm</p>";
            }
            cadena+="<br><br><h4>Calidad del aire</h4>";
            //usamos el indice USA para la calidad del aire que va del 1 al 6, de calidad buena a peligrosa
            switch(datos_devueltos.current.air_quality["us-epa-index"]){
                case 1:
                    cadena+="<p>Buena</p>";
                    break;
                case 2:
                    cadena+="<p>Moderada</p>";
                    break;
                case 3:
                    cadena+="<p>No saludable para personas sensibles</p>";
                    break;
                case 4:
                    cadena+="<p>No saludable</p>";
                    break;
                case 5:
                    cadena+="<p>Muy poco saludable</p>";
                    break;
                case 6:
                    cadena+="<p>Peligrosa</p>";
                    break;
                default:
                    cadena+="<p>Calidad del aire no disponible</p>";
                    break;
            }
            cadena+="<p>Partículas de monóxido de carbono (CO): "+datos_devueltos.current.air_quality.co+"</p>";
            cadena+="<p>Partículas de dióxido de nitrógeno (NO2): "+datos_devueltos.current.air_quality.no2+"</p>";
            cadena+="<p>Partículas de dióxido de azufre (SO2): "+datos_devueltos.current.air_quality.so2+"</p>";
            cadena+='</div>';
            //cambiamos las coordenadas por defecto por las obtenidas en la consulta
            coordenadas={
                lat: datos_devueltos.location.lat,
                lon: datos_devueltos.location.lon
            };
            //modificamos el mapa
            map.setView([coordenadas.lat, coordenadas.lon], 15);
            marker.setLatLng([coordenadas.lat, coordenadas.lon]);
            marker.setPopupContent("<b>Hola!</b><br>Estás en "+datos_devueltos.location.name).openPopup();
            //y lo mostramos
            $("#mapa_leaftlet").css('visibility', 'visible');
            //modificamos el elemento con id cambiar
            $("#cambiar").css('border', '');
            $("#cambiar").css('width', '80%');
            $("#cambiar").html(cadena);
        },
        //si la peticion falla
        error: function (estado, error_producido) {
            console.log("Error producido: " + error_producido);
            console.log("Estado: " + estado);
            $("#cambiar").css('border', '');
            $("#cambiar").css('width', '80%');
            $("#cambiar").html("<img src='images/ajax_not_working.png' width='20%'><br><br><p>Error producido: "+ error_producido+"</p>");
        },
        //Tanto si falla como si funciona como sino funciona.
        complete: function () {
            console.log("Petición completa");
        }
    });
}

//funcion en la que trabajamos con axios
function trabajandoAxios() {
    let localidad='Sevilla,es'; //por defecto por si no escriben nada en el input
    let datos_devueltos;
    let cadena='<h2>Previsión del Tiempo en ';
    let urlPrevision='http://api.weatherapi.com/v1/forecast.json';
    //mostramos el icono de carga ajax sin jquery
    $("#cambiar").html("<img src='images/ajax_loader.webp'>");
    //con un tamaño pequeño
    $("#cambiar>img").css("width", "15%");
    //si no está vacío recogemos el valor del input en el momento de hacer clic
    if($("#localidad").val()!==''){
        //concatemos con ,es para asegurarnos que la localidad está en España
        localidad=$("#localidad").val()+',es';
    }
    //montamos la url para la consulta tipo get partiendo de la url base y añadimos los parametros de la consulta
    //usamos axios
    axios({
        method: "get",
        url: urlPrevision,
        params: {
            //la APIKEY está en config.js
            key: APIKEY,
            q: localidad,
            //proporciona un máximo de tres días de previsión pero el primero siempre es el dia actual
            days: 3,
            //queremos también las alertas
            alerts: 'yes',
            //los datos en español
            lang: 'es'
        }
    }).then(function(response){
        //recogemos los datos devueltos
        datos_devueltos=response.data;
        //y trabajamos con ellos
        cadena+=datos_devueltos.location.name+"</h2><div id='tiempo_previsiones'>";
        //recogemos las coordenadas
        coordenadas.lat=datos_devueltos.location.lat;
        coordenadas.lon=datos_devueltos.location.lon;
        //recorremos los dias de prevision devueltos y para cada dia sacamos la siguiente informacion
        let dias_prevision=datos_devueltos.forecast.forecastday;
        //empezamos en 0 que es el dia de hoy y mostramos la prevision de tres dias
        for(let i=0; i<=dias_prevision.length-1; i++){
            if(i===0){
                cadena+='<div class="tiempo_prevision"><h3>El tiempo hoy</h3>';
            } else {
                cadena+='<div class="tiempo_prevision"><h3>Previsión para '+dias_prevision[i].date+"</h3>";
            }
            cadena+='<br><p>Salida del sol: '+dias_prevision[i].astro.sunrise+"</p>";
            cadena+='<p>Puesta del sol: '+dias_prevision[i].astro.sunset+"</p><p>__________________</p>";
            //para cada dia mostramos info a las 5:00 y a las 14:00, asi que tenemos que recorrer las horas de cada dia
            for(let j=0; j<dias_prevision[i].hour.length; j++){
                if(j===5 || j===14){
                    //con el substring nos quedamos solo con la hora
                    cadena+='<br><h4>'+dias_prevision[i].hour[j].time.substring(11)+'</h4>';
                    cadena+="<p><img src='https:"+dias_prevision[i].hour[j].condition.icon+"'</img></p>";
                    cadena+="<p>Temperatura: "+dias_prevision[i].hour[j].temp_c+"°</p><p>__________________</p>";
                }
            }
            //las alertas son un array dentro del json, si la longitud es 0 no hay alertas, si hay las mostramos
            if(datos_devueltos.alerts.alert.length!==0){
                cadena+='<br><h4>Alertas</h4>';
                alertas=datos_devueltos.alerts.alert;
                alertas.forEach(function(alerta, i) {
                    if(alerta.headline!==null){
                        cadena+='<p>'+alerta.headline+'</p>';
                    }
                });
            }
            //cerramos el div de cada dia de prevision
            cadena+='</div>';
        }
        //cerramos el div de la prevision de los tres dias
        cadena+='</div>';
        //modificamos el mapa
        map.setView([coordenadas.lat, coordenadas.lon], 15);
        marker.setLatLng([coordenadas.lat, coordenadas.lon]);
        marker.setPopupContent("<b>Hola!</b><br>Estás en "+datos_devueltos.location.name).openPopup();
        //y lo mostramos
        $("#mapa_leaftlet").css('visibility', 'visible');

        //modificamos el elemento con id cambiar
        $("#cambiar").css('border', '2px solid black');
        $("#cambiar").css('border-radius', '5px');
        $("#cambiar").css('width', '100%');
        $("#cambiar").html(cadena);
    })
    .catch(function (error) {
        console.log(error);
        $("#cambiar").css('border', '');
        $("#cambiar").css('width', '80%');
        $("#cambiar").html("<img src='images/ajax_not_working.png' width='20%'><br><br><p>Error producido: "+ error+"</p>");
    })
    .finally(function () {
        // siempre sera ejecutado
        console.log("Petición completa");
    });
}

//funcion en la que trabajamos con fetch
function trabajandoFetch(){
    let localidad='Sevilla'; //por defecto por si no escriben nada en el input
    let cadena='<div id="datos_localidad"><h2>Datos sobre ';
    let urlMapa='http://geodb-free-service.wirefreethought.com/v1/geo/places';
    //mostramos el icono de carga ajax
    $("#cambiar").css('border', '');
    $("#cambiar").html("<img src='images/ajax_loader.webp'>");
    //con un tamaño pequeño
    $("#cambiar>img").css("width", "15%");
    //si no está vacío recogemos el valor del input en el momento de hacer clic
    if($("#localidad").val()!==''){
        localidad=$("#localidad").val();
    }
    //montamos la url para la peticion tipo get partiendo de la url base y añadimos los parametros de la consulta
    urlMapa+='?limit=5&offset=0&types=CITY&namePrefix='+localidad+'&languageCode=es';
    //usamos FETCH
    fetch(urlMapa)
        //la peticion en fetch es tipo GET por defecto, aunque podriamos indicarlo con {method: 'GET'} despues de la url
        //al usar .then que son promesas ya estamos trabajando en asincrono
        .then((resultado)=> {
            //manejamos posibles errores de estado si el resultado no es ok
            if(!resultado.ok) {
                //fetch no captura los errores HTTP solo los errores de red, hay que manejarlos manualmente
                throw new Error("Error: "+response.status);
            } else {
                return resultado.json();
            }
        })
    .then(data =>{
        //aqui trabajamos con los datos json que hemos recibido de la promesa anterior, los vamos a consumir
        //puede darse el caso de que la localidad que queremos consultar no existe, nos devolvera datos vacíos 
        if(!data || data.data.length===0){
            //lanzamos un nuevo error
            throw new Error("No tenemos datos sobre la localidad que quieres consultar");
        } else {
            //el json devuelto contiene data y metadata, nos vamos a quedar solo con data
            let datos_devueltos=data.data;
            let nombre_sitio, poblacion, pais, region;
            //recorremos los datos con un bucle for in para practicar
            for(let sitio in datos_devueltos){
                //si el codigo del pais del sitio coincide con el de españa y el nombre con la localidad en minusculas
                //he tenido que añadir el nombre porque hay sitios como granada que aparecen dos en españa
                if(datos_devueltos[sitio].countryCode==="ES" 
                    && datos_devueltos[sitio].name.toLowerCase()===localidad.toLowerCase()){
                    nombre_sitio=datos_devueltos[sitio].name;
                    //recogemos los datos
                    poblacion=datos_devueltos[sitio].population;
                    pais=datos_devueltos[sitio].country;
                    region=datos_devueltos[sitio].region;
                    //recogemos tambien las coordenadas para actualizar el mapa
                    coordenadas.lat=datos_devueltos[sitio].latitude;
                    coordenadas.lon=datos_devueltos[sitio].longitude;
                } 
            }
            //si no habia ningun sitio con codigo de pais españa algunos datos seguirán undefined
            // en ese caso nos quedamos con la primera posicion de los datos
            if(poblacion===undefined && pais===undefined && region===undefined){
                nombre_sitio=datos_devueltos[0].name;
                poblacion=datos_devueltos[0].population;
                pais=datos_devueltos[0].country;
                region=datos_devueltos[0].region;
                coordenadas.lat=datos_devueltos[0].latitude;
                coordenadas.lon=datos_devueltos[0].longitude;
            } 
            //añadimos los datos a la cadena
            cadena+=nombre_sitio+'</h2>';
            cadena+='<br><p>Poblacion: '+poblacion+'</p><br>';
            cadena+='<p>País: '+pais+'</p><br>';
            cadena+='<p>Región: '+region+'</p>';
            //modificamos el mapa
            map.setView([coordenadas.lat, coordenadas.lon], 15);
            marker.setLatLng([coordenadas.lat, coordenadas.lon]);
            marker.setPopupContent("<b>Hola!</b><br><p>Estás en "+nombre_sitio+", ciudad situada en la región de "+region+
                " en "+pais+" y con una población de "+poblacion+" habitantes</p>").openPopup();
            //y lo mostramos
            $("#mapa_leaftlet").css('visibility', 'visible');
            //cerramos el div con id datos_localidad
            cadena+='</div>';
            //modificamos el elemento con id cambiar
            $("#cambiar").css('width', '80%');
            $("#cambiar").html(cadena);
        }
    })
    .catch(error =>{
        //capturamos posibles errores de red o los lanzados manualmente
        console.log(error);
        //quitamos el loader
        $("#cambiar").css('border', '');
        $("#cambiar").css('width', '80%');
        $("#cambiar").html("<img src='images/ajax_not_working.png' width='20%'><br><br><p>Error producido: "+ error+"</p>");
    })
    .finally(function () {
        // siempre sera ejecutado
        console.log("Petición completa");
    });
}