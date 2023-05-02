import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ConfirmProvider } from "material-ui-confirm";

// context provider
import { CommentsContextProvider } from './Context/Progress/CommentsContext';
import { GrammarsContextProvider } from './Context/GrammarContext';
import { GroupNamesContextProvider } from './Context/GroupNamesContext';
import { ManuscriptContextProvider } from './Context/ManuscriptContext';
import { DashboardChartContextProvider } from './Context/DashboardChartContext';
import { TaskContextProvider } from './Context/TaskContext';


// Authentication context provider
import { AuthContextProvider } from './Context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfirmProvider>
      <AuthContextProvider>
        <DashboardChartContextProvider>
          <ManuscriptContextProvider>
            <GroupNamesContextProvider>
              <TaskContextProvider>
                <GrammarsContextProvider>
                  <CommentsContextProvider>
                    <App />
                  </CommentsContextProvider>
                </GrammarsContextProvider>
              </TaskContextProvider>
            </GroupNamesContextProvider>
          </ManuscriptContextProvider>
        </DashboardChartContextProvider>
      </AuthContextProvider>
    </ConfirmProvider>
  </React.StrictMode>
);


