import React from 'react';
import './App.css';

// react-router-domv6
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

// Auth Context Hook
import { useAuthContext } from './Hooks/Auth/useAuthContext';

// components
import Navbar from './components/Navbar/Navbar';
import Footer from './pages/Footer/Footer';
// pages
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
  import Groups from './pages/Home/Groups/Groups';
  
import Progress from './pages/Progress/Progress';
  import Chapter1 from './pages/Progress/Chapters/Chapter1'
  import FinalOutput from './pages/Progress/Chapters/FinalOutput';
  import Task from './components/Progress/Task/Task'

// Login and register accounts
import Reports from './pages/Report/Report';
import Login from './pages/Login/Login';
  import ForgotPassword from './components/ForgotPassword/ForgotPassword';

// component pages
import Repository from './pages/Repository/Repository';
  import RepositoryGroups from './pages/Repository/RepositoryGroups';
  import RepositoryFiles from './pages/Repository/RepositoryFiles/RepositoryFiles';
import ArchiveAccounts from './pages/ArchiveAccounts/ArchiveAccounts';

import Register from './pages/Register/Register';
import Grammar from './pages/Grammar/Grammar';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import StudentList from './pages/StudentList/StudentList';
import ManageUsers from './pages/ManageUsers/ManageUsers';
  import ManageStudents from './pages/ManageUsers/ManageStudents/ManageStudents';

// Error page
import PendingUser from './Error/PendingUser';
import PageNotFound from './Error/PageNotFound/PageNotFound';

// code
import ProtectedRoutes from './Hooks/ProtectedRoutes/useProtectedRoute';


function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <Router>

        <Navbar />
          <Routes>
            <Route path="/" element={<ProtectedRoutes/>}>
              

              <Route path="/" element={ <Dashboard/> } />
              <Route path="/groups" element={ <Home/> }/> 
              <Route path='/groups/group' element={ <Groups/> }/>

              <Route path='/progress' element={ <Progress/> }/>
                <Route path='/chapter1' element={ <Chapter1/> }/>
                <Route path='/finals' element={ <FinalOutput/> }/>
                  <Route path='/task' element={ <Task/> }/>

              <Route path='/createaccount' element={ <CreateAccount/> } />
              <Route path='/repository' element={ <Repository/> } />
                <Route path='/repository/files' element={ <RepositoryFiles/> } />
                <Route path='/repository/groups' element={<RepositoryGroups/>} />
              <Route path='/archive-accounts' element={ <ArchiveAccounts/> } />

              <Route path='/grammar' element={ <Grammar/> } />
              <Route path='/reports' element={ <Reports/> } />
              <Route path='/settings' element={ <AccountSettings/> } />
              <Route path='/studentlist' element={ <StudentList/> } />
              <Route path='/manageadvisers' element={ <ManageUsers/> } />
                <Route path='/manageadvisers/managestudents' element={ <ManageStudents/> } />
            </Route>

            <Route path="/pending" element={user && user.authorization === 'pending' && <PendingUser/> } />
            <Route path="*" element={ <PageNotFound/> } />


            <Route path='/login' element={!user ? <Login/> : <Navigate to='/'/> } />
            <Route path='/register' element={!user ?  <Register/> : <Navigate to='/'/> } />
              <Route path='/forgot-password' element={!user ?  <ForgotPassword/> : <Navigate to='/'/> } />
            
          </Routes>
          <Footer />
      </Router>
    </div>
  );
}

export default App;
