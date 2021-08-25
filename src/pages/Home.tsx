import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { TaskItem } from '../components/TaskItem';
import { useRealmApp } from '../Realm';
import { ObjectId } from 'bson';

import { useMongoDB } from '../rest/Mongo';
import './Home.css';

export function Home() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Array<any>>([]);

  const app = useRealmApp();
  const [currentProject] = useState(app.currentUser?.customData.memberOf[0]);
  const db = useMongoDB('Task');

  const [presentAlert] = useIonAlert();

  const loadTasks = async () => {
    console.log(db.find)
    const tasksRes = await db.find();
    setTasks(tasksRes);
    setLoading(false);
  };

  useEffect(() => { loadTasks(); }, []);


  const addNewTask = () => {
    presentAlert({
      header: 'Add a new task',
      inputs: [{ type: 'text', label: 'New Task', name: 'newTask' }],
      buttons: ['Cancel', 'Add'],
      onDidDismiss: async (e) => {
        const taskToAdd = e.detail.data.values.newTask;
        if (!taskToAdd) {
          return;
        }
        await db.insertOne({
          name: taskToAdd,
          status: 'Open',
          _id: new ObjectId(),
          _partition: currentProject.partition,
        });
        loadTasks();
      },
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={addNewTask}>
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tasks</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {loading ? <IonLoading isOpen={loading} /> : null}
          {tasks.map((task: any) => (
            <TaskItem key={parseInt(task._id)} {...task}></TaskItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
