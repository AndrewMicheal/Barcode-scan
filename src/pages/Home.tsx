import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useEffect, useState } from 'react';

import { Browser } from '@capacitor/browser';


const Home: React.FC = () => {
  const [err , setErr] = useState<string>();
  const [hideBg ,setHideBg] = useState("");

  const openCapacitorSite = async (websiteUrl: any) => {
    await Browser.open({ url: `${websiteUrl}` });
  };

  const startScan = async () => {
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    setHideBg("hideBg");
  
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    stopScan();
    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
      if(result.content?.includes("www.")) {
        openCapacitorSite(result.content)
      }
    }
  };

  const stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    setHideBg("");
  };


  useEffect(()=>{
    const checkPermission = async () => {
      // check or request permission
     try {
      const status = await BarcodeScanner.checkPermission({ force: true });
    
      if (status.granted) {
        // the user granted permission
        return true;
      }
    
      return false;
     } catch (error:any) {
       setErr(error.message)
     }
    };
    checkPermission();
  },[]);
  if(err) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <h2>{err}</h2>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Blank</IonTitle>
            <IonButtons>
              <IonButton hidden = {!hideBg} onClick = {stopScan}>Stop Scan</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className = {hideBg}>
          <IonButton hidden = {!!hideBg} onClick = {startScan}>Start Scan</IonButton>
          <div className = "scanBox" hidden = {!hideBg} />
        </IonContent>
      </IonPage>
    );
  }
};

export default Home;
