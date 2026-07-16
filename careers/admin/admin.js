import { db, auth } from "../js/firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const dashTabs = document.querySelectorAll('.dash-tab');
const panels = {
    'jobs-panel': document.getElementById('jobs-panel'),
    'applicants-panel': document.getElementById('applicants-panel')
};

// Modals
const jobModal = document.getElementById('jobModal');
const closeModals = document.querySelectorAll('.close-modal');
const jobForm = document.getElementById('jobForm');
const openCreateJobModalBtn = document.getElementById('openCreateJobModal');

// Data State
let currentJobs = [];
let currentApplicants = [];

// ==========================================
// Authentication
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadJobs();
        loadApplicants();
    } else {
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginError.style.display = 'none';
    } catch (error) {
        loginError.innerText = error.message;
        loginError.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', () => signOut(auth));

// ==========================================
// Tab Navigation
// ==========================================
dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        dashTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        Object.values(panels).forEach(p => p.style.display = 'none');
        panels[tab.dataset.target].style.display = 'block';
    });
});

// ==========================================
// Modal Logic
// ==========================================
openCreateJobModalBtn.addEventListener('click', () => {
    jobForm.reset();
    document.getElementById('jobId').value = '';
    document.getElementById('jobModalTitle').innerText = 'Create New Job';
    jobModal.style.display = 'block';
});

closeModals.forEach(btn => {
    btn.addEventListener('click', () => {
        jobModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target == jobModal) {
        jobModal.style.display = 'none';
    }
});

// ==========================================
// Jobs Management
// ==========================================
async function loadJobs() {
    try {
        const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        currentJobs = [];
        let html = '';
        
        if (snapshot.empty) {
            html = '<tr><td colspan="5">No jobs found.</td></tr>';
        } else {
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                data.id = docSnap.id;
                currentJobs.push(data);
                
                const statusBadge = data.isActive 
                    ? `<span class="badge active">Active</span>` 
                    : `<span class="badge inactive">Inactive</span>`;
                    
                html += `
                    <tr>
                        <td><strong>${data.title}</strong><br><small class="text-muted">/${data.slug}/</small></td>
                        <td>${data.department}</td>
                        <td>${data.location}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn edit-job" data-id="${data.id}" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="action-btn toggle-job" data-id="${data.id}" title="${data.isActive ? 'Disable' : 'Enable'}"><i class="fas ${data.isActive ? 'fa-eye-slash' : 'fa-eye'}"></i></button>
                            <button class="action-btn delete delete-job" data-id="${data.id}" title="Delete"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
        document.getElementById('jobsTableBody').innerHTML = html;
        attachJobActionListeners();
    } catch (error) {
        console.error("Error loading jobs:", error);
        document.getElementById('jobsTableBody').innerHTML = '<tr><td colspan="5">Error loading jobs. Ensure Firestore rules allow read.</td></tr>';
    }
}

jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('saveJobBtn');
    saveBtn.innerText = 'Saving...';
    saveBtn.disabled = true;

    const id = document.getElementById('jobId').value;
    const jobData = {
        title: document.getElementById('jobTitle').value,
        slug: document.getElementById('jobSlug').value,
        department: document.getElementById('jobDepartment').value,
        location: document.getElementById('jobLocation').value,
        type: document.getElementById('jobType').value,
        experience: document.getElementById('jobExperience').value,
        qualification: document.getElementById('jobQualification').value,
        salary: document.getElementById('jobSalary').value,
        description: document.getElementById('jobDescription').value,
        requirements: document.getElementById('jobRequirements').value,
        responsibilities: document.getElementById('jobResponsibilities').value,
        benefits: document.getElementById('jobBenefits').value,
        isActive: document.getElementById('jobIsActive').checked,
        updatedAt: serverTimestamp()
    };

    try {
        if (id) {
            // Update
            await updateDoc(doc(db, "jobs", id), jobData);
        } else {
            // Create
            jobData.createdAt = serverTimestamp();
            await addDoc(collection(db, "jobs"), jobData);
        }
        jobModal.style.display = 'none';
        loadJobs();
    } catch (error) {
        alert("Error saving job: " + error.message);
    } finally {
        saveBtn.innerText = 'Save Job';
        saveBtn.disabled = false;
    }
});

function attachJobActionListeners() {
    document.querySelectorAll('.edit-job').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const job = currentJobs.find(j => j.id === id);
            if (job) {
                document.getElementById('jobId').value = job.id;
                document.getElementById('jobTitle').value = job.title;
                document.getElementById('jobSlug').value = job.slug;
                document.getElementById('jobDepartment').value = job.department;
                document.getElementById('jobLocation').value = job.location;
                document.getElementById('jobType').value = job.type;
                document.getElementById('jobExperience').value = job.experience;
                document.getElementById('jobQualification').value = job.qualification || '';
                document.getElementById('jobSalary').value = job.salary || '';
                document.getElementById('jobDescription').value = job.description;
                document.getElementById('jobRequirements').value = job.requirements;
                document.getElementById('jobResponsibilities').value = job.responsibilities;
                document.getElementById('jobBenefits').value = job.benefits;
                document.getElementById('jobIsActive').checked = job.isActive;
                
                document.getElementById('jobModalTitle').innerText = 'Edit Job';
                jobModal.style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.toggle-job').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            const job = currentJobs.find(j => j.id === id);
            if (job) {
                if(confirm(`Are you sure you want to ${job.isActive ? 'disable' : 'enable'} this job?`)) {
                    await updateDoc(doc(db, "jobs", id), { isActive: !job.isActive });
                    loadJobs();
                }
            }
        });
    });

    document.querySelectorAll('.delete-job').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            if(confirm('Are you sure you want to permanently delete this job? This cannot be undone.')) {
                await deleteDoc(doc(db, "jobs", id));
                loadJobs();
            }
        });
    });
}

// ==========================================
// Applicants Management
// ==========================================
async function loadApplicants() {
    try {
        const q = query(collection(db, "applicants"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        currentApplicants = [];
        
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            data.id = docSnap.id;
            currentApplicants.push(data);
        });
        
        renderApplicantsTable();
    } catch (error) {
        console.error("Error loading applicants:", error);
        document.getElementById('applicantsTableBody').innerHTML = '<tr><td colspan="6">Error loading applicants.</td></tr>';
    }
}

function renderApplicantsTable() {
    const search = document.getElementById('searchApplicant').value.toLowerCase();
    const filter = document.getElementById('filterStatus').value;
    
    let filtered = currentApplicants.filter(a => {
        const matchesSearch = a.fullName.toLowerCase().includes(search) || a.email.toLowerCase().includes(search);
        const matchesFilter = filter ? a.status === filter : true;
        return matchesSearch && matchesFilter;
    });

    let html = '';
    if (filtered.length === 0) {
        html = '<tr><td colspan="6">No applicants found.</td></tr>';
    } else {
        filtered.forEach(a => {
            const dateStr = a.createdAt ? new Date(a.createdAt.toMillis()).toLocaleDateString() : 'N/A';
            const statusClass = 'status-' + (a.status ? a.status.toLowerCase() : 'applied');
            
            html += `
                <tr>
                    <td>
                        <strong>${a.fullName}</strong><br>
                        <small><a href="mailto:${a.email}">${a.email}</a> | ${a.mobile}</small>
                    </td>
                    <td>${a.positionAppliedFor}</td>
                    <td>${a.experience}</td>
                    <td>${dateStr}</td>
                    <td>
                        <select class="status-select badge ${statusClass}" data-id="${a.id}">
                            <option value="Applied" ${a.status === 'Applied' ? 'selected' : ''}>Applied</option>
                            <option value="Shortlisted" ${a.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
                            <option value="Interview" ${a.status === 'Interview' ? 'selected' : ''}>Interview</option>
                            <option value="Selected" ${a.status === 'Selected' ? 'selected' : ''}>Selected</option>
                            <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </td>
                    <td>
                        ${a.resumeUrl ? `<a href="${a.resumeUrl}" target="_blank" class="btn btn-sm btn-primary" style="padding: 5px 10px; font-size:0.8rem;">View Resume</a>` : 'No Resume'}
                    </td>
                </tr>
            `;
        });
    }
    document.getElementById('applicantsTableBody').innerHTML = html;
    
    // Attach status change listeners
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const id = e.target.dataset.id;
            const newStatus = e.target.value;
            try {
                await updateDoc(doc(db, "applicants", id), { status: newStatus });
                // Update local state and re-render to update badge color
                const index = currentApplicants.findIndex(x => x.id === id);
                if (index !== -1) currentApplicants[index].status = newStatus;
                renderApplicantsTable();
            } catch (err) {
                alert("Error updating status: " + err.message);
            }
        });
    });
}

document.getElementById('searchApplicant').addEventListener('input', renderApplicantsTable);
document.getElementById('filterStatus').addEventListener('change', renderApplicantsTable);
