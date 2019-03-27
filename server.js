const express = require('express');
const hbs = require('hbs');
const axios = require('axios');
const _ = require('lodash')
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('header', (text) => {
    return text
});
hbs.registerHelper('message', (text) => {
    return text.toUpperCase();
});

// app.use((request,response, next) => {
//     var time = new Date().toString();
//     var log = `${time}: ${request.method} ${request.url}`;
//     fs.appendFile('server.log', log + '\n', (error) => {
//         if (error) {
//             console.log('Unable to log message');
//         }
//     });
//     next();
// });

app.use((request, response, next) => {
    response.render('error.hbs', {

    });
});

app.get('/main', (request, response) => {
    response.render('main.hbs', {
        title: 'Main page',
        year: new Date().getFullYear(),
        welcome: 'Welcome to my website',
        header: "home page"
    });
});


app.get('/about', (request, response) => {
    response.render('about.hbs', {
        title: 'About page',
        year: new Date().getFullYear(),
        welcome: 'Hi my name is Eric',
        header: 'my page'
    });
});

app.get('/currency', async (request, response) => {
    try {

        var country_canada = await axios.get(`https://restcountries.eu/rest/v2/name/gdggd?fullText=true`);
        var coded_canada = country_canada.data[0].currencies[0].code;

        var conversion_rate = await axios.get(`https://api.exchangeratesapi.io/latest?symbols` +
            encodeURIComponent(coded_canada) + `&base=USD`);
        var rate = conversion_rate.data.rates[`${coded_canada}`];

        response.render('currency.hbs', {
            title: "Currency Page",
            header: "Currency Conversion",
            welcome: 'Woohoo',
            output: `1 USD = ${_.round(rate, 2)} ${coded_canada}`
        });

    } catch (e) {

        if (coded_canada === undefined) {
            response.render('currency.hbs', {
                title: "Currency Page",
                header:"Error Page",
                welcome: "Awww",
                output: 'Country does not exist'
            });
        } else if (rate === undefined) {
            response.render('currency.hbs', {
                title: "Currency Page",
                header: "Error Page",
                welcome: "Awww",
                output: 'Rate does not exist'
            });
        } else {
            response.send(
                {
                    error: `${e}`
                }
            )
        }

    }
});

app.get('/404', (request, response) => {
    response.send({
        error: 'Page not found'
    })
});

app.listen(8080, () => {
    console.log('Server is up on the port 8080')
});