import { createContext, useContext, useEffect, useState } from "react";
import { useRealmApp } from "../Realm";

const MongoContext = createContext<globalThis.Realm.Services.MongoDBDatabase | null>(null);

export function useMongoDB(collection: string){
  const mdbContext = useContext(MongoContext);
  if (mdbContext == null) {
    throw new Error("useMongoDB() called outside of a MongoDB?");
  }
  const doc = mdbContext.collection(collection);
  return doc;
};

export const MongoDBProvider = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useRealmApp();
  const [db, setDB] = useState<globalThis.Realm.Services.MongoDBDatabase | null>(null);
  useEffect(() => {
    if (currentUser) {
      const realmService = currentUser.mongoClient("mongodb-atlas");
      setDB(realmService.db("tracker"));
    }
  }, [currentUser]);

  return (
    <MongoContext.Provider value={db}>{children}</MongoContext.Provider>
  );
};
