# Teach an app to recognize specific faces on images

## Short description
This is a small app that makes something interesting (recognizes faces
taugh by the user to the app), and that can be used as a starting point 
blueprint to build more complex web systems.

## Technical stack
The app uses the MERN stack:
frontend: React.js
backend: Node.js, Espress, and MongoDB (through mongoose)

The database is hosted on a cloud cluster in Atlas [here](https://www.mongodb.com/)


## App basic workflow:
1. The user signs up
2. The user selects the 'Teach app' screen
3. In the 'Teach app' screen the user can associate people
   to his(her) profile, by tapping the Add Person button
4. To add a person the user types a name for this new person and uploads one 
   or more photos for this person. Each image uploaded must contain only one face.
5. The user can add as many people as he(she) wants to his(her) user, and also can
   add as many photos as he(she) wants to each person. 
   This process is kind of 'introducing' new persons to the App.
6. After adding at least one person to his(her) profile, the user can now go to the 
   Recognize screen, and upload images with or without faces 'known' or 'unknown'
   by the app.
7. After each image is uploaded, the app detects and recognizes each face in the 
   image, marking the known ones with the associated names.


## Some advice
The frontend is yet under construction, only 50% built, so pls don't expect it runs,
and the code is still very incomplete. I'll upload the final code as soon it's ready!


## How to install the app
1. Clone the full face-ai repo
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


## How to run the app
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
that means the webserver is ready to receive and process the REST API calls 
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

```