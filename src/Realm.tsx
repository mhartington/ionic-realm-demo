import { createContext, useContext, useEffect, useState } from 'react';
import * as Realm from 'realm-web';

const RealmAppContext = createContext<Partial<Realm.App>>({});

export const useRealmApp = () => {
  const app = useContext(RealmAppContext);
  if (!app) {
    throw new Error( `You must call useRealmApp() inside of a <RealmAppProvider />`);
  }
  return app;
};

export const RealmAppProvider = ({ appId, children, }: { appId: any; children: JSX.Element; }) => {
  const [app, setApp] = useState(new Realm.App(appId));
  const [currentUser, setCurrentUser] = useState(app.currentUser);

  useEffect(() => {
    setApp(new Realm.App(appId));
  }, [appId]);

  const logIn = async (credentials: Realm.Credentials<any>) => {
    const user = await app.logIn(credentials);
    setCurrentUser(app.currentUser);
    return user;
  };
  const logOut = async () => {
    await app.currentUser?.logOut();
    setCurrentUser(app.currentUser);
  };

  const wrapped = { ...app, currentUser, logIn, logOut };
  return (
    <RealmAppContext.Provider value={wrapped}>
      {children}
    </RealmAppContext.Provider>
  );
};
