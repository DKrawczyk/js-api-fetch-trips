import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

console.log('test');

document.addEventListener('DOMContentLoaded', init);

function init() {

    const form = document.querySelector('.form');
    form.addEventListener('submit', addNewExcursion);
}

function addNewExcursion(ev) {
    ev.preventDefault()
    // console.log(ev.target);
    const [tripTitle, tripDescription, tripAdultPrice, tripChildPrice] = getNewTripData(ev.target);
}

function getNewTripData(item) {
    console.log(item.elements);
    const title = item.querySelector('input[name="name"]').value;
    console.log(item);
    const description = item.querySelector('textarea[name="description"]').value;
    const [adultPrice, childPrice] = getPrice(item);
    // const adultPrice = item.querySelector('input[type="adult"]').value;
    // const childPrice = item.querySelector('input[name="child"]').value;
    console.log(title, description);
}
