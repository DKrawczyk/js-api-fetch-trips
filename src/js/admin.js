import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';
import ExcursionsAdmin from './ExcursionsAdmin';

document.addEventListener('DOMContentLoaded', init);

function init() {
    const api = new ExcursionsAPI();
    const excursionsAdmin = new ExcursionsAdmin(api);

    excursionsAdmin.loadExcursions();
    excursionsAdmin.editOrRemoveElement();
    excursionsAdmin.addExcursion();
}