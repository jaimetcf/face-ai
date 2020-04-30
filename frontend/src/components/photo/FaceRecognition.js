import  {faceapi} from  '../../../node_modules/face-api.js/dist/face-api';


//const ssdMobilenetv1_path = 'http://localhost:3000/public/models';
const ssdMobilenetv1URL = 'https://drive.google.com/open?id=16RGuFaS9KcCrhx8dsjGFm0A3ygrJFEZv';

class FaceRecognition {

	constructor() {

        this.detectionResults    = null;

        this.loadSsdMobilenetV1  = this.loadSsdMobilenetV1.bind(this);
        this.findFaces           = this.findFaces.bind(this);
	}

    async loadSsdMobilenetV1() {

        console.log('Loading SSD-MobilenetV1 model from URL ... pls, wait!');
//      console.log('Loading SSD-MobilenetV1 model locally ... pls, wait!');
        await faceapi.nets.ssdMobilenetv1.loadFromUri(ssdMobilenetv1URL);
//      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//      await faceapi.nets.faceRecognitionNet.loadFromUri('/models')

        console.log('Successfully loaded SSD-MobilenetV1 model!');
    }

    async findFaces(canvas) {

        console.log('Detecting faces... pls, wait!');
        this.detectionResults = await faceapi.detectAllFaces(canvas);

        return( this.detectionResults );
    }

}


export default FaceRecognition;