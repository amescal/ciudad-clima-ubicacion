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

