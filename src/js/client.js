import './../css/client.css';

import ExcursionsAPI from './ExcursionsAPI';
const apiUrlOrders = 'http://localhost:3000/orders';
const basket = [];

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
            const test = item.parentElement.querySelector('.excursions__description').textContent;
            const tripData = addExcursion(tripTitle, adultPrice, childPrice, adultNumber, childNumber);
            getTotalPrice();

            tripData.description = test;
            basket.push(tripData);
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
    const orderTitle = newExcursion.querySelector('.summary__name').innerText = tripTitle;
    newExcursion.querySelector('.summary__prices-adult-number').innerText = adultMember;
    newExcursion.querySelector('.summary__prices-children-number').innerText = childMember;
    const adultOrderPrice = newExcursion.querySelector('.summary__prices-adult').innerText = adultPrice;
    const childOrderPrice = newExcursion.querySelector('.summary__prices-children').innerText = childPrice;
    newExcursion.querySelector('.summay__total-price').innerText = `${singleExcursionPrice}PLN`;

    return {orderTitle, adultOrderPrice, childOrderPrice}
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
    const [name, email, regex] = purchaserDatas(ev);
    let errorValidation = [];
    
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
        ev.preventDefault();
    }
    else {
        // ev.preventDefault();
        sendOrder(orderDatas(name, email));
        errorValidation = [];
        alert('Thank you for order our trips!');
    }
}

function purchaserDatas() {
    const nameAndSurname = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const regexName = /^[\w'\-,.][^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

    return [nameAndSurname, email, regexName];
}

function orderDatas(name, email) {
    const data = {
        purchaser:name,
        purchaserEmail: email,
        cart:basket
    }
    return data;
}

function sendOrder(data) {
    const promise = fetch(apiUrlOrders, sendingOption(data));

    promise
        .then(resp => {
            if(resp.ok) {
                return resp.json();
            }
            return Promise.reject(resp);
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(console.log('done'));

}

function sendingOption(data) {
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    }
    return options;
}