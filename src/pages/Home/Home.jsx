import React, {useState, useEffect} from 'react'
import './Home.css';

//Depedencies
import { Link } from "react-router-dom";
import Axios from "axios";

// Confirmation box
import { useConfirm } from "material-ui-confirm";

//Notification
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from '../../components/Toast/Toast';

// react icon
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as HiIcons from "react-icons/hi";

//components
import ArchivedGroups from '../../components/Groups/ArchivedGroups/ArchivedGroups';

//import Context hook
import { useAuthContext } from '../../Hooks/Auth/useAuthContext'


function Home() {
  // useContext Hook
  const { user } = useAuthContext()
  const confirm = useConfirm();

  //switching page
  const [ switchPage, setSwitchPage ] = useState(false)
  const [ switchArchivedPage, setSwitchArchivedPage ] = useState(false)
  const [ activePage, setActivePage ] = useState(false)
  const [ storeAcadYear, setStoreAcadYear ] = useState();

  // error
  const [ error, setError ] = useState('')

  // add and search logo style
  const [addBtn, setAddBtn] = useState(false);
  const [searchBtn, setSearchBtn] = useState(false); 

  // search bar
  const [ searchBar, setSearchBar ] = useState('');

const [ groupNames, setGroupNames ] = useState()
const handleGroup = async() => {
    const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      }

    //logs all the group names
    await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/group`, Auth)
    .then((response) => {
          console.log(response.data)

          setError('')
          setGroupNames(response.data)

    // catch error
    }).catch((error) => {
        if (error.response) {
            setError(error.response.data.error)
        } 
    })
}

useEffect(() => {
  handleGroup()
}, [])

// group names
const [addGroup, setAddGroup] = useState('');
const storage = (event) => {
  const value = event.target.value;
  setAddGroup(value);
}

// handles the 'addGroup' button
const handleAddGroup = async() => {
    //stops the program if no user is found!
    if(!user) {
      setError('You must be logged in!')
      return
    }

    // post request comment data
    const groupnamesPostData = {
      groups: addGroup
    }

    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    //saving the data
    await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/group`, groupnamesPostData, Auth)
    .then((response) => {
      // api update call
      handleGroup()

      // notification
      Toast(`${addGroup} is CREATED`, 'success');
      
      // clear and call
      setAddGroup("")
      setError('')

  // catch error
  }).catch((error) =>{
      if (error.response) {
          setError(error.response.data.error)
      } 
  })
}

//delete query to database
const deleteGroup = async(id, groups) => {

  if(!user) {
    setError('You must be logged in!')
    return
  }

  confirm({ title: `Do you want to delete ${groups}?`,
       description: `Please note that anything related to this group will be deleted. The comments, created task, progress and manuscripts!`,
       confirmationText: "Delete"
  }).then(async() => {
      // auth
      const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      }
    
      await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/group/${id}`, Auth ).then((response) => {
          if(response.data){
              // notification
              Toast(`${groups} is DELETED`, 'success');
    
              //reset
              setError('')
              handleGroup()
          }
      // catch error
      }).catch((error) => {
          if (error.response) {
              setError(error.response.data.error)
          }   
      })
    
  //cancel confirmation
  }).catch(() => {
          //Notification
          Toast(`The ${groups} deletion is cancelled`, 'info');
  });

  
}

// Archive the group and all its students
const archiveGroup = async(id, groups) => {
  //stops the program if no user is found!
  if(!user) {
    return setError('You must be lgged in!')
  }

  confirm({ title: `Do you want to Archive ${groups}?`,
        description: `Please note that all the students under this group wont be able to login!`,
        confirmationText: "Archive"
  }).then(async() => {
      // post request comment data
      const archiveData = {

      }

      // auth
      const Auth = {
        headers:{
          'Authorization': `Bearer ${user.token}`
        }
      }

      //saving the data
      await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/adviser/archive-group/${id}`, archiveData, Auth)
      .then((response) => {
        handleGroup()

        // notification
        Toast(`${groups} is ARCHIVED`, 'success');
        
        // clear and call
        setError('')

        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })

    //cancel confirmation
    }).catch(() => {
      //Notification
      Toast(`The ${groups} deletion is cancelled`, 'info');
    });


}

return (
  <div className='home'>

    <span className='header-btns'>
      <button 
        onClick={() => {  
            setSwitchPage(false)
            setActivePage(false)
            setSwitchArchivedPage(false)
          }
        }
        className={activePage ? 'groups-btn' : 'groups-btn active-group'}>
          <HiIcons.HiUserGroup  color={activePage ? 'maroon' : 'white' } size={20}/>
      </button> 

      <button 
        onClick={() => {
            setSwitchPage(true)
            setActivePage(true)
          }
        }
        className={activePage ? 'archive-btn active-archive' : 'archive-btn'}>
          <BsIcons.BsFillArchiveFill color={activePage ? 'white' :'green' } size={20}/>
      </button>
    </span>

    <div className='content'>
      

    <section className='cards'> 
    

      { switchPage ? 
        ( switchArchivedPage ?
          // ADVISER: Location is "components/Groups/ArchivedGroups/ArchivedGroups.jsx"
          <ArchivedGroups 
              showGroups={groupNames} 
              academicYear={storeAcadYear && storeAcadYear} 
              searchBar={searchBar} handleGroups={handleGroup}
          /> : 
          <table >
            <thead>
                <tr>
                  <th>#</th>
                  <th>Academic year</th>
                  <th>Buttons</th>
                </tr>
              </thead>

              <tbody>
          {groupNames.academicYear.filter(academicYear => {
            return(
              !academicYear.isArchived &&
              (searchBar === '' || academicYear.academicYear.toLowerCase().includes(searchBar.toLowerCase()) )
            )
          }) 
          .sort((a, b) => a.academicYear.localeCompare(b.academicYear)) // sort by academicYear
          .map((ay, index) => {
            const { academicYear, _id } = ay
            return(
              <tr key={index}>
                <td>{index + 1}</td>
                <td><h4>{academicYear}</h4></td>
                <td>
                  <div className='card-buttons'>
                    <button
                      onClick={() => {
                        setSwitchArchivedPage(true)
                        setStoreAcadYear(academicYear)
                      }}
                    >View</button>
                  </div>
                </td>

              </tr>
            )
          })}
          </tbody>
          </table>
        )
      :
      <table >
        <thead>
            <tr>
              <th>#</th>
              <th>Group Name</th>
              <th>Academic year</th>
              <th>Buttons</th>
            </tr>
          </thead>

          <tbody>
        {groupNames && groupNames.group.filter(group => {
          return(
            !group.isArchived &&
            (searchBar === '' || group.groups.toLowerCase().includes(searchBar.toLowerCase()) ||
            searchBar === '' || group.academicYear.toLowerCase().includes(searchBar.toLowerCase())) 
          )
        }) 
        .sort((a, b) => a.academicYear.localeCompare(b.academicYear)) // sort by academicYear
        .map((group, index) => {
          const { _id, groups, academicYear } = group;
          return (
            <tr>
              <td key={index}>{index + 1}</td>
              <td><h4>{groups}</h4></td>
              <td>{academicYear}</td>
              <td>
                <div className='card-buttons'>
                  <Link 
                    to={'/groups/group'} 
                    state={{ 
                      group_id: _id,
                      groupName: groups
                    }}
                    className='link'
                  >
                    <button>View</button>
                  </Link>

                  <button onClick={() => archiveGroup(_id, groups)}>
                    Archive
                  </button>

                  <button onClick={() => deleteGroup(_id, groups)}>
                    Delete
                  </button>

                </div>
              </td>
            </tr>  
              );
            })}
            </tbody>
          </table>
        }
        
    </section>
      

      <section className='controll'>
        <div className='search-bar'>
          
          <input 
            onChange={(e) => {
              setSearchBar(e.target.value)
            }}
            value={searchBar}
            type="text" 
            placeholder='Search a group...' />

          <span 
            className="search-button"
            onMouseEnter={() => setSearchBtn(true)}
            onMouseLeave={() => setSearchBtn(false)}
          >
            <AiIcons.AiOutlineSearch size="30px"
              color={searchBtn ? 'black' : 'white'}
            />
          </span>
        </div>

          <div className="container">
            <h2>Create a new Group</h2>
            <div className='add-card-group'>
              <input
                onChange={storage} 
                value={addGroup}
                type="text" 
                name="" id="" 
                placeholder='Type your group name...' />
              <span
                onClick={handleAddGroup} 
                className='add-button'
                onMouseEnter={() => setAddBtn(true)}
                onMouseLeave={() => setAddBtn(false)}
              >
                <AiIcons.AiFillPlusSquare 
                  size={40} 
                  color={addBtn ? '#FBBF77' : 'orange'}
                />
              </span>
            </div>
          </div>
          {error ? <p className={error ? 'error' : ''}>{error}</p> : null}
          
      </section>
    </div>
    <ToastContainer />
  </div>
  )
}

export default Home;