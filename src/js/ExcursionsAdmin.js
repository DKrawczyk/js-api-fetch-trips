class ExcursionsAdmin {
    constructor(api) {
        this.apiProvider = api;
    }

    loadExcursions() {
        this._hidePrototypes();

        this.apiProvider.loadData()
        .then(data => this._insertExcursion(data))
        .catch(err => console.log(err))
        .finally(console.log('Excursions downloaded'));
    }

    editOrRemoveElement() {
        const excursionList = document.querySelector('.excursions');
        excursionList.addEventListener('click', ev => {
            this._checkToEditOrRemove(ev)
        });
    }

    addExcursion() {
        const form = document.querySelector('.form');
        form.addEventListener('submit', ev => {
            this._newExcursion(ev);
        });
    }

    _newExcursion(ev) {
         // ev.preventDefault();
        const [tripTitle, tripDescription, tripAdultPrice, tripChildPrice] = ev.target.elements;

        const data = {
            title: tripTitle.value, 
            description: tripDescription.value,
            adultPrice: tripAdultPrice.value,
            childPrice: tripChildPrice.value
        }
        
        if (data.title.length >= 1 && data.description.length >= 1 && data.adultPrice.length >= 1 && data.childPrice.length >= 1 ) {
            this._createElement(data);
            this._sendElementData(data);
        }
        else {
            alert('Please, insert values');
            ev.preventDefault();
        }
    }

    _createElement(data) {
        const elementPrototype = document.querySelector('.excursions__item--prototype');
        const newElement = elementPrototype.cloneNode(true);
        newElement.style.display = 'none';
        newElement.querySelector('h2').innerText = data.title;
        newElement.querySelector('p').innerText = data.description;
        newElement.querySelector('.excursions__field-price-adult').innerText = data.adultPrice;
        newElement.querySelector('.excursions__field-price-child').innerText = data.childPrice;
            
        elementPrototype.appendChild(newElement);
    }

    _sendElementData(data) {
        this.apiProvider.addData(data)
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(this.loadExcursions());
    }

    _checkToEditOrRemove(ev){
        const current = ev.target;
        const parentElement = this._rootElement(current);
        
        if(current.classList.contains('excursions__field-input--remove')) {
            this._removeExcursion(parentElement, ev);
        }
        else if (current.classList.contains('excursions__field-input--update')){
            this._updateExcursion(current, parentElement, ev);
        }
    }

    _rootElement(current){
        return current.parentElement.parentElement.parentElement;
    }

    _removeExcursion(root, event) {
        const id = root.dataset.id;
        const deleteConfirmed = confirm ('Do you really want to delete this trip?');
    
        if(deleteConfirmed) {
            this.apiProvider.removeData(id)
                .catch (err => {
                    console.log(err)
                })
                .finally (this.loadExcursions());
        }
        else {
            event.preventDefault();
        }
    }

    _updateExcursion(current, parentElement, event){
        event.preventDefault();
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
    
            this.apiProvider.updateData(id, data)
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

    _hidePrototypes(){
        const elementPrototype = document.querySelector('.excursions__item--prototype');
        elementPrototype.style.display = 'none';
    }

    _insertExcursion(data) {

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
        });
    }
}

export default ExcursionsAdmin;