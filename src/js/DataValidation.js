class DataValidation {
    constructor() {

    }

    isExcursionTyped(element) {
        if(element >= 1) {
            return true;
        }
        else {
            return false;
        }
    }

    isPurchaserInformationCorrect(name, email) {
        if(name > 1 && email > 1) {
            return true;
        }
        else {
            return false;
        }
    }

    isUserDataCorrect(regex, name) {
        if(regex.test(name) === true) {
            return true;
        }
        else {
            return false;
        }
    }

    isEmailCorrect(email) {
        if(email.includes('@')) {
            return true;
        }
        else {
            return false;
        }
    }

    isNumberOfMembers(adult, child, alert) {
        if(adult > 0 || child > 0) {
            return true;
        }
        else {
            return alert;
        }
    }

    isMembersDataCorrect(adult, child, alert) {
        if(isNaN(adult) === false && isNaN(child) === false) {
            return true;
        }
        else {
            return alert;
        }
    }
}

export default DataValidation;