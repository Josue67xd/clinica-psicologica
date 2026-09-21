import{defaultFirebaseConfig}from'./firebase-config.js';
const CONFIG_KEY='clinica_firebase_config_v1';
let sdk=null,app=null,auth=null,db=null,currentToken=null;

export function getSavedConfig(){try{return JSON.parse(localStorage.getItem(CONFIG_KEY)||'null')||defaultFirebaseConfig}catch{return defaultFirebaseConfig}}
export function saveConfig(config){localStorage.setItem(CONFIG_KEY,JSON.stringify(config))}
export function clearConfig(){localStorage.removeItem(CONFIG_KEY)}
export function isConfigured(){const c=getSavedConfig();return Boolean(c?.apiKey&&c?.projectId&&c?.authDomain&&c?.appId)}

export async function initialize(){
  if(!isConfigured())return false;
  const [{initializeApp},{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged},{getFirestore,collection,addDoc,getDocs,query,where,serverTimestamp,doc,updateDoc,deleteDoc}]=await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js')
  ]);
  sdk={GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,collection,addDoc,getDocs,query,where,serverTimestamp,doc,updateDoc,deleteDoc};
  app=initializeApp(getSavedConfig());auth=getAuth(app);db=getFirestore(app);return true;
}

export function onUser(callback){if(!auth){callback(null);return()=>{}}return sdk.onAuthStateChanged(auth,callback)}
export async function signIn(withCalendar=false){
  if(!auth)throw new Error('CONFIG_REQUIRED');
  const provider=new sdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
  if(withCalendar)provider.addScope('https://www.googleapis.com/auth/calendar.events');
  const result=await sdk.signInWithPopup(auth,provider);
  if(withCalendar)currentToken=sdk.GoogleAuthProvider.credentialFromResult(result)?.accessToken||null;
  return result.user;
}
export async function logOut(){if(auth)await sdk.signOut(auth)}
export function user(){return auth?.currentUser||null}

function requireUser(){const u=user();if(!u)throw new Error('AUTH_REQUIRED');return u}
function clean(value){if(value===undefined)return null;if(Array.isArray(value))return value.map(clean);if(value&&typeof value==='object'&&!(value instanceof Date))return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,clean(v)]));return value}

export async function createRecord(kind,data){const u=requireUser();const ref=await sdk.addDoc(sdk.collection(db,kind),{...clean(data),ownerId:u.uid,createdAt:sdk.serverTimestamp(),updatedAt:sdk.serverTimestamp()});return{id:ref.id,...data}}
export async function listRecords(kind){requireUser();const snap=await sdk.getDocs(sdk.collection(db,kind));return snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(b.date||b.createdAt?.seconds||'').localeCompare(String(a.date||a.createdAt?.seconds||'')))}
export async function updateRecord(kind,id,data){requireUser();await sdk.updateDoc(sdk.doc(db,kind,id),{...clean(data),updatedAt:sdk.serverTimestamp()})}
export async function deleteRecord(kind,id){requireUser();await sdk.deleteDoc(sdk.doc(db,kind,id))}

export async function createCalendarEvent(record){
  if(!currentToken)await signIn(true);
  if(!currentToken)throw new Error('CALENDAR_AUTH_REQUIRED');
  const date=record.date,time=record.time||'09:00',duration=Number(record.durationMinutes||50);
  const start=new Date(`${date}T${time}:00`),end=new Date(start.getTime()+duration*60000);
  const body={summary:record.title||`${record.type}: ${record.patientName||record.audience||''}`,description:record.notes||'',start:{dateTime:start.toISOString(),timeZone:'America/Guatemala'},end:{dateTime:end.toISOString(),timeZone:'America/Guatemala'}};
  const response=await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events',{method:'POST',headers:{Authorization:`Bearer ${currentToken}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(response.status===401){currentToken=null;throw new Error('CALENDAR_TOKEN_EXPIRED')}
  if(!response.ok)throw new Error(`CALENDAR_${response.status}`);
  return response.json();
}
