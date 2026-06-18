import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { db, auth, googleProvider } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { DESIGNERS, SCHEDULE } from "../data";
import { Designer, EventSchedule } from "../types";
import { ImageUpload } from "./ImageUpload";

import { RichTextEditor } from "./RichTextEditor";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("hero");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroMobileVideoUrl, setHeroMobileVideoUrl] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("Season 2026 • The Water Element");
  const [heroTitle1, setHeroTitle1] = useState("AZERBAIJAN");
  const [heroTitle2, setHeroTitle2] = useState("FASHION");
  const [heroTitle3, setHeroTitle3] = useState("WEEK");
  const [applyHeading, setApplyHeading] = useState("SS27");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [adminEmails, setAdminEmails] = useState("");
  
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [teamList, setTeamList] = useState<any[]>([
    { id: 1, name: "Nigar Abbasova", role: "Creative Director", bio: "With over 15 years in fashion management.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=60" },
    { id: 2, name: "Elvin Mammadov", role: "Head of Production", bio: "Ensuring the technical excellence of every show.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60" },
    { id: 3, name: "Aysel Rustamova", role: "PR & Media", bio: "Connecting our brand with global media.", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=60" },
  ]);
  const [newsList, setNewsList] = useState<any[]>([
    { id: 1, date: "October 11, 2026", title: "Important update regarding upcoming season", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { id: 2, date: "October 12, 2026", title: "New designers announced", content: "Lorem ipsum dolor sit amet." }
  ]);
  const [collapsedNews, setCollapsedNews] = useState<Record<number, boolean>>({});
  const [mediaDays, setMediaDays] = useState<any[]>([]);
  const [mediaPublications, setMediaPublications] = useState<any[]>([]);
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [termsOfService, setTermsOfService] = useState("");
  
  // Popup settings
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [popupTitle, setPopupTitle] = useState("Exciting News!");
  const [popupContent, setPopupContent] = useState("<p>We are waiting for the show!</p>");
  const [popupButtonEnabled, setPopupButtonEnabled] = useState(false);
  const [popupButtonText, setPopupButtonText] = useState("Buy Tickets");
  const [popupButtonLink, setPopupButtonLink] = useState("");
  
  // Dynamic collections
  const [designersList, setDesignersList] = useState<Designer[]>(DESIGNERS);
  const [scheduleList, setScheduleList] = useState<EventSchedule[]>(SCHEDULE);
  const [partnersList, setPartnersList] = useState<{id: string, name: string, logo: string}[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      const local = localStorage.getItem("app_settings");
      if (local) {
        const data = JSON.parse(local);
        if (data.heroVideoUrl !== undefined) setHeroVideoUrl(data.heroVideoUrl || "");
        if (data.heroMobileVideoUrl !== undefined) setHeroMobileVideoUrl(data.heroMobileVideoUrl || "");
        if (data.heroSubtitle !== undefined) setHeroSubtitle(data.heroSubtitle);
        if (data.heroTitle1 !== undefined) setHeroTitle1(data.heroTitle1);
        if (data.heroTitle2 !== undefined) setHeroTitle2(data.heroTitle2);
        if (data.heroTitle3 !== undefined) setHeroTitle3(data.heroTitle3);
        if (data.applyHeading !== undefined) setApplyHeading(data.applyHeading);
        if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
        if (data.faviconUrl !== undefined) setFaviconUrl(data.faviconUrl);
        if (data.adminEmails !== undefined) setAdminEmails(data.adminEmails);
        if (data.teamList) setTeamList(data.teamList);
        if (data.newsList) setNewsList(data.newsList);
        if (data.mediaDays) setMediaDays(data.mediaDays);
        if (data.mediaPublications) setMediaPublications(data.mediaPublications);
        if (data.privacyPolicy !== undefined) setPrivacyPolicy(data.privacyPolicy);
        if (data.termsOfService !== undefined) setTermsOfService(data.termsOfService);
        if (data.popupEnabled !== undefined) setPopupEnabled(data.popupEnabled);
        if (data.popupTitle !== undefined) setPopupTitle(data.popupTitle);
        if (data.popupContent !== undefined) setPopupContent(data.popupContent);
        if (data.popupButtonEnabled !== undefined) setPopupButtonEnabled(data.popupButtonEnabled);
        if (data.popupButtonText !== undefined) setPopupButtonText(data.popupButtonText);
        if (data.popupButtonLink !== undefined) setPopupButtonLink(data.popupButtonLink);
        if (data.designers) setDesignersList(data.designers);
        if (data.schedule) setScheduleList(data.schedule);
        if (data.partners) setPartnersList(data.partners);
        if (data.responses) setResponses(data.responses);
      }
      try {
        const docSnap = await getDoc(doc(db, "settings", "global"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroVideoUrl !== undefined) setHeroVideoUrl(data.heroVideoUrl || "");
          if (data.heroMobileVideoUrl !== undefined) setHeroMobileVideoUrl(data.heroMobileVideoUrl || "");
          if (data.heroSubtitle !== undefined) setHeroSubtitle(data.heroSubtitle);
          if (data.heroTitle1 !== undefined) setHeroTitle1(data.heroTitle1);
          if (data.heroTitle2 !== undefined) setHeroTitle2(data.heroTitle2);
          if (data.heroTitle3 !== undefined) setHeroTitle3(data.heroTitle3);
          if (data.applyHeading !== undefined) setApplyHeading(data.applyHeading);
          if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
          if (data.faviconUrl !== undefined) setFaviconUrl(data.faviconUrl);
          if (data.adminEmails !== undefined) setAdminEmails(data.adminEmails);
          if (data.teamList) setTeamList(data.teamList);
          if (data.newsList) setNewsList(data.newsList);
          if (data.mediaDays) setMediaDays(data.mediaDays);
          if (data.mediaPublications) setMediaPublications(data.mediaPublications);
          if (data.privacyPolicy !== undefined) setPrivacyPolicy(data.privacyPolicy);
          if (data.termsOfService !== undefined) setTermsOfService(data.termsOfService);
          if (data.popupEnabled !== undefined) setPopupEnabled(data.popupEnabled);
          if (data.popupTitle !== undefined) setPopupTitle(data.popupTitle);
          if (data.popupContent !== undefined) setPopupContent(data.popupContent);
          if (data.popupButtonEnabled !== undefined) setPopupButtonEnabled(data.popupButtonEnabled);
          if (data.popupButtonText !== undefined) setPopupButtonText(data.popupButtonText);
          if (data.popupButtonLink !== undefined) setPopupButtonLink(data.popupButtonLink);
          if (data.designers) setDesignersList(data.designers);
          if (data.schedule) setScheduleList(data.schedule);
          if (data.partners) setPartnersList(data.partners);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      if (isAdmin) {
        try {
          const respCol = collection(db, "responses");
          const respSnaps = await getDocs(respCol);
          const respDocs = respSnaps.docs.map(d => ({ ...d.data(), id: d.id }));
          setResponses(respDocs);
        } catch (error) {
          console.error("Failed to load responses:", error);
        }
      }
    };
    fetchResponses();
  }, [isAdmin]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      
      if (!u) {
        setIsAdmin(false);
        setAuthLoading(false);
        return;
      }

      if (u.email === "vnsbek@gmail.com") {
        setIsAdmin(true);
        setAuthLoading(false);
      }

      try {
        // check if admin for other users
        const docSnap = await getDoc(doc(db, "settings", "global"));
        const data = docSnap.exists() ? docSnap.data() : {};
        const emails = data.adminEmails ? data.adminEmails.split(',').map((e: string) => e.trim()) : [];
        if (emails.includes(u.email) || u.email === "vnsbek@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching admin settings:", error);
        if (u.email === "vnsbek@gmail.com") {
          setIsAdmin(true); // Fallback to allow default admin
        } else {
          setIsAdmin(false);
        }
      } finally {
        setAuthLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleSaveSettings = async () => {
    const newSettings = { 
      heroVideoUrl, 
      heroMobileVideoUrl,
      heroSubtitle,
      heroTitle1,
      heroTitle2,
      heroTitle3,
      applyHeading,
      logoUrl,
      faviconUrl,
      adminEmails,
      teamList,
      newsList,
      mediaDays,
      mediaPublications,
      privacyPolicy,
      termsOfService,
      popupEnabled,
      popupTitle,
      popupContent,
      popupButtonEnabled,
      popupButtonText,
      popupButtonLink,
      designers: designersList,
      schedule: scheduleList,
      partners: partnersList,
      responses
    };
    try {
      localStorage.setItem("app_settings", JSON.stringify(newSettings));
    } catch(e) {
      console.warn("Could not save to localStorage (quota exceeded)", e);
    }
    const payload = {
      heroVideoUrl, 
      heroMobileVideoUrl,
      heroSubtitle,
      heroTitle1,
      heroTitle2,
      heroTitle3,
      applyHeading,
      logoUrl,
      faviconUrl,
      adminEmails,
      teamList,
      newsList,
      mediaDays,
      mediaPublications,
      privacyPolicy,
      termsOfService,
      popupEnabled,
      popupTitle,
      popupContent,
      popupButtonEnabled,
      popupButtonText,
      popupButtonLink,
      designers: designersList,
      schedule: scheduleList,
      partners: partnersList
    };

    // Remove any base64 images that might have been stranded from before Cloudinary
    const scrubbedPayload = JSON.parse(JSON.stringify(payload), (key, value) => {
      if (typeof value === "string") {
        if (value.startsWith("data:image/") && value.length > 50000) {
          return ""; // Clear large base64
        }
        if (value.includes('src="data:image/')) {
          // Removes huge embedded base64s in rich text
          return value.replace(/src="data:image\/[^"]+"/g, 'src=""');
        }
      }
      return value;
    });

    try {
      await setDoc(doc(db, "settings", "global"), scrubbedPayload, { merge: true });
      alert("Settings saved successfully");
    } catch (error: any) {
      console.error(error);
      alert("Saved locally. Error saving to Firebase: " + error.message);
    }
  };

  const [expandedDesigners, setExpandedDesigners] = useState<Record<string, boolean>>({});

  const toggleDesignerExpanded = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedDesigners(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const moveDesigner = (index: number, direction: number) => {
    if (index + direction < 0 || index + direction >= designersList.length) return;
    const newList = [...designersList];
    const temp = newList[index];
    newList[index] = newList[index + direction];
    newList[index + direction] = temp;
    setDesignersList(newList);
  };

  const movePartner = (index: number, direction: number) => {
    if (index + direction < 0 || index + direction >= partnersList.length) return;
    const newList = [...partnersList];
    const temp = newList[index];
    newList[index] = newList[index + direction];
    newList[index + direction] = temp;
    setPartnersList(newList);
  };

  const addDesigner = () => {
    setDesignersList([...designersList, { id: Date.now().toString(), name: "New Designer", brand: "", bio: "", imageUrl: "" }]);
  };

  const updateDesigner = (id: string, field: keyof Designer, value: string) => {
    setDesignersList(designersList.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const deleteCloudinaryMedia = async (url: string, resourceType: string = 'image') => {
    if (!url || !url.includes("cloudinary.com")) return;
    try {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return;
      let startIndex = uploadIndex + 1;
      if (parts[startIndex] && parts[startIndex].match(/^v\d+$/)) {
        startIndex += 1;
      }
      const publicIdWithExtension = parts.slice(startIndex).join('/');
      const lastDot = publicIdWithExtension.lastIndexOf('.');
      const public_id = lastDot !== -1 ? publicIdWithExtension.substring(0, lastDot) : publicIdWithExtension;
      
      await fetch('/api/admin/cloudinary/delete', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id, resource_type: resourceType })
      });
    } catch(e) {
      console.error("Cloudinary delete trigger error:", e);
    }
  };

  const removeDesigner = (id: string) => {
    const designer = designersList.find(d => d.id === id);
    if (designer && designer.imageUrl) deleteCloudinaryMedia(designer.imageUrl);
    setDesignersList(designersList.filter(d => d.id !== id));
  };
  
  const addPartner = () => {
    setPartnersList([...partnersList, { id: Date.now().toString(), name: "New Partner", logo: "" }]);
  };

  const updatePartner = (id: string, field: string, value: string) => {
    setPartnersList(partnersList.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePartner = (id: string) => {
    const partner = partnersList.find(p => p.id === id);
    if (partner && partner.logo) deleteCloudinaryMedia(partner.logo);
    setPartnersList(partnersList.filter(p => p.id !== id));
  };
  
  const addSchedule = () => {
    setScheduleList([...scheduleList, { id: Date.now().toString(), date: "", time: "", designerId: "", designerName: "Unknown", location: "", type: "", ticketAvailable: true }]);
  };

  const updateSchedule = (id: string, field: keyof EventSchedule, value: any) => {
    setScheduleList(scheduleList.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSchedule = (id: string) => {
    setScheduleList(scheduleList.filter(s => s.id !== id));
  };

  const addTeamMember = () => setTeamList([...teamList, { id: Date.now(), name: "Name", role: "Role", bio: "", image: "" }]);
  const updateTeamMember = (id: number, field: string, value: string) => setTeamList(teamList.map(t => t.id === id ? { ...t, [field]: value } : t));
  const removeTeamMember = (id: number) => {
    const member = teamList.find(t => t.id === id);
    if (member && member.image) deleteCloudinaryMedia(member.image);
    setTeamList(teamList.filter(t => t.id !== id));
  };

  const addNews = () => setNewsList([...newsList, { id: Date.now(), title: "News Title", date: new Date().toLocaleDateString(), content: "" }]);
  const updateNews = (id: number, field: string, value: string) => setNewsList(newsList.map(n => n.id === id ? { ...n, [field]: value } : n));
  const removeNews = (id: number) => setNewsList(newsList.filter(n => n.id !== id));

  const addMediaDay = () => setMediaDays([...mediaDays, { id: Date.now(), date: "", links: [] }]);
  const updateMediaDay = (id: number, field: string, value: string) => setMediaDays(mediaDays.map(m => m.id === id ? { ...m, [field]: value } : m));
  const removeMediaDay = (id: number) => setMediaDays(mediaDays.filter(m => m.id !== id));
  const addMediaLink = (dayId: number) => setMediaDays(mediaDays.map(m => m.id === dayId ? { ...m, links: [...m.links, { id: Date.now(), url: "", label: "Download Link" }] } : m));
  const updateMediaLink = (dayId: number, linkId: number, field: string, value: string) => setMediaDays(mediaDays.map(m => m.id === dayId ? { ...m, links: m.links.map((l: any) => l.id === linkId ? { ...l, [field]: value } : l) } : m));
  const removeMediaLink = (dayId: number, linkId: number) => setMediaDays(mediaDays.map(m => m.id === dayId ? { ...m, links: m.links.filter((l: any) => l.id !== linkId) } : m));

  const addMediaPublication = () => setMediaPublications([...mediaPublications, { id: Date.now(), title: "Magazine / Source", url: "", imageUrl: "", size: "small" }]);
  const updateMediaPublication = (id: number, field: string, value: string) => setMediaPublications(mediaPublications.map(p => p.id === id ? { ...p, [field]: value } : p));
  const removeMediaPublication = (id: number) => {
    const pub = mediaPublications.find(p => p.id === id);
    if (pub && pub.imageUrl) deleteCloudinaryMedia(pub.imageUrl);
    setMediaPublications(mediaPublications.filter(p => p.id !== id));
  };

  const removeResponse = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this response?");
    if (!confirmed) return;
    const newResponses = responses.filter(r => r.id !== id && r.timestamp !== id);
    setResponses(newResponses);
    try {
      if (id) {
        const { deleteDoc, doc } = await import("firebase/firestore");
        await deleteDoc(doc(db, "responses", id));
      }
    } catch(e) {
      console.error(e);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500 tracking-widest uppercase text-sm">Loading...</p></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 border border-black/10 text-center max-w-md w-full">
          <h1 className="text-2xl font-display uppercase tracking-wide mb-6">Admin Login</h1>
          {!user ? (
            <button onClick={() => signInWithPopup(auth, googleProvider).catch(err => { if (err.code !== 'auth/cancelled-popup-request') console.error(err); })} className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-black/80 w-full mb-4">
              Sign in with Google
            </button>
          ) : (
            <>
              <p className="text-red-500 mb-6 uppercase tracking-widest text-xs">Access Denied for {user.email}</p>
              <button onClick={() => signOut(auth)} className="border border-black/20 text-black px-8 py-3 uppercase tracking-widest text-sm hover:border-black w-full mb-4">
                Sign out
              </button>
            </>
          )}
          <button onClick={() => navigate("/")} className="text-xs uppercase tracking-widest text-gray-400 hover:text-black">Return to Site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-black/10 p-4 md:p-6 flex flex-col md:min-h-screen sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4 md:mb-12">
          <h1 className="font-display uppercase tracking-widest text-lg md:text-xl">Admin Console</h1>
          <button 
            onClick={() => navigate("/")}
            className="md:hidden text-[10px] uppercase tracking-widest text-gray-500 hover:text-black"
          >
             Back
          </button>
        </div>
        <nav className="flex flex-row md:flex-col gap-2 flex-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {["hero", "designers", "partners", "calendar", "team", "news", "docs", "media", "responses", "popup"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap text-left px-4 py-3 uppercase tracking-widest text-xs font-medium transition-colors border-b-2 md:border-b-0 md:border-l-2 ${activeTab === tab ? "border-black bg-gray-50 text-black" : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <button 
          onClick={() => navigate("/")}
          className="hidden md:block text-xs uppercase tracking-widest text-gray-500 hover:text-black text-left px-4 py-3 mt-4"
        >
           Back to Site
        </button>
        <button 
          onClick={() => signOut(auth)}
          className="hidden md:block text-xs uppercase tracking-widest text-red-500 hover:text-red-700 text-left px-4 py-3"
        >
           Sign Out
        </button>
      </div>
      
      <div className="flex-1 p-4 md:p-8 lg:p-16 md:h-screen md:overflow-y-auto w-full">
        <div className="max-w-4xl bg-white border border-black/10 p-4 md:p-8 shadow-sm">
          <div className="flex justify-between items-center border-b border-black/10 pb-4 mb-6 md:mb-8">
            <h2 className="text-2xl font-display uppercase tracking-wide">Edit {activeTab}</h2>
            {activeTab !== "responses" && (
              <button 
                onClick={handleSaveSettings}
                className="bg-black text-white px-6 py-2 uppercase tracking-widest text-xs hover:bg-black/80 transition-colors"
              >
                Save All Data
              </button>
            )}
          </div>
          
          {(activeTab === "hero") && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <ImageUpload label="Hero background (desktop - video or image)" value={heroVideoUrl || ""} onChange={setHeroVideoUrl} acceptType="any" />
              </div>
              <div className="flex flex-col gap-2">
                <ImageUpload label="Hero background (mobile - video or image)" value={heroMobileVideoUrl || ""} onChange={setHeroMobileVideoUrl} acceptType="any" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Hero Subtitle</label>
                <input 
                  type="text" 
                  value={heroSubtitle || ""} onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="border border-black/20 p-3 bg-gray-50 outline-none focus:border-black"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Hero Title Line 1</label>
                <input 
                  type="text" 
                  value={heroTitle1 || ""} onChange={(e) => setHeroTitle1(e.target.value)}
                  className="border border-black/20 p-3 bg-gray-50 outline-none focus:border-black"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Hero Title Line 2</label>
                <input 
                  type="text" 
                  value={heroTitle2 || ""} onChange={(e) => setHeroTitle2(e.target.value)}
                  className="border border-black/20 p-3 bg-gray-50 outline-none focus:border-black"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Hero Title Line 3</label>
                <input 
                  type="text" 
                  value={heroTitle3 || ""} onChange={(e) => setHeroTitle3(e.target.value)}
                  className="border border-black/20 p-3 bg-gray-50 outline-none focus:border-black"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Apply Heading text ("upcoming ___ season")</label>
                <input 
                  type="text" 
                  value={applyHeading || ""} onChange={(e) => setApplyHeading(e.target.value)}
                  className="border border-black/20 p-3 bg-gray-50 outline-none focus:border-black"
                />
              </div>
            </div>
          )}
          
          {activeTab === "team" && (
            <div className="flex flex-col gap-8">
              {teamList.map(member => (
                <div key={member.id} className="border border-black/10 p-6 flex flex-col gap-4 relative bg-gray-50/50">
                  <button onClick={() => removeTeamMember(member.id)} className="absolute top-4 right-4 text-xs text-red-500 uppercase tracking-widest hover:text-red-700">Remove</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Name</label>
                      <input type="text" value={member.name || ""} onChange={(e) => updateTeamMember(member.id, "name", e.target.value)} className="border border-black/20 p-2 bg-white" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Role</label>
                      <input type="text" value={member.role || ""} onChange={(e) => updateTeamMember(member.id, "role", e.target.value)} className="border border-black/20 p-2 bg-white" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Bio</label>
                      <textarea value={member.bio || ""} onChange={(e) => updateTeamMember(member.id, "bio", e.target.value)} className="border border-black/20 p-2 bg-white" rows={3} />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                       <ImageUpload label="Photo" value={member.image || ""} onChange={(val) => updateTeamMember(member.id, "image", val)} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addTeamMember} className="border border-dashed border-black/20 py-4 uppercase tracking-widest text-xs text-black/60 hover:border-black/40 hover:text-black transition-colors">
                + Add Team Member
              </button>
            </div>
          )}

          {activeTab === "news" && (
            <div className="flex flex-col gap-8">
              {newsList.map(newsItem => (
                <div key={newsItem.id} className="border border-black/10 p-6 flex flex-col gap-4 relative bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm uppercase tracking-widest">{newsItem.title || "Untitled News"}</h3>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setCollapsedNews(prev => ({...prev, [newsItem.id]: !prev[newsItem.id]}))} className="text-xs uppercase tracking-widest text-gray-500 hover:text-black">
                        {collapsedNews[newsItem.id] ? "Expand" : "Collapse"}
                      </button>
                      <button onClick={() => removeNews(newsItem.id)} className="text-xs text-red-500 uppercase tracking-widest hover:text-red-700">Remove</button>
                    </div>
                  </div>
                  
                  {!collapsedNews[newsItem.id] && (
                    <div className="grid grid-cols-1 gap-4 mt-4 pt-4 border-t border-black/10">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500">Date</label>
                        <input type="text" value={newsItem.date || ""} onChange={(e) => updateNews(newsItem.id, "date", e.target.value)} className="border border-black/20 p-2 bg-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500">Title</label>
                        <input type="text" value={newsItem.title || ""} onChange={(e) => updateNews(newsItem.id, "title", e.target.value)} className="border border-black/20 p-2 bg-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                         <label className="text-[10px] uppercase tracking-widest text-gray-500">Content / Excerpt</label>
                         <RichTextEditor value={newsItem.content || ""} onChange={(val) => updateNews(newsItem.id, "content", val)} />
                       </div>
                       <div className="flex flex-col gap-4 border border-black/10 p-4 bg-white mt-4">
                         <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">News Cover & Media</label>
                         <ImageUpload label="Cover Image" value={newsItem.coverImage || ""} onChange={(val) => updateNews(newsItem.id, "coverImage", val)} />
                         
                         <div className="mt-4">
                           <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Internal Gallery (Carousel)</label>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                             {(newsItem.gallery || []).map((imgUrl: string, idx: number) => (
                               <div key={idx} className="relative group aspect-square bg-gray-100">
                                 {imgUrl?.match(/\.(mp4|webm|ogg)$/i) ? (
                                   <video src={imgUrl} className="w-full h-full object-cover" muted playsInline />
                                 ) : (
                                   <img src={imgUrl || undefined} className="w-full h-full object-cover" />
                                 )}
                                 <button 
                                   onClick={() => {
                                     const newGallery = [...(newsItem.gallery || [])];
                                     newGallery.splice(idx, 1);
                                     updateNews(newsItem.id, "gallery", newGallery as any);
                                   }}
                                   className="absolute top-1 right-1 bg-white/80 p-1 text-red-500 hover:text-red-700 text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                   &times;
                                 </button>
                               </div>
                             ))}
                           </div>
                           <ImageUpload label="Add to Gallery" value={""} acceptType="any" onChange={(val) => {
                             if (val) {
                               const currentGallery = newsItem.gallery || [];
                               updateNews(newsItem.id, "gallery", [...currentGallery, val] as any);
                             }
                           }} />
                         </div>
                       </div>
                     </div>
                  )}
                </div>
              ))}
              <button onClick={addNews} className="border border-dashed border-black/20 py-4 uppercase tracking-widest text-xs text-black/60 hover:border-black/40 hover:text-black transition-colors">
                + Add News
              </button>
            </div>
          )}

          {activeTab === "media" && (
            <div className="flex flex-col gap-8">
              {mediaDays.map(day => (
                <div key={day.id} className="border border-black/10 p-6 flex flex-col gap-4 relative bg-gray-50/50">
                  <button onClick={() => removeMediaDay(day.id)} className="absolute top-4 right-4 text-xs text-red-500 uppercase tracking-widest hover:text-red-700">Remove Day</button>
                  <div className="flex flex-col gap-2 mb-4">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500">Day Name / Date (e.g., Day 1 - Oct 10)</label>
                    <input type="text" value={day.date || ""} onChange={(e) => updateMediaDay(day.id, "date", e.target.value)} className="border border-black/20 p-2 bg-white max-w-sm" />
                  </div>
                  
                  <div className="pl-4 border-l-2 border-black/10 flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-widest font-semibold">Links for this day</h4>
                    {day.links && day.links.map((link: any) => (
                      <div key={link.id} className="flex gap-2 items-center">
                        <input type="text" placeholder="Link Label" value={link.label || ""} onChange={(e) => updateMediaLink(day.id, link.id, "label", e.target.value)} className="border border-black/20 p-2 bg-white w-1/3 text-sm" />
                        <input type="text" placeholder="URL" value={link.url || ""} onChange={(e) => updateMediaLink(day.id, link.id, "url", e.target.value)} className="border border-black/20 p-2 bg-white flex-1 text-sm" />
                        <button onClick={() => removeMediaLink(day.id, link.id)} className="text-red-500 hover:text-red-700 text-xs uppercase p-2">✕</button>
                      </div>
                    ))}
                    <button onClick={() => addMediaLink(day.id)} className="self-start text-xs uppercase tracking-widest text-black/60 hover:text-black mt-2">+ Add Link</button>
                  </div>
                </div>
              ))}
              <button onClick={addMediaDay} className="border border-dashed border-black/20 py-4 uppercase tracking-widest text-xs text-black/60 hover:border-black/40 hover:text-black transition-colors">
                + Add Media Day
              </button>

              <div className="mt-12 pt-12 border-t border-black/10">
                <h3 className="text-xl font-display uppercase tracking-wide mb-6">Publications</h3>
                <p className="text-sm text-gray-500 mb-6">Add links to articles and news features. These will appear as image squares of varying sizes.</p>
                <div className="flex flex-col gap-8">
                  {mediaPublications.map(pub => (
                    <div key={pub.id} className="border border-black/10 p-6 flex flex-col gap-4 relative bg-gray-50/50">
                      <button onClick={() => removeMediaPublication(pub.id)} className="absolute top-4 right-4 text-xs text-red-500 uppercase tracking-widest hover:text-red-700">Remove</button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500">Source / Title</label>
                          <input type="text" value={pub.title || ""} onChange={(e) => updateMediaPublication(pub.id, "title", e.target.value)} className="border border-black/20 p-2 bg-white" placeholder="e.g. Vogue" />
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500">Article URL / File</label>
                          <ImageUpload label="Upload Article (PDF/Image) or Input URL below" value={pub.url || ""} onChange={(val) => updateMediaPublication(pub.id, "url", val)} acceptType="any" />
                          <input type="text" value={pub.url || ""} onChange={(e) => updateMediaPublication(pub.id, "url", e.target.value)} className="border border-black/20 p-2 bg-white mt-1" placeholder="Or paste external link here https://" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500">Square Size</label>
                          <select value={pub.size || "small"} onChange={(e) => updateMediaPublication(pub.id, "size", e.target.value)} className="border border-black/20 p-2 bg-white">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addMediaPublication} className="border border-dashed border-black/20 py-4 uppercase tracking-widest text-xs text-black/60 hover:border-black/40 hover:text-black transition-colors">
                    + Add Publication
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "docs" && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <ImageUpload label="Site Logo (Header)" value={logoUrl || ""} onChange={setLogoUrl} />
              </div>
              <div className="flex flex-col gap-2">
                <ImageUpload label="Favicon" value={faviconUrl || ""} onChange={setFaviconUrl} />
              </div>
              <div className="flex flex-col gap-2 border-b border-black/10 pb-8">
                <label className="text-xs uppercase tracking-widest text-gray-500">Admin Emails (comma separated)</label>
                <input 
                  type="text" 
                  value={adminEmails || ""} onChange={(e) => setAdminEmails(e.target.value)}
                  className="border border-black/20 p-3 bg-gray-50 outline-none focus:border-black font-mono text-sm"
                  placeholder="admin1@google.com, admin2@google.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Privacy Policy</label>
                <textarea 
                  value={privacyPolicy || ""} onChange={(e) => setPrivacyPolicy(e.target.value)}
                  className="border border-black/20 p-4 bg-gray-50 outline-none focus:border-black font-mono text-sm"
                  rows={8}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">Terms of Service</label>
                <textarea 
                  value={termsOfService || ""} onChange={(e) => setTermsOfService(e.target.value)}
                  className="border border-black/20 p-4 bg-gray-50 outline-none focus:border-black font-mono text-sm"
                  rows={8}
                />
              </div>
            </div>
          )}

          {activeTab === "designers" && (
            <div className="flex flex-col gap-8">
              {designersList.map((designer, i) => (
                <div key={designer.id} className="border border-black/10 flex flex-col relative bg-gray-50/50 transition-all">
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 border-b border-transparent" onClick={() => toggleDesignerExpanded(designer.id)}>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1 items-center mr-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => moveDesigner(i, -1)} disabled={i === 0} className={`text-gray-400 hover:text-black ${i === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>▲</button>
                        <button onClick={() => moveDesigner(i, 1)} disabled={i === designersList.length - 1} className={`text-gray-400 hover:text-black ${i === designersList.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}>▼</button>
                      </div>
                      <span className="font-display uppercase tracking-wide font-medium">{designer.name || "Untitled Designer"} {designer.brand && `(${designer.brand})`}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs uppercase tracking-widest text-gray-500">{expandedDesigners[designer.id] ? "Collapse" : "Expand"}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeDesigner(designer.id); }} className="text-xs text-red-500 uppercase tracking-widest hover:text-red-700 p-2">Remove</button>
                    </div>
                  </div>
                  {expandedDesigners[designer.id] && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/10">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500">Name</label>
                        <input type="text" value={designer.name || ""} onChange={(e) => updateDesigner(designer.id, "name", e.target.value)} className="border border-black/20 p-2 bg-white" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500">Brand</label>
                        <input type="text" value={designer.brand || ""} onChange={(e) => updateDesigner(designer.id, "brand", e.target.value)} className="border border-black/20 p-2 bg-white" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500">Bio</label>
                        <textarea value={designer.bio || ""} onChange={(e) => updateDesigner(designer.id, "bio", e.target.value)} className="border border-black/20 p-2 bg-white" rows={3} />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500">Instagram URL</label>
                        <input type="text" value={designer.instagramUrl || ""} onChange={(e) => updateDesigner(designer.id, "instagramUrl", e.target.value)} className="border border-black/20 p-2 bg-white" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                         <ImageUpload label="Designer Image (Cover)" value={designer.imageUrl || ""} onChange={(val) => updateDesigner(designer.id, "imageUrl", val)} acceptType="image" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 block">Designer Gallery (Popup Carousel)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                          {(designer.imageUrls || []).map((imgUrl: string, idx: number) => (
                            <div key={idx} className="relative group aspect-[3/4] bg-gray-100">
                              <img src={imgUrl || undefined} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => {
                                  const newGallery = [...(designer.imageUrls || [])];
                                  newGallery.splice(idx, 1);
                                  updateDesigner(designer.id, "imageUrls", newGallery as any);
                                }}
                                className="absolute top-1 right-1 bg-white/80 p-1 text-red-500 hover:text-red-700 text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                        <ImageUpload label="Add to Gallery" value={""} acceptType="image" onChange={(val) => {
                          if (val) {
                            const currentGallery = designer.imageUrls || [];
                            updateDesigner(designer.id, "imageUrls", [...currentGallery, val] as any);
                          }
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={addDesigner} className="border border-dashed border-black/20 py-4 uppercase tracking-widest text-xs text-black/60 hover:border-black/40 hover:text-black transition-colors">
                + Add Designer
              </button>
            </div>
          )}

          {activeTab === "partners" && (
            <div className="flex flex-col gap-8">
              {partnersList.map((partner, i) => (
                <div key={partner.id} className="border border-black/10 p-6 flex flex-col gap-4 relative bg-gray-50/50">
                  <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 bg-gray-50 p-1">
                    <button onClick={() => movePartner(i, -1)} disabled={i === 0} className={`text-gray-400 hover:text-black ${i === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>▲</button>
                    <button onClick={() => movePartner(i, 1)} disabled={i === partnersList.length - 1} className={`text-gray-400 hover:text-black ${i === partnersList.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}>▼</button>
                  </div>
                  <button onClick={() => removePartner(partner.id)} className="absolute top-4 right-4 text-xs text-red-500 uppercase tracking-widest hover:text-red-700 z-10">Remove</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Partner Name</label>
                      <input type="text" value={partner.name || ""} onChange={(e) => updatePartner(partner.id, "name", e.target.value)} className="border border-black/20 p-2 bg-white" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                       <ImageUpload label="Partner Logo" value={partner.logo || ""} onChange={(val) => updatePartner(partner.id, "logo", val)} acceptType="image" />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addPartner} className="border border-dashed border-black/20 py-4 uppercase tracking-widest text-xs text-black/60 hover:border-black/40 hover:text-black transition-colors">
                + Add Partner
              </button>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="flex flex-col gap-8">
              {scheduleList.map(item => (
                <div key={item.id} className="border border-black/10 p-6 flex flex-col gap-4 relative bg-gray-50/50">
                  <button onClick={() => removeSchedule(item.id)} className="absolute top-4 right-4 text-xs text-red-500 uppercase tracking-widest hover:text-red-700">Remove</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-transparent pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Date (YYYY-MM-DD)</label>
                      <input type="date" value={item.date || ""} onChange={(e) => updateSchedule(item.id, "date", e.target.value)} className="border border-black/20 p-2 bg-white" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Time (HH:MM)</label>
                      <input type="time" value={item.time || ""} onChange={(e) => updateSchedule(item.id, "time", e.target.value)} className="border border-black/20 p-2 bg-white" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Designer Name</label>
                      <input type="text" value={item.designerName || ""} onChange={(e) => updateSchedule(item.id, "designerName", e.target.value)} className="border border-black/20 p-2 bg-white" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Location</label>
                      <input type="text" value={item.location || ""} onChange={(e) => updateSchedule(item.id, "location", e.target.value)} className="border border-black/20 p-2 bg-white" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-gray-500">Event Type</label>
                      <input type="text" value={item.type || ""} onChange={(e) => updateSchedule(item.id, "type", e.target.value)} className="border border-black/20 p-2 bg-white" />
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input type="checkbox" id={`ticket-${item.id}`} checked={item.ticketAvailable} onChange={(e) => updateSchedule(item.id, "ticketAvailable", e.target.checked)} className="border border-black/20 bg-white" />
                      <label htmlFor={`ticket-${item.id}`} className="text-xs uppercase tracking-widest text-gray-700">Tickets Available</label>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addSchedule} className="border border-dashed border-black/20 py-4 uppercase tracking-widest text-xs text-black/60 hover:border-black/40 hover:text-black transition-colors">
                + Add Schedule Item
              </button>
            </div>
          )}

          {activeTab === "responses" && (
            <div className="flex flex-col gap-8">
              {responses.length === 0 ? (
                <div className="text-gray-500 text-sm italic py-8 text-center text-xs uppercase tracking-widest">No responses yet</div>
              ) : (
                Object.entries(
                  responses.reduce((acc: any, resp: any) => {
                    const type = resp.type || "Other";
                    if (!acc[type]) acc[type] = [];
                    acc[type].push(resp);
                    return acc;
                  }, {})
                ).map(([type, typeResponses]: [string, any]) => (
                  <div key={type} className="mb-8">
                    <h3 className="text-lg font-display uppercase tracking-widest mb-4 border-b border-black/10 pb-2">{type}</h3>
                    <div className="flex flex-col gap-4">
                      {typeResponses.map((resp: any, i: number) => (
                        <div key={i} className="border border-black/10 p-6 flex flex-col gap-2 bg-gray-50/50">
                          <div className="flex justify-between items-start mb-2 border-b border-black/10 pb-2">
                            <span className="text-xs text-gray-400">{new Date(resp.timestamp).toLocaleString()}</span>
                            <button onClick={() => removeResponse(resp.id || resp.timestamp)} className="text-[10px] text-red-500 hover:text-red-700 uppercase tracking-widest">Delete</button>
                          </div>
                          {Object.entries(resp).filter(([k]) => k !== 'type' && k !== 'timestamp' && k !== 'id').map(([k, v]) => (
                            <div key={k} className="flex gap-4">
                               <span className="text-xs uppercase tracking-widest text-gray-500 w-24 flex-shrink-0">{k}:</span>
                              <span className="text-sm">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "popup" && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 border border-black/10 p-4 bg-gray-50/50">
                <input
                  type="checkbox"
                  id="popupEnabled"
                  checked={popupEnabled}
                  onChange={(e) => setPopupEnabled(e.target.checked)}
                  className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="popupEnabled" className="text-sm uppercase tracking-widest font-medium cursor-pointer">
                  Enable Popup Window on Start
                </label>
              </div>

              {popupEnabled && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Popup Title</label>
                    <input 
                      type="text" 
                      value={popupTitle} 
                      onChange={e => setPopupTitle(e.target.value)} 
                      className="border border-black/20 p-3 w-full bg-transparent focus:outline-none focus:border-black text-sm"
                      placeholder="e.g. Exciting News!"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500">Popup Content</label>
                    <RichTextEditor 
                      value={popupContent} 
                      onChange={setPopupContent} 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-4 border border-black/10 p-4 mt-4 bg-white">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id="popupButtonEnabled"
                        checked={popupButtonEnabled}
                        onChange={(e) => setPopupButtonEnabled(e.target.checked)}
                        className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="popupButtonEnabled" className="text-xs uppercase tracking-widest font-bold cursor-pointer">
                        Enable Custom Action Button
                      </label>
                    </div>
                    {popupButtonEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500">Button Text</label>
                          <input 
                            type="text" 
                            value={popupButtonText} 
                            onChange={e => setPopupButtonText(e.target.value)} 
                            className="border border-black/20 p-2 w-full bg-transparent focus:outline-none focus:border-black text-sm"
                            placeholder="e.g. Buy Tickets"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] uppercase tracking-widest text-gray-500">Button Link</label>
                          <input 
                            type="text" 
                            value={popupButtonLink} 
                            onChange={e => setPopupButtonLink(e.target.value)} 
                            className="border border-black/20 p-2 w-full bg-transparent focus:outline-none focus:border-black text-sm"
                            placeholder="e.g. https://..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
