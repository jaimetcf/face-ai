// This class is used to save and manage info associated with the current user logged in
// Since React does not provide a nice way create global variables, I 'encapsulate' the
// variables below, that can be accessed by all instances of the User class

var userState = false;   // = true, if there's a user currently logged in
var userId = '';
var userName = '';
var userPeople = [];     // To cache people data read from database


class  User {

    constructor(props) {

        this.setState  = this.setState.bind(this);
        this.setId     = this.setId.bind(this);
        this.setName   = this.setName.bind(this);
        this.setPeople = this.setPeople.bind(this);

        this.getState  = this.getState.bind(this);
        this.getId     = this.getId.bind(this);
        this.getName   = this.getName.bind(this);
        this.getPeople = this.getPeople.bind(this);
    }

    setState(state)   { userState = state;   }
    setId(id)         { userId = id;         }
    setName(name)     { userName = name;     }
    setPeople(people) { userPeople = people; }
    
    getState()   { return(userState);   }
    getId()      { return(userId);      }
    getName()    { return(userName);    }
    getPeople()  { return(userPeople);   }
}


export default   User;