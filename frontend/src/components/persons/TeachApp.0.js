import './TeachApp.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


// Persons list for testing purposes
var   personsList = [
	{id:1, name:'Natalie', 
	 photos:[ 'https://www.natalieportman.com/image-gallery/?parentId=32255',
			  'https://www.natalieportman.com/image-gallery/?parentId=32255',
			  'http://famous-myersbriggs.tumblr.com/search/ISTJ'             
			]
	},
	{id:2, name:'Taylor', 
	 photos:[ 'https://cdn.rttnews.com/articleimages/ustopstories/2018/march/taylor-swift-032218-lt.jpg',
			  'https://img.jakpost.net/c/2019/07/24/2019_07_24_76830_1563938895._large.jpg'
			 ]
	}
];

const TeachApp = (props) => {

  // Initializes component state
  const [ knownPersons, setKnownPersons] = useState({
   	persons: personsList
  });

  const getKnownPersons = async () => {
  	// Loads dummy persons for testing. This will be replaced by a fetch
    setKnownPersons({ persons:personsList});
  }

  if( knownPersons.length === 0 ) {
	return(
	  <h2>App knows no person yet!</h2>
	);
  }

  return (
	<div>
      <h2>Persons known</h2>
	  <div id='personsMenuDiv'>
	    <table id="personsMenu">
		  <thead>
		    <tr>
			  <th>Person name</th>
			  <th>Photos</th>
			</tr>
		  </thead>
		  <tbody>
		    {userPersons.persons.map( (person) => {
			  return(
    	        <tr key={person.id}>
              	  <td><Link to={`/teachapp/person/${person.id}`}>{person.name}</Link></td>
              	  <td>{person.photos.length}</td>
                </tr>
			  );
			})}
		  </tbody>
	    </table>
	  </div>
    </div>
  );
};


export default  TeachApp;