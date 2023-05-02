import React, {useState} from 'react'
import './Chapter.css';

// components
import ChapterCards from '../../../components/Progress/Chapters/ChapterCards';
import ChapterComments from '../../../components/Progress/Chapters/ChapterComments';
import ChapterCreateTask from '../../../components/Progress/Chapters/ChapterCreateTask';

// Context Hook
import { useAuthContext } from '../../../Hooks/Auth/useAuthContext';

//react-router-dom
import { useLocation } from "react-router-dom";

function Chapter1() {
  const { user } = useAuthContext()

  //react-router state
  const location = useLocation();

  //ADVISER: location is "components/Groups/GroupProgress.jsx"
  //STUDENT: location is "pages/Progress/Progress.jsx"
  const { group_id, progress_id, progressName } = location.state

  return (
    <div className='chapter'>
        <div className='content'>
            <h1>{progressName}</h1>
            <ChapterCards 
              progress_id={progress_id} 
              group_id={group_id}
              progressName={progressName} />
        </div> 
        
        <div className="control">
            
            <div className='control-content'>
              <ChapterComments 
                group_id={group_id} 
                progress_id={progress_id} 
                progressName={progressName}
                />

              {user.authorization === 'student' ? null : 
                <ChapterCreateTask 
                  group_id={group_id} 
                  progress_id={progress_id}
                  progressName={progressName} />}

            </div>
        </div>
    </div>
  )
}

export default Chapter1