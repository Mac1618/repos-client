import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import Axios from "axios";
import 'chart.js/auto';
import BarChart from "../../components/Dashboard/BarChart";

//Global context
import { useDashboardChartContext } from '../../Hooks/useDashboardChartContext';

//Auth Hook
import { useAuthContext } from '../../Hooks/Auth/useAuthContext';

function Dashboard() {
  const { user } = useAuthContext()
  // const { dispatch } = useManuscriptContext()
  const { userDashboards, adminDashboards, superAdminDashboards, dispatch } = useDashboardChartContext()
  const [ error, setError ] = useState('')

  const [ userDashboard, setUserDashboard ] = useState(null);
  const [ adminDashboard, setAdminDashboard ] = useState(null);
  const [ superAdminDashboard, setSuperAdminDashboard ] = useState(null);
  const [ userData, setUserData ] = useState();

  // Student Dashboard
  const handleStudentDashboard = async() => {
    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    if(user){
      await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/dashboard/student`, Auth).then((response) => {
        if(response.data){
            setUserDashboard(response.data)
            console.log(response.data)
            dispatch({type: 'SET_USERDASHBOARD', payload: response.data})
            setError('')
        }

      // catch error
      }).catch((error) => {
          if (error.response) {
              setError(error.response.data)
          } 
      })

      
    }
  }

  useEffect(() => {
    if( !userDashboard && user.authorization === 'student' ){
      handleStudentDashboard()
    }
  }, [user, userDashboard])


  // Adviser Dashboard
  const handleAdminDashboard = async() => {

    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    if(user){
      await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/dashboard/adviser`, Auth).then((response) => {
        if(response.data){
            setAdminDashboard(response.data)
            dispatch({type: 'SET_ADMINDASHBOARD', payload: response.data})
            setError('')
        }

      // catch error
      }).catch((error) => {
          if (error.response) {
              setError(error.response.data)
          } 
      })
    }
  }

  useEffect(() => {
    if(!adminDashboard && user.authorization === 'admin' ){
      handleAdminDashboard()
    }
  }, [user, adminDashboard])

  // Dean Dashboard
  const handleSuperAdminDashboard = async() => {

    const Auth = {
      headers:{
        'Authorization': `Bearer ${user.token}`
      }
    }

    if(user){
      await Axios.get(`${process.env.REACT_APP_DEV_BASE_URL}/dashboard/dean`, Auth).then((response) => {
        if(response.data){
            dispatch({type: 'SET_SUPERADMINDASHBOARD', payload: response.data})
            setSuperAdminDashboard(response.data)
            setError('')
        }

      // catch error
      }).catch((error) => {
          if (error.response) {
              setError(error.response.data)
          } 
      })
    }
  }

  useEffect(() => {
    if( !superAdminDashboard && user.authorization === 'superadmin' ){
      handleSuperAdminDashboard()
    }
  }, [user, superAdminDashboard, handleSuperAdminDashboard])

  // use to filter the chart
  const dashboardData = async() => {
  
    if( userDashboards && user.authorization === 'student' ){
        return setUserData({
        labels: userDashboards.getGroupProgress.map((data) => data.progress),
        datasets: [
          {
            label: "Percent",
            data: userDashboards.getGroupProgress.map((data) => data.percent),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 1,
          },
        ],
        options: {
          scales: {
              xAxes: [{
                  barPercentage: 1
              }]
          }
        }
      })
    }

    // Adviser
    if( adminDashboards && user.authorization === 'admin' ){
      return setUserData({            
        labels: adminDashboards.adviseeGroups.map((data) => data.groups),
        datasets: [
          {
            label: "Percent",
            data: adminDashboards.adviseeGroups.map((data) => data.totalAveragePercent),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 1,
          },
        ],
        options: {
          scales: {
              xAxes: [{
                  barPercentage: 1
              }]
          }
        }
      })
    }

    //Dean
    if(superAdminDashboards && user.authorization === 'superadmin'){
      return setUserData({
        labels: superAdminDashboards.adminAccounts.map((data) => data.name),
        datasets: [
          {
            label: "Percent",
            data: superAdminDashboards.adminAccounts.map((data) => data.groupsTotalPercent),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 1,
          },
        ],
        options: {
          scales: {
              xAxes: [{
                  barPercentage: 1
              }]
          }
        }
      })
    }

  }

  useEffect(() => {
    if(!userData){
      dashboardData()
    }
  }, [])

  const handleInfoFilter = () => {
    //Student
    if(user.authorization === 'student'){
      if(userDashboard){
        return (<>
        <div className='header'>
          <h3>Academic year</h3>
          <h2>2022-2023</h2>
        </div>
        
        <div className='content'>
          <h3 className='student-group'>Team: <span>{userDashboard.groupName}</span></h3>
          <div>
            {
            userDashboard.getGroupProgress.map((dashboard, index) => {
              const { progress, percent } = dashboard;
              return(
                  <p key={index}>{progress} <strong>{percent}%</strong></p>
              )
            })
            }
          </div>
          
        </div>
      </>)} 
      }

    // Adviser
    if(user.authorization === 'admin'){
      return (<>
        <div className='header'>
          <h3>Academic year</h3>
          <h2>2022-2023</h2>
        </div>

        <div className='content'>

          {adminDashboard &&
            <div>
              <p>Number of Students: <strong>{adminDashboard.student}</strong></p>
              <p>Number of Pending Accounts: <strong>{adminDashboard.pending}</strong></p>
              <p>Number of Teams: <strong>{adminDashboard.groups}</strong></p>
              <p>Reported Members: <strong>{adminDashboard.reports}</strong></p>
            </div>
          }
          
        </div>
      </>)
    }

    //Dean
    if(user.authorization === 'superadmin'){
      return(<>
        <div className='header'>
          <h3>Academic year</h3>
          <h2>2022-2023</h2>
        </div>

        <div className='content'>
          {superAdminDashboard && 
            <div>
              <p>Total of Students: <strong>{superAdminDashboard.student}</strong></p>
              <p>Total of Pending Accounts: <strong>{superAdminDashboard.pending}</strong></p>
              <p>Total of Advisers: <strong>{superAdminDashboard.admins}</strong></p>
              <p>Total of Groups: <strong>{superAdminDashboard.groups}</strong></p>
              <p>Total of Manuscripts: <strong>{superAdminDashboard.manuscriptFiles}</strong></p>
            </div>
          }
          
        </div>
      </>)
    }
  }

  return (
    <div className='dashboard'>
      <div className='chart'>
        <h3>Total Progress Report</h3>
        <div className='pie'>
          { userData && <BarChart chartData={userData} /> }
        </div>
        
      </div>
      <div className='info'>
        {user ?  handleInfoFilter() : null}
      </div>
    </div>
  )
}

export default Dashboard