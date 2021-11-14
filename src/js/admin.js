import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';
const api = new ExcursionsAPI();

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadExcursions();

    const elementPrototype = document.querySelector('.excursions__item--prototype');
    elementPrototype.style.display = 'none';
    const form = document.querySelector('.form');
    const excursionList = document.querySelector('.excursions');
    excursionList.addEventListener('click', editOrRemoveElement);
    form.addEventListener('submit', addNewExcursion);
}

function editOrRemoveElement(ev) {

    const current = ev.target;
    const parentElement = current.parentElement.parentElement.parentElement;

    if(current.classList.contains('excursions__field-input--remove')) {
        removeExcursion(parentElement, ev);
    }
    else if (current.classList.contains('excursions__field-input--update')){
        updateExcursion(current, parentElement, ev);
    }
}

function removeExcursion(parentElement, event) {
    const id = parentElement.dataset.id;
    const deleteConfirmed = confirm ('Do you really want to delete this trip?');
    
    if(deleteConfirmed) {
        api.removeData(id)
            .catch (err => {
                console.log(err)
            })
            .finally (loadExcursions())
    }
    else {
        event.preventDefault();
    }
}

function updateExcursion(current, parentElement, event) {
    event.preventDefault();
    console.log(current)
    const editableElements = parentElement.querySelectorAll(".editable");
    const isEditable = [...editableElements].every(element => element.isContentEditable);

    if(isEditable) {
        const id = parentElement.dataset.id;
        const data = {
            title: editableElements[0].innerText,
            description: editableElements[1].innerText,
            adultPrice: editableElements[2].innerText,
            childPrice: editableElements[3].innerText
        }

        api.updateData(id, data)
            .catch(err => console.log(err))
            .finally(() => {
                current.value = 'edytuj';
                editableElements.forEach( element => element.contentEditable = false);
            });

    }
    else {
        current.value = 'save';
        editableElements.forEach( el => el.contentEditable = true);
    }
}

function loadExcursions() {

    api.loadData()
        .then(data => insertExcursion(data))
        .catch(err => console.log(err))
        .finally(console.log('Excursions downloaded'));
}

function insertExcursion(data) {
    const excursionList = document.querySelector('.excursions');
    const excursionPrototype = document.querySelector('.excursions__item--prototype');
    excursionList.innerHTML = ''; 

    data.forEach( el => {
        const excursionItem = excursionPrototype.cloneNode(true);
        excursionItem.style.display = 'block';
        excursionItem.querySelector('h2').innerText = el.title;
        excursionItem.querySelector('p').innerText = el.description;
        excursionItem.querySelector('.excursions__field-price-adult').innerText = el.adultPrice;
        excursionItem.querySelector('.excursions__field-price-child').innerText = el.childPrice;
        excursionItem.dataset.id = el.id;
        
        excursionList.appendChild(excursionItem);
    })
}

function addNewExcursion(ev) {
    // ev.preventDefault();
    const [tripTitle, tripDescription, tripAdultPrice, tripChildPrice] = ev.target.elements;

    const data = {
        title: tripTitle.value, 
        description: tripDescription.value,
        adultPrice: tripAdultPrice.value,
        childPrice: tripChildPrice.value
    }
    
    if (data.title.length >= 1 && data.description.length >= 1 && data.adultPrice.length >= 1 && data.childPrice.length >= 1 ) {
        createElement(data);
        sendElementData(data);
    }
    else {
        alert('Please, insert values');
        ev.preventDefault();
    }
}

function createElement(data) {
    const elementPrototype = document.querySelector('.excursions__item--prototype');
    const newElement = elementPrototype.cloneNode(true);
    newElement.style.display = 'none';
    newElement.querySelector('h2').innerText = data.title;
    newElement.querySelector('p').innerText = data.description;
    newElement.querySelector('.excursions__field-price-adult').innerText = data.adultPrice;
    newElement.querySelector('.excursions__field-price-child').innerText = data.childPrice;
        
    elementPrototype.appendChild(newElement);
}

function sendElementData(data) {

    api.addData(data)
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(loadExcursions());
}