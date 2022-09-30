'use strict';

class User {
    constructor(id, email, name, surname, type) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.type = type;
    }
}

module.exports = User;