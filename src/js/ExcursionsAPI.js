class ExcursionsAPI {

    constructor() {
        this.excursionURL = 'http://localhost:3000/excursions';
        this.orderURL = 'http://localhost:3000/orders';
    }

    loadData() {
        return this._fetch(this.excursionURL);
    }

    addData(data) {

        const options = {
            method: 'POST', 
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }

        return this._fetch(this.excursionURL, options);
    }

    addOrder(data) {
        const options = {
            method: 'POST', 
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }

        return this._fetch(this.orderURL, options);
    }

    removeData(id) {

        const options = { method: 'DELETE' };

        return this._fetch(this.excursionURL, options, `/${id}`);
    }

    updateData(id, data) {

        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }

        return this._fetch(this.excursionURL, options, `/${id}`);
    }
    
    _fetch(path, options, additionalPath = '') {
        const url = path + additionalPath;

        return fetch (url, options)
            .then(resp => {
                if(resp.ok) {

                    return resp.json();
                }

            return Promise.reject(resp);
        });
    }
}

export default ExcursionsAPI;