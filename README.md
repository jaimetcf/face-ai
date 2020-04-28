# Teach an app to recognize specific faces on images

### Short description
This is a small app that makes something interesting - recognizes faces
taught by the user to the app -, and that can be used as a starting point 
to build a more complex web system.

### Technical stack
The app uses the MERN stack:
- frontend: React.js
- backend: Node.js, Espress, and MongoDB (through mongoose)

The database is hosted on a cloud cluster in Atlas [here](https://www.mongodb.com/)


### App basic workflow:
1. User signs up
2. User selects the 'Teach app' screen
3. In the 'Teach app' screen the user can associate people
   to his(her) profile, by tapping the 'Add Person' button
4. After tapping the 'Add Person' button, the user types a name for this new person 
   and uploads one or more photos for this person. 
   Each image uploaded must contain AT LEAST one, but ONLY this one face.
5. The user can add as many people as he(she) wants to his(her) profile, and also can
   add as many photos as he(she) wants to each person.
   This process is kind of 'introducing' new persons to the App.
6. After adding at least one person to his(her) profile, the user can now go to the 
   'Recognize' screen, and upload images with several faces 'known' or 'unknown' by the app.
7. After each image is uploaded, the app detects and recognizes each known face in the 
   image, marking the known ones with the associated names, and the others with 'unknown'.


### Some advice
The frontend is yet under construction, only 50% built, so pls don't expect it runs,
and the code is still very incomplete. 
I'll upload the final code as soon it's ready!

Nevertheless, you can still run and test the backend part using a tool like [postman](https://www.postman.com/),
for example, to send the API calls and receive the responses. 
You can check the calls syntax on the backend main file: webserver.js


### How to install the app
1. Clone the full /jaimetcf/face-ai.git repo
2. In the backend folder, type:
```
   npm install
```
This will install all the dependencies needed for running the backend.

3. Also, in the frontend folder, type:
```
   npm install
```
This will install all the dependencies needed for running the frontend.


### How to run the app
4. In the backend folder, type:
```
   node webserver.js
```
The server will:
- load tensorflow libraries, 
- load face recognition models,
- connect to the database in the remote Atlas Cluster

So, this may take around 30 seconds, or a bit more...

When you see the message: 
```
Listening on port 5000!
```
that means the webserver is ready to receive and process the http API calls 
comming from the frontend.


5. In the frontend folder, type:
```
   npx start
```
This will be enough to start the react.js development server, and open a new tab in your 
web browser where the app user interface will appear. 
This may take some time also.

6. Have fun cloning and upgrading this app!

7. You can reach me thru: jaimetcf@gmail.com




```
Citations:

1. I am using Vincent Mühler's face-api JavaScript library for detecting and recognizing faces. It is built on top of tensorflow.js core, and implements several CNNs (Convolutional Neural Networks) to solve face detection, face recognition and face landmark detection, and is optimized for the web and mobile devices.
You can find it here: [https://github.com/justadudewhohacks/face-api.js](https://github.com/justadudewhohacks/face-api.js)

```
