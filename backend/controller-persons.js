////////////////////////////////////////////////////////////////////////////////////////
// This file contains the functions that treat endpoints associated with the Person model
////////////////////////////////////////////////////////////////////////////////////////

//--------------------------------------------------------------------------------------
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('./http-error');
const User      = require('./model-user');
const Person    = require('./model-person');
const Photo     = require('./model-photo');
//--------------------------------------------------------------------------------------


// Creates a new person in the database, with userId, and
// personName passed as parameters in the message body
const createPerson = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const { userId, personName } = req.body;  // Gets params from the post message
        console.log('userId='+userId+'  personName='+personName);
        return next( new HttpError('Invalid inputs passed, please check your data.', 422) );
    }

    const { userId, personName } = req.body;  // Gets params from the post message
  
    // Reads the specified User document
    User.findById(userId).then( async (user) => {

        if (!user) {
            // currentUser was not found in database
            return next( new HttpError('Current user not found in database.',  422 ) );
        }

        const createdPerson = new Person({
            user_id: user.id,
            name: personName,
            photos: []
        });

        // Adds the new User document to database
        try {
              const sess = await mongoose.startSession();
              sess.startTransaction();
              // ATTENTION: ENSURE THERE IS A COLLECTION NAMED 'people' in mongodb.
              // Otherwise, the line immediately bellow will throw an error
              await createdPerson.save({ session: sess });
              user.persons.push(createdPerson);
              await user.save({ session: sess });
              await sess.commitTransaction();
        } catch (err) {
            return next( new HttpError('Adding new Person failed, please try again.', 500) );
        }

        console.log('Added person => ' + createdPerson);
        res.status(201).json(createdPerson.toObject({getters: true}));
  
    }).catch( (err) => {
        // Problems in database
        return next( new HttpError('Adding new Person failed, please try again.', 422) );
    });

};

// Returns all Person documents in the userId.persons list
// userId is passed as parameter in the message body
const readUserPeople = async (req, res, next) => {

    const { userId } = req.body;  // Gets params from the post message

    // Reads the specified User document, reading also 
    // the Person documents in the user.persons list
    User.findById(userId).populate('persons').then( async (user) => {

        if (!user || user.persons.length === 0) {
            // Found no user, or user.persons list is empty
            return next( new HttpError('Found no person in the specified user.', 404) );
        }
    
        // Reads the url of the first Photo document under each Person, if any
        var person; var photo;
        for( var i=0; i<user.persons.length; i++ ) {
            person = user.persons[i];

            if(person.photos[0] !== undefined ) {
                try {
                    // Reads the first Photo document under each Person  
                    photo = await Photo.findById(person.photos[0]);
                } catch (err) {
                    return next( new HttpError('Problem accessing database, reading Photo.', 404) ); 
                }
                if(!photo) { return next( new HttpError('Photo not found.', 404) ); }

                person.photos[0] = photo.url;  // Replaces photo id by photo url
            }          
            console.log(person);
        }

        const people = user.persons.map( (person) => { return( person.toObject({getters: true}) ); });
        
//        console.log(people);
        res.json(people);
    
    }).catch( (err) => {
        return next(new HttpError('Problem accessing database, please try again.', 500) );
    });
}

/*
// Returns all Person documents in the userId.persons list
// userId is passed as parameter in the message body
const readUserPeople = async (req, res, next) => {

    const { userId } = req.body;  // Gets params from the post message

    console.log('Reading user:' + userId + ' people');

    // Reads the specified User document, reading also 
    // the Person documents in the user.persons list
    User.findById(userId).populate('persons').then( (user) => {

        if (!user || user.persons.length === 0) {
            // Found no user, or user.persons list is empty
            return next( new HttpError('Found no person in the specified user.', 404) );
        }
    
        const people = user.persons.map( (person) => person.toObject({ getters: true }) );
        console.log(people);
        res.json(people);
    
    }).catch( (err) => {
        return next(new HttpError('Problem accessing database, please try again.', 500) );
    });
}
*/

// Returns the Person document which personId is
// passed as parameter in the message body
const readPerson = async (req, res, next) => {

    const { personId } = req.body;  // Gets personId from the message body

    // Reads the Person document personId in the database
    Person.findById(personId).then( (person) => {
        
        if (!person) {
            return next( new HttpError('Could not find the person with the specified id.', 404) );
        }
 
        res.status(201).json(person);

    }).catch( (err) => {
        return next( new HttpError('Problem accessing database. Please try again.', 500) );
    });      
}

// Deletes the Person document referenced by the
// personId passed as parameter in the message body
const deletePerson = async (req, res, next) => {
    
    const { personId } = req.body; // Gets personId from the post message
  
    // Reads personId document from the database. We need that the User 
    // document, referenced by user_id, be also read from the database.
//    Person.findById(personId).populate('user_id').then( async (person) => {
    Person.findById(personId).then( async (person) => {
        
        if (!person) {
            return next( new HttpError('Could not find the person with the specified id.', 404) );
        }

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await person.remove({ session: sess });
            const user = await User.findById(person.user_id);
            if(!user)  { return next( new HttpError('Could not delete person. Did not find user.', 500) ); }
            user.persons.pull(person); // Removes this person from user.persons list
            await user.save({ session: sess });
//            person.user_id.persons.pull(person); // Removes this person from user_id.persons list
//            await person.user_id.save({ session: sess });
            await sess.commitTransaction();

        } catch (err) {
            return next( new HttpError('Could not delete person. Problem accessing database.', 500) );
        }
  
        res.status(200).json({ message: 'Deleted person.' });

    }).catch( (err) => {
        return next( new HttpError('Problem accessing database. Please try again.', 500) );
    });      
}
  

exports.createPerson    = createPerson;
exports.readPerson      = readPerson;
exports.readUserPeople  = readUserPeople;
exports.deletePerson    = deletePerson;
