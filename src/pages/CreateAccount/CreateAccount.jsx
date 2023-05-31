import React, {useState, useEffect} from 'react'
import './CreateAccount.css'
import Axios from "axios";

// Confirmation box
import { useConfirm } from "material-ui-confirm";

// icons
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";

//Notification
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Hook
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

// Components
import Toast from '../../components/Toast/Toast';

function CreateAccount() {
    const { user } = useAuthContext();
    const confirm = useConfirm();

    // seacr bar
    const [searchBtn, setSearchBtn] = useState(false);
    const [ searchBar, setSearchBar ] = useState('');

    // success
    const [accountSuccess, setAccountSuccess] = useState('')

    // error
    const [error, setError] = useState('')
    const [error2, setError2] = useState('')
    const [error3, setError3] = useState('')
    const [error4, setError4] = useState('')

    //Form Data
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    // creating dropdown for section and academic year
    const [ section, setSection] = useState('')
    const [ sectionList, setSectionList ] = useState(null)
    const [ academicYear, setAcademicYear] = useState('')
    const [ academicYearList, setAcademicYearList ] = useState(null)

    // create Year and Section || use delete section and academic year
    const [getAcademicYear, setGetAcademicYear] = useState('');
    const [getSection, setGetSection] = useState('');
    const [getAdviser, setGetAdviser] = useState('');
    const [getAdviser_id, setGetAdviser_id] = useState('');


    // Creating adviser account
    const handleSubmit = async() => {

        setAccountSuccess('') 

        if( !email || !name || !password ) {
            return setError('Please fill in all the fields!')
        }

        // post request comment data
        const adminData = {
            name: name,
            password: password,
            email: email,
        }
    

        //posting query to database
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/admin/register`, adminData).then((response) => {
            setAccountSuccess(`${name} Account is succesfuly created`)
            setError('')
            showAllSections()

            //Notification
            Toast(`${name} Account and notification email is sent `, 'success');

            // reset states
            setError('')
            setName('')
            setEmail('')
            setPassword('')

        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })
    }

    const deleteAdviser = async() => {

        if(!getAdviser_id){
            return setError3('No Adviser account selected!')
        }

        confirm({ title: `Do you want remove ${getAdviser}'s Account?`,
                description: `Please note that this will permanently remove ${getAdviser} Account!`,
                confirmationText: "Delete"
        }).then(async() => {

            //auth
            const Auth = {
                headers:{
                  'Authorization': `Bearer ${user.token}`
                }
              }
            
            // delete request
            await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/admin/delete-adviser/${getAdviser_id}`, Auth)
                .then((response) => {
                    //Notification
                    Toast(`Adviser Account: ${getAdviser} is deleted`, 'success');
    
                    // reset
                    setError3('')
                    showAllSections()
                    
                // catch error
                }).catch((error) => {
                    if (error.response) {
                        setError3(error.response.data.error)
                    }   
                })

        // catch confirmation cancel 
        }).catch(() => {
            //Notification
            Toast(`You cancelled the account deletion`, 'info');
        });

      
    }

    // Logging all the Created sections
    const showAllSections =  async() => {

        // Authorization header
        const Auth = {
            headers:{
              'Authorization': `Bearer ${user.token}`
            }
        }

        //saving the data
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/dean/sections`, Auth)
        .then((response) => {
            setSectionList(response.data)
            // clear and call
            setError('')
            
        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })
    }

    useEffect(() => {
            showAllSections()    
    }, [])

    // Creating a section option
    const addSection = async() => {
        
        //stops the program if no user is found!
        if(!user) {
            return setError4('You must be lgged in!')
        }

        // Validation check
            // Required to be all caps and expect to have a "-"
            if (!/^[A-Z0-9]+-[A-Z0-9]+$/.test(section)) {
                // Display an error message
                return setError4("Year and section must be in the format of 'BSIT-4C' (all capital letters with a single dash '-', no spaces)")
            }

        // post request comment data
        const sectionData = {
            section: section
        }

        // auth
        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }

        //saving the data
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/dean/section`, sectionData ,Auth)
        .then((response) => {
            // clear and call
            setError4('')
            setSection('')

            //Notification
            Toast(`Section: ${section} is created`, 'success');

            // refresh sections list
            showAllSections()
        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError4(error.response.data.error)
            } 
        })
    }

    // Delete a Section option
    const deleteSection = async() => {

        // if the value of getSection
        if(!getSection){
            return setError3('No Section selected! Here')
        }

        // confirmation
        confirm({ title: `Do you want remove section: ${getSection}?`,
                description: `Please note that this will permanently remove ${getSection}.`,
                confirmationText: "Delete"
        }).then(async() => {

            //auth
            const Auth = {
                headers:{
                  'Authorization': `Bearer ${user.token}`
                }
              }
            
            // delete request
            await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/dean/section/${getSection}`, Auth).then((response) => {
                if(response.data){
                    // reset
                    setError3('')
                    showAllSections()
    
                    //Notification
                    Toast(`The Section: ${getSection} is deleted`, 'success');
                }
            // catch error
            }).catch((error) => {
                if (error.response) {
                    setError3(error.response.data.error)
                }   
            })
        
        // confirmation cancel
        }).catch(() => {
            //Notification
            Toast(`You cancelled ${getSection} deletion`, 'info');
        });

        
    }


    // Logging all the Created Academic Years
    const showAllAcademicYears =  async() => {

        //saving the data
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/dean/academic-years`).then((response) => {
            setAcademicYearList (response.data)
            // clear and call
            setError('')
            
        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })
    }

    useEffect(() => {
        showAllAcademicYears()
    },[])

    // Creating a Academic Year option
    const addAcademicYear = async() => {

        //stops the program if no user is found!
        if(!user) {
            return setError4('You must be logged in!')
        }

        // Validation check
            // Required to be all caps and expect to have a "-"
            if (!/^[0-9]+-[0-9]+$/.test(academicYear)) {
                // Display an error message
                return setError4("Academic Year must be in the format of '2022-2023' (all numbers with '-', no spaces)")
            }
        
        // post request comment data
        const academicYearData = {
            academicYear: academicYear
        }

        // auth
        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }

        //saving the data
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/dean/academic-year`, academicYearData, Auth)
        .then((response) => {
            // clear and call
            setError4('')
            setAcademicYear('')
            //Notification
            Toast(`Academic Year: ${academicYear} is create`, 'success');
            
            // refresh academic year list
            showAllAcademicYears()

        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError4(error.response.data.error)
            } 
        })
    }

    // Delete a Academic Year option
    const deleteAcademicYear = async() => {

        if(!getAcademicYear){
            return setError3('No Academic Year selected!')
        }

        // confirmation
        confirm({ title: `Do you want remove Academic Year: ${getAcademicYear}?`,
                description: `Please note that this will permanently remove ${getAcademicYear}.`,
                confirmationText: "Delete"
        }).then(async() => {
                //auth
                const Auth = {
                    headers:{
                    'Authorization': `Bearer ${user.token}`
                    }
                }

                // delete request
                await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/dean/academic-year/${getAcademicYear}`, Auth).then((response) => {
                    if(response.data){

                        // reset
                        setError3('')
                        showAllAcademicYears()

                        //Notification
                        Toast(`The Academic Year: ${getAcademicYear} is deleted`, 'success');
                    }
                // catch error
                }).catch((error) => {
                    if (error.response) {
                        setError3(error.response.data.error)
                    }   
                })

        // confirmation cancel
        }).catch(() => {
            //Notification
            Toast(`You cancelled ${getAcademicYear} deletion`, 'info');
        });
    }

    const [ yearAndSection, setYearAndSection ] = useState();
    const HandleYearAndSection = async () => {
        // Authorization
        const Auth = {
            headers:{
            'Authorization': `Bearer ${user.token}`
            }
        }

        //saving the data
        await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/dean/advisers-year-and-section`, Auth)
        .then((response) => {

            console.log(response.data)
            setYearAndSection(response.data)
            // clear and call
            setError2('')
            
        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError2(error.response.data.error)
            } 
        })
    }

    useEffect( () => {
        HandleYearAndSection()
    }, [])


    //Year and Section
    const handleCreateYearAndSection = async () => {

        // auth
        const Auth = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }

        // Send a POST request to your server with the selected data
        await Axios.post(`${process.env.REACT_APP_DEV_BASE_URL}/dean/advisers-year-and-section`, {
            academicYear: getAcademicYear,
            section: getSection,
            adviser: getAdviser,
            adviser_id: getAdviser_id}, Auth)
        .then((response) => {
            // Log the response data to the console for debugging purposes
            HandleYearAndSection()
            Toast(`${getAdviser}'s Year and Seaction: ${getAcademicYear} ${getSection} is created`, 'success');

        // catch error
        }).catch((error) =>{
            if (error.response) {
                setError(error.response.data.error)
            } 
        })
    };

    const deleteYearAndSection = async ( id, academicYear, section, adviser ) => {

        if(!yearAndSection){
            return setError2('No Academic Year selected!')
        }

        // confirmation
        confirm({ title: `Do you want remove "${adviser}" Academic Year and Section: "${academicYear} ${section}"?`,
                description: `Please note that this will permanently remove the connection of the adviser from ${academicYear} ${section}.`,
                confirmationText: "Delete"
        }).then(async() => {
                //auth
                const Auth = {
                    headers:{
                    'Authorization': `Bearer ${user.token}`
                    }
                }
                
                await Axios.delete(`${process.env.REACT_APP_DEV_BASE_URL}/dean/advisers-year-and-section/${id}`, Auth).then((response) => {
                    if(response.data){
                        // reset
                        setError2('')
                        HandleYearAndSection()

                        //Notification
                        Toast(`Year and Section: ${academicYear} ${section} is deleted`, 'success');
                    }
                // catch error
                }).catch((error) => {
                    if (error.response) {
                        setError2(error.response.data.error)
                    }   
                })

        // confirmation cancel
        }).catch(() => {
            //Notification
            Toast(`You cancelled ${academicYear} ${section} deletion`, 'info');
        });
    }

    // First, create a state variable to store the selected adviser
    const uniqueAdvisersSet = new Set();

    // Create a function to handle adviser selection
    const handleAdviserClick = (adviser) => {
        setSearchBar(adviser);
    };

    // Number of tables to be shown
    const [showAll, setShowAll] = useState(false);
    const [numRowsToShow, setNumRowsToShow] = useState(10);

    const handleShowMore = () => {
        setShowAll(true);
    };

    const handleShowLess = () => {
        setShowAll(false);
    };



    

  return (
    <div className='create-admin'>
        
        <h2>Create New Adviser Account</h2>
        {error && <div className='error'>{error}</div>}
        {accountSuccess && <div className='logger'>{accountSuccess}</div>}
        <div className='form'>
        
            <div className='data'>
                <label>Fullname:</label>
                <input 
                value={name}
                    placeholder='Enter your Fullname...' 
                    onChange={(e) => {
                        setName(e.target.value)
                    }} 
                    type="text" />
            </div>

            <div className='data'>
                <label>Password:</label>
                <input
                    value={password}
                     onChange={(e) => {
                        setPassword(e.target.value)
                    }}  
                    placeholder='Enter your Password...' type="password" />
            </div>

            <div className='data'>
                <label>Email:</label>
                <input
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }} 
                    placeholder='Enter your Email...' type="email" />
            </div>

        </div>
        <button 
            className='outside'
            onClick={() => handleSubmit()}
        > Create Account </button>

        <div className='handled-section'>
            <h3>Tables for handled sections</h3>
            <div className='search-bar'>
                <input 
                    onChange={(e) => {setSearchBar(e.target.value)}}
                    type="text" 
                    placeholder='Search a adviser, section or academic year...' />

                <span 
                    className="search-button"
                    onMouseEnter={() => setSearchBtn(true)}
                    onMouseLeave={() => setSearchBtn(false)} >

                        <AiIcons.AiOutlineSearch size="30px"
                            color={searchBtn ? 'black' : 'white'}/>
                </span>
            </div>
        </div>
        
            {error2 && <div className='error'>{error2}</div>}

            {/* Adviser list */}
            {yearAndSection &&
                yearAndSection.forEach((item) => {
                    // Add the adviser name to the set
                    uniqueAdvisersSet.add(item.adviser);
                })}

            {/* Render the unique adviser names */}
            {Array.from(uniqueAdvisersSet).map((adviser) => (
                <button className='btns-advisers' key={adviser} onClick={() => handleAdviserClick(adviser)}>
                    {adviser}
                </button>
            ))}

            {/* Reset Adviser */}
            <button className='btns-advisers' onClick={() => setSearchBar('')}>
                Show All
            </button>

            <table >
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Adviser</th>
                    <th>Section</th>
                    <th>Academic Year</th>
                    </tr>
                </thead>

                <tbody>
                { yearAndSection && yearAndSection.filter(files => {
                    if (searchBar === '') {
                        return files
                    } else if ( 
                        files.adviser.toLowerCase().includes(searchBar.toLowerCase()) || 
                        files.academicYear.toLowerCase().includes(searchBar.toLowerCase()) ||
                        files.section.toLowerCase().includes(searchBar.toLowerCase())
                    ) {
                        return files;
                    }
                    return false;
                })
                .sort((a, b) => a.adviser.localeCompare(b.adviser))
                .sort((a, b) => b.academicYear.localeCompare(a.academicYear))
                .slice(0, showAll ? undefined : numRowsToShow) // Show only a limited number of rows based on the state
                .map((files, index) => {
                    const { _id, academicYear, section, adviser } = files;
                    return(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{adviser}</td>
                        <td>{section}</td>
                        <td>{academicYear}</td>
                        <td>
                        <button
                            
                            onClick={() => {
                                deleteYearAndSection(_id, academicYear, section, adviser)
                            }} 
                        ><FaIcons.FaTrashAlt color='red' size={25}/></button>
                        </td>
                    </tr>
                    ) 
                })
                }

                <tr>
                    <td>{/* Button for Show More and Show Less */}
                        {showAll ? 
                                <button className='btns-more-less' onClick={handleShowLess}>Show less...</button> 
                            : 
                                <button className='btns-more-less' onClick={handleShowMore}>Show more...</button>}
                    </td>
                </tr>
                </tbody>
            </table>

            

        
        
        
        
        <div className='section-form'>
            <h3>Sections options here: </h3>
            {error3 && <div className='error'>{error3}</div>}
            <div className='form'>
                <div className='data'>
                    <label>Adviser Name: <button  onClick={deleteAdviser}><FaIcons.FaTrashAlt size={20} color='red'/></button></label>
                    <select onChange={(e) => {
                        setGetAdviser(e.target.value);
                        setGetAdviser_id(e.target.options[e.target.selectedIndex].getAttribute('data-id'));
                    }}>
                        <option value=''>Select options here</option>
                        {sectionList && sectionList.advisers.sort((a, b) => a.name.localeCompare(b.name))
                        .map((adviser, index) => 
                        <option key={index} value={adviser.name} data-id={adviser._id}>{adviser.name}</option>)}
                    </select>
                </div>

                <div className='data'>
                    <label>Year and Section: <button onClick={deleteSection}><FaIcons.FaTrashAlt size={20} color='red'/></button></label>
                    <select onChange={(e) => setGetSection(e.target.value)}>
                        <option value=''>Select options here</option>
                        {sectionList && sectionList.sections.sort((a, b) => a.section.localeCompare(b.section))
                        .map((section, index) => 
                        <option key={index} value={section.section}>{section.section}</option> )} 
                    </select>
                </div>

                <div className='data'>
                    <label>Academic Year: <button  onClick={deleteAcademicYear}><FaIcons.FaTrashAlt size={20} color='red'/></button></label>
                    <select onChange={(e) => setGetAcademicYear(e.target.value)}>
                        <option value=''>Select options here</option>
                        {academicYearList && academicYearList.sort((a, b) => b.academicYear.localeCompare(a.academicYear))
                        .map((ay, index) => 
                        <option key={index} value={ay.academicYear}>{ay.academicYear}</option>)}
                    </select>
                </div>
            </div>
            <button 
                className='outside'
                onClick={handleCreateYearAndSection}
            >Save Section</button>
        </div>

        <h3>Create options here: </h3>
        {error4 && <div className='error'>{error4}</div>}
        <div className='options'> 
            <div className='data'>
                <label>Add Year and Section:   <em>e.g. BSIT-4C</em></label>
                <div>
                    <input
                        value={section}
                            onChange={(e) => {
                            setSection(e.target.value.toUpperCase())
                        }}  
                        placeholder='Enter the Section...' type="text" />
                    <button  onClick={addSection}><AiIcons.AiFillPlusCircle size={40} color='green'/></button>
                </div>
            </div>

            <div className='data'>
                <label>Add Academic Year:   <em>e.g. 2022-2023</em></label>
                <div>
                    <input
                        value={academicYear}
                            onChange={(e) => {
                            setAcademicYear(e.target.value.toUpperCase())
                        }}  
                        placeholder='Enter the Academic Year...' type="text" />
                    <button onClick={addAcademicYear}><AiIcons.AiFillPlusCircle size={40} color='green' className='span'/></button>
                </div>
            </div>
        </div>

        <ToastContainer />
    </div>
  )
}

export default CreateAccount