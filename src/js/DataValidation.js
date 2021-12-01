class DataValidation {
    constructor() {

    }

    isExcursionTyped(element, error) {
        if(element >= 1) {
            return true;
        }
        else {
            return error;
        }
    }

    isPurchaserInformationCorrect(name, email, error) {
        if(name > 1 && email > 1) {
            return true;
        }
        else {
            return error;
        }
    }

    isUserDataCorrect(regex, name, error) {
        if(regex.test(name) === true) {
            return true;
        }
        else {
            return error;
        }
    }

    isEmailCorrect(email, error) {
        if(!email.includes('@')) {
            return error;
        }
    }

    isNumberOfMembers(adult, child, error) {
        if(adult > 0 || child > 0) {
            return true;
        }
        else {
            return error;
        }
    }

    isMembersDataCorrect(adult, child, error) {
        if(isNaN(adult) === false && isNaN(child) === false) {
            return true;
        }
        else {
            return error;
        }
    }
}

export default DataValidation;