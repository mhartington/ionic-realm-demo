import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/ionic.bundle.css';
/* Theme variables */
import './theme/variables.css';

// import RealmApolloProvider from './graphql/RealmApolloProvider';
import { RealmAppProvider, useRealmApp } from './Realm';

import { Login } from './pages/Login';
import { MongoDBProvider } from './rest/Mongo';
export const APP_ID = 'tasktracker-gbxoc';

interface Props {
  Component: React.FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
}

const AuthRoute = ({ Component, path, exact = true }: Props): JSX.Element => {
  const app = useRealmApp();
  const isAuthed = !!app.currentUser;
  return (
    <Route
      exact={exact}
      path={path}
      render={(props: RouteComponentProps) =>
        isAuthed ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};
const App: React.FC = () => {
  return (
    <RealmAppProvider appId={APP_ID}>
      {/* <RealmApolloProvider> */}
      <MongoDBProvider>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <AuthRoute path="/home" Component={Home} />
              <Route exact path="/" component={Login} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </MongoDBProvider>
      {/* </RealmApolloProvider> */}
    </RealmAppProvider>
  );
};

export default App;
