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
        const element = this._excursionList();
        const excursionPrototype = this._excursionPrototype(); 
        element.innerHTML = '';
        
        data.forEach( el => {
            element.appendChild(this._createExcursion(excursionPrototype, el));
        });
    }

    orderTrip() {
        const addExcursion = this._excursionList()
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

    _excursionList() {
        return document.querySelector('.excursions');
    }

    _userOrder(ev) {
        const [name, email, regex] = this._purchaserData(ev);
        let errorValidation = [];
        const excursionItems = document.querySelectorAll('.summary__item');
            
        if(excursionItems.length >= 2) { // <- dwie, żeby liczyć też prototype
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
        }
        else {
            ev.preventDefault();
            alert('Please, choose at least one excursion');
            errorValidation.push('Please, choose at least one excursion')
        }

        if(errorValidation.length > 0) {
            ev.preventDefault();
        }
        else {
            // ev.preventDefault();
            this._sendOrder(this._orderInfo(name, email));
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

    _orderInfo(name, email) {
        const data = {
            purchaser:name,
            purchaserEmail: email,
            cart: this.basket
        }
        return data;
    }

    _purchaserData() {
        const nameAndSurname = document.querySelector('input[name="name"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const regexName = /^[\w'\-,.][^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

        return [nameAndSurname, email, regexName];
    }

    _removeExcursion(item, ev) {
        if(item.tagName === "A") {
            const userConfirm = confirm('Are you sure?');
            if(userConfirm) {

                this._updateBasket(this._rootElement(item));
                this._defaulBorder(item);

                this._rootElement(item).remove();
                
                // console.log(test);
                this._getPrice();
                console.log(this.basket);
            }
            else {
                ev.preventDefault();
            }
        }
    }

    _updateBasket(current) {

        let test = parseFloat(current.dataset.id);

        for (let i=0; i<this.basket.length; i++) {

            if(this.basket[i].id === test) {
                this.basket.splice(i, 1);
            }
        }
        return this.basket;
    }

    _defaulBorder(item) {           //  <---        TO JEST W FAZIE PROTOTYPU, BĘDĘ TO UDOSKONALAŁ :D
                                        
        if(this.basket.length === 0) {
            const excursionsArray = document.querySelectorAll('.excursions__item');

            excursionsArray.forEach( el => {
                el.style.border = '1px solid black';
                el.style.boxShadow = '0px 0px 10px 3px rgb(0 0 0 / 50%)';
            });
        }
    }                               // <---

    _dataValidation(item) {
        const [tripTitle, adultPrice, childPrice, adultNumber, childNumber] = this._memberDatas(item);

        if (adultNumber > 0 || childNumber > 0) {
            if(isNaN(adultNumber) === false && isNaN(childNumber) === false) {
                item.parentElement.style.border = '1px solid green';
                item.parentElement.style.boxShadow = '0px 0px 10px 3px green';
                const description = item.parentElement.querySelector('.excursions__description').textContent;
                const tripData = this._singleExcursion(tripTitle, adultPrice, childPrice, adultNumber, childNumber);
                this.id++;
                this._getPrice();

                tripData.description = description;
                this.basket.push(tripData);
            }
            else 
            alert('Please, insert correct values');
        }
        else {
            alert('Please, insert values')
        }  
    }

    _getPrice() {
        const singlePrice = document.querySelectorAll('.summay__total-price');
        const pricesArray = [];
    
        singlePrice.forEach((el) => {
            if(!el.parentElement.parentElement.parentElement.className.includes('summary__item--prototype')) {
                pricesArray.push(parseInt(el.textContent));
            }
        });
        
        this._setPrice(pricesArray);
    }

    _setPrice(prices) {
        const totalPrice = document.querySelector('.order__total-price-value')
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
    
        newExcursion.dataset.id = this.id;
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

        return [tripTitle, parseFloat(adultPrice), parseFloat(childPrice), parseFloat(adultNumber), parseFloat(childNumber)];
    }

    _hidePrototypes() {
        const defaultSummaryField = document.querySelector('.summary__item--prototype');
        defaultSummaryField.style.display = "none";

        const price = document.querySelector('.order__total-price-value');
        price.innerText = '0PLN';

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
        newElement.dataset.id = item.id;

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