//"use strict";     Non la considero dato che sto usando i moduli ES (.mjs)

/*
Common JS --> per importare librerie - standard per Node ma non standard per JS
equivalente all'import di altri linguaggi
non si sa perchè ma il mese parte da 0
*/
//const dayjs = require('dayjs'); 

/*
quando usiamo javaScript nel browser non possiamo questo metodo di importazione, quindi
dovremo usare il metodo standard:
ES Modules

Se si vuole usare questo metodo dobbiamo modificare l'estensione del file in ".mjs", che sta per 
MODULE JS ==> posso anche non usare "use strict"
*/
import dayjs from 'dayjs';

let oggi = dayjs();

console.log(oggi.format('YYYY-MM-DD'));
