# Excursions API&Fetch Project 

![Excursions Panel UI](https://github.com/DKrawczyk/js-api-fetch-trips/blob/main/assets/preview.png?raw=true)


Thanks for viewing my repository! This project allows you to purchase excursions by typing the number of participants. Whereas, administration panel is made to ensure control over your excursions.

# Installation

The project uses [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/). To run this project, you must first install all necessary packages. After this, you should turn on our **JSON Server**. Let's start:

First, install all packages implemented in package.json:

    npm i

Second - after this, you can start our website:

    npm start

Now you can see the main website where you can order excursions.
The main panel is available at this address:

    http://localhost:8080/index.html

Also at this address, you can see the administration panel:

    http://localhost:8080/admin.html

On this site, you have access to edit, add or remove excursions. These links will show you the current database.

### Current excursions on your web:

    http://localhost:3000/excursions

### Ordered excursions by clients:

    http://localhost:3000/orders


# Solutions provided in the project

- Webpack configurated to watch and refresh all CSS and JS files,

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader',

                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: ['style-loader', 'css-loader'],
                }
            ]
        }

- Local **API** made by **JSON Serve**r, available in **./data/excursions.json**
- Basic *animations* made in **CSS**, for example:

        .order__field--submit:hover .shine {
            transform: skewX(20deg) translateX(285px);
        }

        .shine {
            position: absolute;
            ...
            transition: all .4s linear;
            transform: skewX(20deg) translateX(0);
        }

- Arrow functions, classes compatible with ES6 standard,
- Fetch API which allows to send requests and responses,

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

- Regular expressions, for example:

        const regexName = /^[\w'\-,.][^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
        ...
        if(regex.test(name) === true) {
            return true;
        }

- This project use **CRUD** functionality. Administrator panel allow you to delete/add/edit every excursion,

- Validation which doesn't allow to send incorrect data, like invalid emails or wrong information about the purchaser

- Basic refactoring, according to **DRY** rule. Because of this, we can avoid repeating our code:

        loadData() {
            return this._fetch(this.excursionURL);
        }


        function init() {
            const api = new ExcursionsAPI();
            const excursions = new Excursions(api);

            excursions.load();
            excursions.orderTrip();
            excursions.remove();
            excursions.order();
        }


# Conclusions for future projects

I read about destructuring and spread operators which allow me to make code shorter and more readable. This project could be compatible with the **RWD design**. Also, the next project would be styling after using a basic reset.css file, which makes styling easier.

The next step would get rid of the problem with the green border around the clicked excursion. This border would be invisible when excursion won't be in the cart. 
**Function _defaultBorder** is in the protoype phase.


# 🙏 Special thanks
Special thanks to my [Mentor - devmentor.pl](https://devmentor.pl/) for providing me with the task and code review.
