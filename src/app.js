import request from 'request';
import yargs from 'yargs';

const baseURLDarksky = 'https://api.darksky.net/';
const tokenDarksky = '17d46d585b1acd84e3a4617e34de8de9';
const endpointDarksky = `${baseURLDarksky}forecast/${tokenDarksky}/`;
let lat = "";
let long = "";

const baseURLMapbox = 'https://api.mapbox.com/'
const tokenMapbox = 'pk.eyJ1IjoiYXJvZHJpZ3VlemI0IiwiYSI6ImNrMWFucmIweTAxcWIzaXA0aGFia285djEifQ.hX7vlRLdPwYu02VLxhQLzw'
const endpointMapbox = `${baseURLMapbox}geocoding/v5/mapbox.places/`
let name = "";

yargs.command ({
    command: 'location',
    describe: 'location',
    builder : {
        name : {
            describe: 'New location',
            demandOption: true,
            type: 'string'
        },

        index : {
            describe: 'New index',
            demandOption: false,
            type: 'number'
        }
    },

    handler:function(argv){

        request ({url: `${endpointMapbox}${argv.name}.json?access_token=${tokenMapbox}`, json: true}, (error, response) => {
            if(argv.index === undefined){
                (response.body.features).forEach((element, index) => {
                    console.log(`ID: ${index} Location: ${element.place_name}`);
                    request ({url: `${endpointDarksky}${element.center[1]},${element.center[0]}?units=si`, json:true}, (error, response2) => {
                        console.log("Temperatura: " + response2.body.currently.temperature + "ºC");
                        console.log("Probabilidad de lluvia: " + response2.body.currently.precipProbability + "%");
                    });
                });
            } else {
                (response.body.features).forEach((element, index) => {
                    if(index === argv.index){
                        console.log(`ID: ${index} Location: ${element.place_name}`);
                        request ({url: `${endpointDarksky}${element.center[1]},${element.center[0]}?units=si`, json:true}, (error, response2) => {
                            console.log("Temperatura: " + response2.body.currently.temperature + "ºC");
                            console.log("Probabilidad de lluvia: " + response2.body.currently.precipProbability + "%");
                        });
                    }
                });
            }

            

        })
    },
    
})

yargs.parse();