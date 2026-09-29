// js/firebase-init.js

const firebaseConfig = {
  apiKey: "AIzaSyB8XGJKxo9jTJDB7UtMpQBuoCT_wqHdEfQ",
  authDomain: "studio-5037599641-c95bb.firebaseapp.com",
  projectId: "studio-5037599641-c95bb",
  storageBucket: "studio-5037599641-c95bb.firebasestorage.app",
  messagingSenderId: "926423630278",
  appId: "1:926423630278:web:863385eebd09961c49f2c7"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const dbFirestore = firebase.firestore();
const authFirebase = firebase.auth();

// Global Sync Function
async function syncFirebaseToLocal() {
    try {
        const masterRef = dbFirestore.collection('solis').doc('masterData');
        const bomRef = dbFirestore.collection('solis').doc('bomTemplates');

        const [masterSnap, bomSnap] = await Promise.all([masterRef.get(), bomRef.get()]);

        let updated = false;

        if (masterSnap.exists) {
            const fbMaster = masterSnap.data();
            const localMaster = localStorage.getItem('solis-master-data');
            
            // Schema validation: if firebase has old schema or is missing required collections, force push local up
            if (
                fbMaster.panels !== undefined || 
                fbMaster.panelProducts === undefined ||
                fbMaster.inverterProducts === undefined ||
                !fbMaster.supply || 
                !fbMaster.profitMargins
            ) {
                if (localMaster) {
                    await masterRef.set(JSON.parse(localMaster));
                    console.log("Forced push of new Master schema to Firebase");
                }
            } else {
                let needsUpdate = false;
                
                // Migrate legacy supply items that lack a category or have an invalid old category
                if (fbMaster.supply) {
                    const validCategories = DEFAULT_MASTER_DATA.SUPPLY_CATEGORIES || [];
                    for (const item in fbMaster.supply) {
                        const currentCat = fbMaster.supply[item].category;
                        if (!currentCat || !validCategories.includes(currentCat)) {
                            // Find default category from db.js, or fallback to Uncategorized
                            const defaultCat = DEFAULT_MASTER_DATA.supply[item] 
                                ? DEFAULT_MASTER_DATA.supply[item].category 
                                : 'Uncategorized';
                            fbMaster.supply[item].category = defaultCat;
                            needsUpdate = true;
                        }
                    }
                }
                
                const fbMasterStr = JSON.stringify(fbMaster);
                if (localMaster !== fbMasterStr) {
                    localStorage.setItem('solis-master-data', fbMasterStr);
                    updated = true;
                }
                
                // If we performed a migration, push the fixed structure back up
                if (needsUpdate) {
                    await masterRef.set(fbMaster);
                    console.log("Migrated and pushed categorized supply items to Firebase");
                }
            }
        }

        if (bomSnap.exists) {
            const fbBom = bomSnap.data();
            const localBom = localStorage.getItem('solis-bom-templates');
            
            // Schema validation for BOM
            // If fbBom is empty, missing On-Grid, force push local up
            if (Object.keys(fbBom).length === 0 || !fbBom['On-Grid']) {
                if (localBom) {
                    await bomRef.set(JSON.parse(localBom));
                    console.log("Forced push of new BOM schema to Firebase");
                }
            } else {
                const fbBomStr = JSON.stringify(fbBom);
                if (localBom !== fbBomStr) {
                    localStorage.setItem('solis-bom-templates', fbBomStr);
                    updated = true;
                }
            }
        }

        return updated;
    } catch (e) {
        console.error("Firebase Sync Error:", e);
        return false;
    }
}

// Global Save Hooks (to be called by db.js)
async function pushMasterToFirebase(data) {
    try {
        await dbFirestore.collection('solis').doc('masterData').set(data);
    } catch(e) { console.error("Error pushing master data:", e); }
}

async function pushBOMToFirebase(data) {
    try {
        await dbFirestore.collection('solis').doc('bomTemplates').set(data);
    } catch(e) { console.error("Error pushing BOM templates:", e); }
}

async function saveQuoteToFirebase(quoteData, quoteId = null) {
    try {
        const enrichedData = {
            ...quoteData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdByEmail: sessionStorage.getItem('solis_user_email') || 'Unknown',
            createdByRole: sessionStorage.getItem('solis_user_role') || 'Unknown'
        };

        if (quoteId) {
            // Update existing
            await dbFirestore.collection('solis-quotes').doc(quoteId).update(enrichedData);
            console.log("Quote updated with ID:", quoteId);
            return quoteId;
        } else {
            // Create new
            enrichedData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            const docRef = await dbFirestore.collection('solis-quotes').add(enrichedData);
            console.log("Quote saved with ID:", docRef.id);
            return docRef.id;
        }
    } catch (e) {
        console.error("Error saving quote to Firebase:", e);
        return null;
    }
}
