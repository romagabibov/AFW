import { doc, getDoc, setDoc, onSnapshot, getDocFromServer } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState, useEffect } from "react";

export function useSettings() {
  const [settings, setSettings] = useState<any>(() => {
    const local = localStorage.getItem("app_settings");
    return local ? JSON.parse(local) : {
      heroVideoUrl: "https://cdn.pixabay.com/video/2016/09/21/5300-182390231_large.mp4",
      heroMobileVideoUrl: "https://cdn.pixabay.com/video/2016/09/21/5300-182390231_large.mp4",
      applyHeading: "SS27",
    };
  });

  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, "settings", "global"), (snapshot) => {
        if (snapshot.exists()) {
          setSettings((prev: any) => ({ ...prev, ...snapshot.data() }));
          try {
            localStorage.setItem("app_settings", JSON.stringify(snapshot.data()));
          } catch (e) {
            console.warn("Could not save to localStorage (quota exceeded)", e);
          }
        }
      }, (error) => {
        console.error("Firebase error, falling back to local defaults.", error);
      });
      return unsub;
    } catch (e) {
      console.error(e);
    }
  }, []);

  return settings;
}

