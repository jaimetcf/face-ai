/////////////////////////////////////////////////////////////////////////////
// This class just provides simulated data for the app, enabling the test
// of this frontend without the connection to the node server

const  peopleList = [
    
    {id:0, 
     name:'Natalie', 
     photos:[ {id:0, url:'https://66.media.tumblr.com/b92b6fe4ef749ea159744d594aa7b5f8/e86723cbda4322da-91/s500x750/f41738f682be7a5f753d33770cb124a5e94afe0c.jpg'},
              {id:1, url:'https://www.natalieportman.com/image-gallery/?parentId=32255'} 
            ]
    },
    {id:1, 
     name:'Taylor', 
     photos:[ {id:0, url:'https://cdn.rttnews.com/articleimages/ustopstories/2018/march/taylor-swift-032218-lt.jpg'},
              {id:1, url:'https://img.jakpost.net/c/2019/07/24/2019_07_24_76830_1563938895._large.jpg'}              
            ]
    },
    {id:2, 
     name:'Sean', 
     photos:[ {id:0, url:'https://media.fstatic.com/TMs_KpMv_CL5X5QlDXF_IFnedQQ=/full-fit-in/290x478/media/artists/avatar/2012/12/sean-connery_a403.jpg'},
              {id:1, url:'https://media.fstatic.com/7eRs58mE5rwzVNP5SE7Icz-l2FY=/full-fit-in/290x478/media/artists/avatar/2014/09/sean-connery_a403.jpg'},
              {id:2, url:'https://successfulpeeps.files.wordpress.com/2015/11/media.jpg'}             
            ]
    }
];

class  SimServer {

    constructor(props)
    {
        this.peopleList = peopleList;
        
    }

    fetchUserPeople = () =>  {  return( this.peopleList );  }

    fetchUserPerson = (index) =>  {  return( this.peopleList[index] );  }

}

export default  SimServer;