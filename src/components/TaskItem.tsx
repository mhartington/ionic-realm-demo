import {
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  useIonAlert,
} from '@ionic/react';
import { useRef, useState } from 'react';
import { useMongoDB } from '../rest/Mongo';

import './TaskItem.css';

type taskProp  = {
  name: string;
  status: 'Open' | 'InProgress' | 'Complete';
  __typename: string;
  _id: string;
}
export function TaskItem(task: taskProp) {
  const db = useMongoDB('Task')

  const [state, setState] = useState<taskProp>(task)
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
          checked: !!(state.status === 'Open'),
        },
        {
          name: 'In Progress',
          type: 'radio',
          label: 'In Progress',
          value: 'InProgress',
          checked: !!(state.status === 'InProgress'),
        },
        {
          name: 'Complete',
          type: 'radio',
          label: 'Complete',
          value: 'Complete',
          checked: !!(state.status === 'Complete'),
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
      onDidDismiss: async (ev) => {
        if(ev.detail.role === 'confirm'){
          const toStatus = ev.detail.data.values;
          setState({...task, status: toStatus})
          await db.updateOne(task, {...task, status: toStatus});
        }
        slidingRef.current?.close();
      },
    });
  };
  return (
    <IonItemSliding ref={slidingRef} className={'status-' + state.status}>
      <IonItem>
      <IonLabel>
      {state.name}
      </IonLabel>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption onClick={toggleStatus}>Status</IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
