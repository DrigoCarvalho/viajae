const btnSearch = document.querySelector('.btn-searchFlight');
const origin = document.querySelector('#from-place');
const destination = document.querySelector('#to-place');
const departureDate = document.querySelector('#date-start');
const returnDate = document.querySelector('#date-end');
const adults = document.querySelector('#adults');
const children = document.querySelector('#children');

let originValue;
let destinationValue;
let departureDateValue;
let returnDateValue;
let adultsValue;
let childrenValue;


let places;
let quotes;

const trimDate = (date) => {
    // MM/DD/YYYY
    let dateArray = date.split('/');
    
    let DD = dateArray[0];
    let MM = dateArray[1];
    let YYYY = dateArray[2];
    
    // MM/DD/YYYY ---> DD/MM/YYYY
    let newDateArray = [DD,MM,YYYY]
    return newDateArray.join('/');
}

window.addEventListener('click', async (e) => {
    
    if(e.target == btnSearch) {
        originValue = origin.value;
        destinationValue = destination.value;
        departureDateValue = trimDate(departureDate.value);
        returnDateValue = trimDate(returnDate.value);
        adultsValue = adults.options[adults.selectedIndex].value;
        childrenValue = children.options[adults.selectedIndex].value;

        quotes = await getQuotes(originValue, destinationValue, departureDateValue, returnDateValue, adultsValue, childrenValue)
            .then(() => {
                return JSON.parse(quotes);
            })

        localStorage.setItem('quotes', JSON.stringify(quotes));
        window.location.href = "/resultadosdevoos"
    }
})

window.addEventListener('load', (e) => {
    if (window.location.href.indexOf("/resultadosdevoos") > -1) {
        showResults()
    }
})

const changeWindow = async (quotes) => {
    window.location.href = "/resultadosdevoos";
    console.log(quotes);
}

const getQuotes = async (origin, destination, departure, returnDate, adults, children) => {
    
    quotes = await fetch(`https://api.skypicker.com/flights?fly_from=${origin}&fly_to=${destination}&date_from=${departure}&date_to=${departure}&return_from=${returnDate}&return_to=${returnDate}&flight_type=roundtrip&adults=${adults}&children=${children}&infants=0&partner=picky&locale=br&curr=BRL`)

        .then(response => {
            return response.text()
        })
        .catch(err => {
            console.log(err);
        });
}

const showResults = () => {    
    let flights = JSON.parse(localStorage.getItem("quotes"))

    console.log(flights)
    
    let flightsData = []


    flights.data.forEach(v => {
        flightsData.push({
            outboundRoute: v.route.slice(0, v.route.findIndex(route => route.return == 1)),
            inboundRoute: v.route.slice(v.route.findIndex(route => route.return == 1)),
            deepLink: v.deep_link,
            price: v.conversion.BRL
        })
    })

    
    const checkNumber = (num) => {
        if(num < 10) return '0' + num
        return num
    }
    
    flightsData.forEach((v,i) => {
        
        let outboundDeparture = new Date(v.outboundRoute[0].dTime * 1000);
        v.outboundDepartureDate = outboundDeparture.toLocaleDateString('pt-br');
        v.outboundDepartureHour = checkNumber(outboundDeparture.getHours() + 3)
        v.outboundDepartureMinutes = checkNumber(outboundDeparture.getMinutes());

        let outboundArrival = new Date(v.outboundRoute[v.outboundRoute.length - 1].aTime * 1000);
        v.outboundArrivalDate = outboundArrival.toLocaleDateString('pt-br');
        v.outboundArrivalHour = checkNumber(outboundArrival.getHours() + 3)
        v.outboundArrivalMinutes = checkNumber(outboundArrival.getMinutes());

        let inboundDeparture = new Date(v.inboundRoute[0].dTime * 1000);
        v.inboundDepartureDate = inboundDeparture.toLocaleDateString('pt-br');
        v.inboundDepartureHour = checkNumber(inboundDeparture.getHours() + 3)
        v.inboundDepartureMinutes = checkNumber(inboundDeparture.getMinutes());

        let inboundArrival = new Date(v.inboundRoute[v.inboundRoute.length - 1].aTime * 1000);
        v.inboundArrivalDate = inboundArrival.toLocaleDateString('pt-br');
        v.inboundArrivalHour = checkNumber(inboundArrival.getHours() + 3)
        v.inboundArrivalMinutes = checkNumber(inboundArrival.getMinutes());

        v.outboundDepartureCompany = v.outboundRoute[0].airline;
        v.inboundDepartureCompany = v.inboundRoute[0].airline;

        v.outboundFrom = v.outboundRoute[0].flyFrom;
        v.outboundTo = v.outboundRoute[v.outboundRoute.length - 1].flyTo;

        v.inboundFrom = v.inboundRoute[0].flyFrom;
        v.inboundTo = v.inboundRoute[v.inboundRoute.length - 1].flyTo;
    })

    console.log(flightsData);
    
    
    flightsData.forEach((v,i) => {
        document.querySelector('.flightsResults').insertAdjacentHTML('beforeend', `
            <div class="row">
                <div style="background-color: white; padding: 30px; margin-top: 50px">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-8 col-md-offset-1">
                                <div class="row">
                                    <div class="col-md-2">
                                        <h3 class="fromto">IDA</h3>
                                        <h5 class="card-title">${v.outboundDepartureDate}</h5>
                                    </div>
                                    <div class="col-md-2">
                                        <h6>Empresa</h6>
                                        <h5 class="card-title">${v.outboundDepartureCompany}</h5>
                                    </div>
                                    <div class="col-md-3">
                                        <h4 class="card-title iata">${v.outboundFrom}</h4>
                                        <h5 class="card-title">${v.outboundDepartureHour}:${v.outboundDepartureMinutes}</h5>
                                    </div>
                                    <div class="col-md-2">
                                        <h5 class="card-title"></h5>
                                        <h5 class="card-title">${v.outboundRoute.length > 2 ? v.outboundRoute.length - 2 : v.outboundRoute.length - 1} escala(s)</h5>
                                    </div>
                                    <div class="col-md-3">
                                        <h4 class="card-title iata">${v.outboundTo}</h4>
                                        <h5 class="card-title">${v.outboundArrivalDate} ${v.outboundArrivalHour}:${v.outboundArrivalMinutes}</h5>
                                    </div>
            
            
                                </div>
                                <div class="row">
                                    <div class="col-md-2">
                                        <h3 class="fromto" >VOLTA</h3>
                                        <h5 class="card-title">${v.inboundDepartureDate}</h5>
                                    </div>
                                    <div class="col-md-2">
                                        <h6>Empresa</h6>
                                        <h5 class="card-title">${v.inboundDepartureCompany}</h5>
                                    </div>
                                    <div class="col-md-3">
                                        <h4 class="card-title iata">${v.inboundFrom}</h4>
                                        <h5 class="card-title">${v.inboundDepartureHour}:${v.inboundDepartureMinutes}</h5>
                                    </div>
                                    <div class="col-md-2">
                                        <h5 class="card-title"></h5>
                                        <h5 class="card-title">${v.inboundRoute.length > 2 ? v.inboundRoute.length - 2 : v.inboundRoute.length - 1} escala(s)</h5>
                                    </div>
                                    <div class="col-md-3">
                                        <h4 class="card-title iata">${v.inboundTo}</h4>
                                        <h5 class="card-title">${v.inboundArrivalDate} ${v.inboundArrivalHour}:${v.inboundArrivalMinutes}</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div>
                                    <h6>Valor</h6>
                                    <h2>R$ ${v.price.toFixed(2)}</h2>
                                    <a onclick="mandamodal();" href="${v.deepLink}" target="blank" class="btn btn-primary">Comprar</a>
                                </div>
                            </div>
            
                        </div>					
                    </div>
                </div>
            </div>
        `)
    })
} 








