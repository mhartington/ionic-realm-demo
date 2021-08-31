import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  useIonAlert,
} from '@ionic/react';
import { useRef } from 'react';
import { useMongoDB } from '../rest/Mongo';

import './TaskItem.css';

type taskProp = {
  name: string;
  status: 'Open' | 'InProgress' | 'Complete';
  __typename: string;
  _id: string;
};
export function TaskItem({
  task,
  onStatusDidChange,
}: {
  task: taskProp;
  onStatusDidChange: Function;
}) {
  const db = useMongoDB('Task');

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
          checked: !!(task.status === 'InProgress'),
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
        },
        {
          text: 'Ok',
          role: 'confirm',
        },
      ],
      onDidDismiss: (ev) => {
        if (ev.detail.role === 'confirm') {
          const toStatus = ev.detail.data.values;
          return db.updateOne(task, { ...task, status: toStatus }).then(() => {
            slidingRef.current?.close();
            onStatusDidChange();
          });
        }
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
