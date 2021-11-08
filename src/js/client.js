import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const excursions = document.querySelector('.excursions')
    const defaultSummaryField = document.querySelector('.summary__item--prototype');
    defaultSummaryField.style.display = "none";

    excursions.addEventListener('submit', addToOrder);
}

function addToOrder(ev) {
    ev.preventDefault();

    dataValidation(ev.target);

}

function dataValidation(item) {
    const [tripTitle, adultPrice, childPrice, adultNumber, childNumber] = getExcersionMembersInfo(item);
    const priceArray = item.querySelectorAll('.excursions__price');
    console.log(priceArray);

    if (adultNumber > 0 || childNumber > 0) {
        if(isNaN(adultNumber) === false && isNaN(childNumber) == false) {

            addExcursion(tripTitle, adultPrice, childPrice, adultNumber, childNumber);
            getTotalPrice();
        }
        else 
        alert('Please, insert correct values');
    }
    else {
        alert('Please, insert values')
    }
    
}

function getExcersionMembersInfo(item) {
    const priceArray = item.querySelectorAll('.excursions__price');
    const tripTitle = item.parentElement.querySelector('.excursions__title').textContent;
    const adultPrice = priceArray[0].textContent;
    const childPrice = priceArray[1].textContent;
    const adultNumber = item.querySelector('input[name="adults"]').value;
    const childNumber = item.querySelector('input[name="children"]').value;

    return [tripTitle, parseFloat(adultPrice), parseFloat(childPrice), parseFloat(adultNumber), parseFloat(childNumber)];
}

function addExcursion(tripTitle, adultPrice, childPrice, adultMember, childMember) {
    const excursionPrototype = document.querySelector('.summary__item--prototype');
    const summary = document.querySelector('.summary');
    const newExcursion = excursionPrototype.cloneNode(true);
    const singleExcursionPrice = adultPrice * adultMember + childPrice * childMember;
    summary.appendChild(newExcursion);

    newExcursion.style.display = "block";
    newExcursion.classList.remove('summary__item--prototype');
    newExcursion.querySelector('.summary__name').innerText = tripTitle;
    newExcursion.querySelector('.summary__prices-adult-number').innerText = adultMember;
    newExcursion.querySelector('.summary__prices-children-number').innerText = childMember;
    newExcursion.querySelector('.summary__prices-adult').innerText = adultPrice;
    newExcursion.querySelector('.summary__prices-children').innerText = childPrice;
    newExcursion.querySelector('.summay__total-price').innerText = `${singleExcursionPrice}PLN`;
}

function getTotalPrice() {
    const singlePrice = document.querySelectorAll('.summay__total-price');
    const pricesArray = [];
    

    singlePrice.forEach((el) => {
        if(!el.parentElement.parentElement.className.includes('summary__item--prototype')) {
            console.log(parseInt(el.textContent));
            pricesArray.push(parseInt(el.textContent));
        }
    });
    
    updateTotalPrice(pricesArray);
}

function updateTotalPrice(prices) {
    const totalPrice = document.querySelector('.order__total-price-value')

    let totalSum = prices.reduce(function(a, b) {
        return a+b;
    },0)
    
    totalPrice.innerText = `${totalSum}PLN`;
}