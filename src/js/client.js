import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
const apiUrl = 'http://localost:3000/excursions';

document.addEventListener('DOMContentLoaded', init);

function init() {
    hideDefaultValues();
    
    const excursions = document.querySelector('.excursions');
    const summary = document.querySelector('.summary');
    const orderPanel = document.querySelector('.order');
    excursions.addEventListener('submit', addToOrder);
    summary.addEventListener('click', removeSingleExcursion);
    orderPanel.addEventListener('submit', userOrder);
}

function hideDefaultValues() {
    const defaultSummaryField = document.querySelector('.summary__item--prototype');
    defaultSummaryField.style.display = "none";

    const price = document.querySelector('.order__total-price-value');
    price.innerText = '0PLN';
}

function addToOrder(ev) {
    ev.preventDefault();

    dataValidation(ev.target);

}

function dataValidation(item) {
    const [tripTitle, adultPrice, childPrice, adultNumber, childNumber] = getExcersionMembersInfo(item);

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

function removeSingleExcursion(ev) {
    ev.preventDefault();

    const currentElement = ev.target;

    if(currentElement.tagName === "A") {
        const userConfirm = confirm('Are you sure?');
        if(userConfirm) {
            currentElement.parentElement.parentElement.remove();
            getTotalPrice();
        }
        else {
            ev.preventDefault();
        }
    }
}

function getTotalPrice() {
    const singlePrice = document.querySelectorAll('.summay__total-price');
    const pricesArray = [];
    

    singlePrice.forEach((el) => {
        if(!el.parentElement.parentElement.className.includes('summary__item--prototype')) {
            pricesArray.push(parseInt(el.textContent));
        }
    });
    
    setTotalPrice(pricesArray);
}

function setTotalPrice(prices) {
    const totalPrice = document.querySelector('.order__total-price-value')

    let totalSum = prices.reduce(function(a, b) {
        return a+b;
    },0)
    
    totalPrice.innerText = `${totalSum}PLN`;
}

function userOrder(ev) {
    // ev.preventDefault();

    const nameAndSurname = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const regexName = /^[\w'\-,.][^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

    purchaserDatas(nameAndSurname, email, regexName, ev);
}

function purchaserDatas(name, email, regex, event) {
    const errorValidation = [];
    
    if(name.length > 1 && email.length > 1) {
        if(regex.test(name) === true) {
            if(!email.includes('@')) {
                alert('Email is incorrect');
                errorValidation.push('Email is incorrect')
            }
        }
        else {
            alert('Name and surname is incorrect');
            errorValidation.push('Name and surname is incorrect')
        }
    } 
    else {
        alert('Please, insert purchaser informations');
        errorValidation.push('Please, insert purchaser informations')
    }

    if(errorValidation.length > 0) {
        event.preventDefault();
    }
    else {
        event.preventDefault();
        alert('Dziękujęmy za złożenie zamówienia o wartości');
        sendOrder();
        errorValidation = [];
    }
}

function sendOrder() {

    console.log(sendingOption());
    

    // const promise = fetch(apiUrl);
}

function sendingOption() {
    const options = {
        method: 'POST'

    }
    return options;
}