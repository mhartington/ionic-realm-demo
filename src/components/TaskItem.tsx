import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  useIonAlert,
} from '@ionic/react';
import { useRef, useState } from 'react';
import useTaskMutations from '../graphql/useTaskMutations';
import { useRealmApp } from '../Realm';
import './TaskItem.css';

export function TaskItem(task: {
  name: string;
  status: 'Open' | 'In Progress' | 'Complete';
  __typename: string;
  _id: string;
}) {
  const app = useRealmApp();
  const [project] = useState(app.currentUser?.customData.memberOf[0]);
  const { updateTask } = useTaskMutations(project);
  const slidingRef = useRef<HTMLIonItemSlidingElement | null>(null);
  const [presentAlert] = useIonAlert();

  const toggleStatus = () => {
    presentAlert({
      header: 'Change task status',
      inputs: [
        {
          name: 'Open',
          type: 'radio',
          label: 'Open',
          value: 'Open',
          checked: !!(task.status === 'Open'),
        },
        {
          name: 'In Progress',
          type: 'radio',
          label: 'In Progress',
          value: 'InProgress',
          checked: !!(task.status === 'In Progress'),
        },
        {
          name: 'Complete',
          type: 'radio',
          label: 'Complete',
          value: 'Complete',
          checked: !!(task.status === 'Complete'),
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ok',
        },
      ],
      onDidDismiss: async (ev) => {
        const toStatus = ev.detail.data.values;
        await updateTask(task, { status: toStatus });
        slidingRef.current?.close();
      },
    });
  };
  return (
    <IonItemSliding ref={slidingRef} className={'status-' + task.status}>
      <IonItem>
        <IonLabel>{task.name}</IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption onClick={toggleStatus}>Status</IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
