import DataValidation from "./DataValidation";
const validation = new DataValidation();

class Excursions {

    constructor(api) {
        this.apiProvider = api;
        this.basket = [];
        this.id = 0;
    }

    load() {
        this._hidePrototypes();

        this.apiProvider.loadData()
            .then (data => {
                this.insert(data)
            })
            .catch (err => console.log(err))
            .finally (console.log('Excursions downloaded'));
    } 

    insert(data) {
        const element = this._excursionListElement();
        const excursionPrototype = this._excursionPrototype(); 
        element.innerHTML = '';
        
        data.forEach( el => {
            element.appendChild(this._createExcursion(excursionPrototype, el));
        });
    }

    orderTrip() {
        const addExcursion = this._excursionListElement()
        addExcursion.addEventListener('submit', ev => {
            ev.preventDefault();

            this._dataValidation(ev.target);
        });
    }

    remove() {
        const summary = this._summaryElement();
        summary.addEventListener('click', ev => {
            ev.preventDefault();

            this._removeExcursion(ev.target, ev)
        });
    }

    order() {
        const orderPanel = document.querySelector('.order');
        orderPanel.addEventListener('submit', ev => {
            this._userOrder(ev);
        });
    }

    _excursionListElement() {
        return document.querySelector('.excursions');
    }

    _userOrder(ev) {
        const [name, email] = this._purchaserData(ev);
        let errorValidation = [];
        const regexName = /^[\w'\-,.][^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
        const excursionItems = document.querySelectorAll('.summary__item:not(.summary__item--prototype)');

        if(!validation.isExcursionTyped(excursionItems.length)) {
            ev.preventDefault();
            alert('Please, choose at least one excursion');
            errorValidation.push('Please, choose at least one excursion');
        } 
        else {
            if(!validation.isPurchaserInformationCorrect(name.length, email.length)) {
                alert('Please, insert purchaser informations');
                errorValidation.push('Please, insert purchaser informations');
            } 
            else {
                if(!validation.isUserDataCorrect(regexName, name)) {
                    alert('Name and surname is incorrect');
                    errorValidation.push('Name and surname is incorrect');
                }
                else {
                    if(!validation.isEmailCorrect(email)) {
                        alert('Email is incorrect');
                        errorValidation.push('Email is incorrect');
                    } 
                }
            }
        }

        if(errorValidation.length > 0) {
            ev.preventDefault();
        }
        else {
            const totalAmount = document.querySelector('.order__total-price-value').innerText;
            this._sendOrder(this._orderInfo(name, email, parseFloat(totalAmount)));
            errorValidation = [];
            alert('Thank you for order our trips!');
        }
    }

    _sendOrder(data) {
        this.apiProvider.addOrder(data)
            .then(data => console.log(data))
            .catch(err => console.log(err))
            .finally(console.log('done'));
    }

    _orderInfo(name, email, amount) {
        const data = {
            purchaser:name,
            purchaserEmail: email,
            cart: this.basket,
            totalAmount: amount
        }
        return data;
    }

    _purchaserData() {
        const nameAndSurname = document.querySelector('input[name="name"]').value;
        const email = document.querySelector('input[name="email"]').value;

        return [nameAndSurname, email];
    }

    _removeExcursion(item, ev) {
        if(item.tagName === "A") {
            const userConfirm = confirm('Are you sure?');
            if(userConfirm) {
                const test = item.parentElement.parentElement.children[0].innerText;

                this._updateBasket(this._rootElement(item));
                this._rootElement(item).remove();
                this._defaulBorder(item, test);
                this._getPrice();
            }
            else {
                ev.preventDefault();
            }
        }
    }

    _updateBasket(current) {

        let id = parseFloat(current.dataset.id);

        this.basket = this.basket.filter(item => {
            return item.id !== id;
        });
        return this.basket;
    }

    _defaulBorder(item, clickedItem) {           //  <---        FAZA PROTOTYPU
        // console.log(this.basket);
        // console.log(item.parentElement.parentElement);
        // console.log(clickedItem);
        // console.log(item);

        if(this.basket.length === 0) {
            const excursionsArray = document.querySelectorAll('.excursions__item');
            excursionsArray.forEach( el => {
                el.classList.remove('greenBorder');
                el.classList.remove('greenShadow');
            });
        }
    }///////////////////////////////////////////////////////////////////////         <---

    _dataValidation(item) {
        const [adultNumber, childNumber] = this._memberDatas(item);
        const isNumberOfMembers = validation.isNumberOfMembers(adultNumber, childNumber, 'Please, insert numbers');
        if (isNumberOfMembers === true) {
            const isMembersDataCorrect = validation.isMembersDataCorrect(adultNumber, childNumber, 'Please, insert correct values');
            if(isMembersDataCorrect === true) {
                item.parentElement.classList.add('greenBorder');
                item.parentElement.classList.add('greenShadow');
                this._addExcursion(item);
            }
            else 
            alert(isMembersDataCorrect);
        }
        else {
            alert(isNumberOfMembers);
        }  
    }

    _addExcursion(item) {
        const [adultNumber, childNumber, tripTitle, adultPrice, childPrice, id] = this._memberDatas(item);
        const description = item.parentElement.querySelector('.excursions__description').textContent;
        const tripData = this._singleExcursion(tripTitle, adultPrice, childPrice, adultNumber, childNumber, id);
        this.id++;
        this._getPrice();
        tripData.description = description;
        this.basket.push(tripData);
    }

    _getPrice() {
        const singlePrice = document.querySelectorAll('.summay__total-price');
        const pricesArray = [];
    
        singlePrice.forEach((el) => {
            pricesArray.push(parseInt(el.textContent));
        });
        this._setPrice(pricesArray);
    }

    _setPrice(prices) {
        const totalPrice = document.querySelector('.order__total-price-value');
        let totalSum = prices.reduce(function(a, b) {
            return a+b;
        },0)
        totalPrice.innerText = `${totalSum}PLN`;
    }

    _singleExcursion(tripTitle, adultPrice, childPrice, adultMember, childMember) {
        const excursionPrototype = document.querySelector('.summary__item--prototype');
        const summary = this._summaryElement();
        const newExcursion = excursionPrototype.cloneNode(true);
        const singleExcursionPrice = adultPrice * adultMember + childPrice * childMember;
        summary.appendChild(newExcursion);
        let id = this.id;
    
        newExcursion.dataset.id = id;
        newExcursion.style.display = "block";
        newExcursion.classList.remove('summary__item--prototype');
        const orderTitle = newExcursion.querySelector('.summary__name').innerText = tripTitle;
        newExcursion.querySelector('.summary__prices-adult-number').innerText = adultMember;
        newExcursion.querySelector('.summary__prices-children-number').innerText = childMember;
        const adultOrderPrice = newExcursion.querySelector('.summary__prices-adult').innerText = adultPrice;
        const childOrderPrice = newExcursion.querySelector('.summary__prices-children').innerText = childPrice;
        newExcursion.querySelector('.summay__total-price').innerText = `${singleExcursionPrice}PLN`;
        
        return {orderTitle, adultOrderPrice, childOrderPrice, id}
    }

    _memberDatas(item) {
        const tripTitle = item.parentElement.querySelector('.excursions__title').textContent;
        const adultPrice = item.querySelector('.excursions__price-adult').textContent;
        const childPrice = item.querySelector('.excursions__price-child').textContent;
        const adultNumber = item.querySelector('input[name="adults"]').value;
        const childNumber = item.querySelector('input[name="children"]').value;
        const id = item.parentElement.dataset.id;

        return [parseFloat(adultNumber), parseFloat(childNumber), tripTitle, parseFloat(adultPrice), parseFloat(childPrice), parseInt(id)];
    }

    _hidePrototypes() {
        const defaultSummaryField = document.querySelector('.summary__item--prototype');
        defaultSummaryField.style.display = "none";

        const excursionPrototype = document.querySelector('.excursions__item--prototype');
        excursionPrototype.style.display = 'none';
    }

    _createExcursion(clonedItem, item) {
        let newElement = clonedItem.cloneNode(true);

        newElement.style.display = 'block';
        newElement.querySelector('h2').innerText = item.title;
        newElement.querySelector('p').innerText = item.description;
        newElement.querySelector('.excursions__price-adult').innerText = item.adultPrice;
        newElement.querySelector('.excursions__price-child').innerText = item.childPrice;
        newElement.dataset.id = this.id;

        return newElement;
    }

    _excursionPrototype() {
        return document.querySelector('.excursions__item--prototype');
    }

    _summaryElement() {
        return document.querySelector('.summary');
    }

    _rootElement(item) {
        return item.parentElement.parentElement.parentElement;
    }
}

export default Excursions;