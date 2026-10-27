import { db, auth } from "../js/firebase-config.js";
import { 
    signInAnonymously,
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Elements
const dashTabs = document.querySelectorAll('.dash-tab');
const panels = {
    'jobs-panel': document.getElementById('jobs-panel'),
    'applicants-panel': document.getElementById('applicants-panel')
};

// Modals
const jobModal = document.getElementById('jobModal');
const closeModals = document.querySelectorAll('.close-modal, .close-modal-btn');
const jobForm = document.getElementById('jobForm');
const openCreateJobModalBtn = document.getElementById('openCreateJobModal');

// Data State
let currentJobs = [];
let currentApplicants = [];

// ==========================================
// Central Authentication & Silent Firebase Sync
// ==========================================
function initAdminAuth() {
    const isAuth = sessionStorage.getItem('solis_auth_token') === 'true' || localStorage.getItem('solis_auth_token') === 'true';
    if (!isAuth) {
        const redirect = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = '/Login/index.html?redirect=' + redirect;
        return;
    }

    // Set user email in navbar badge if present
    const emailBadge = document.getElementById('userEmailBadge');
    if (emailBadge) {
        const email = sessionStorage.getItem('solis_user_email') || localStorage.getItem('solis_user_email') || 'admin@solisgreenindia.in';
        emailBadge.textContent = email;
    }

    // Silent anonymous auth in Firebase to satisfy Firestore rules
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            signInAnonymously(auth).catch(err => {
                console.debug('Silent anonymous auth status:', err.message);
            });
        }
    });

    // Load Dashboard Data Immediately
    loadJobs();
    loadApplicants();
}

// ==========================================
// Tab Navigation
// ==========================================
dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        dashTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        Object.values(panels).forEach(p => p.style.display = 'none');
        const targetPanel = panels[tab.dataset.target];
        if (targetPanel) targetPanel.style.display = 'block';
    });
});

// ==========================================
// Modal Logic
// ==========================================
if (openCreateJobModalBtn) {
    openCreateJobModalBtn.addEventListener('click', () => {
        jobForm.reset();
        document.getElementById('jobId').value = '';
        document.getElementById('jobModalTitle').innerText = 'Create New Job Posting';
        jobModal.style.display = 'block';
    });
}

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
    const tbody = document.getElementById('jobsTableBody');
    try {
        const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        currentJobs = [];
        let html = '';
        
        if (snapshot.empty) {
            html = '<tr><td colspan="5" class="text-center py-4 text-muted"><i class="fa-solid fa-briefcase fs-3 mb-2 d-block opacity-50"></i>No job postings configured yet. Click "Create New Job Posting" above.</td></tr>';
        } else {
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                data.id = docSnap.id;
                currentJobs.push(data);
                
                const statusBadge = data.isActive 
                    ? `<span class="badge-custom active"><i class="fa-solid fa-circle text-success me-1" style="font-size:0.45rem;"></i> Active</span>` 
                    : `<span class="badge-custom inactive">Inactive</span>`;
                    
                html += `
                    <tr>
                        <td>
                            <strong>${data.title}</strong>
                            <br><small class="text-muted font-mono" style="font-size:0.75rem;">/careers/${data.slug}/</small>
                        </td>
                        <td>${data.department || '-'}</td>
                        <td>${data.location || 'Kerala'}</td>
                        <td>${statusBadge}</td>
                        <td class="text-center text-nowrap">
                            <button class="action-btn edit-job" data-id="${data.id}" title="Edit Job Posting"><i class="fas fa-edit text-primary"></i></button>
                            <button class="action-btn toggle-job" data-id="${data.id}" title="${data.isActive ? 'Disable' : 'Enable'}"><i class="fas ${data.isActive ? 'fa-eye-slash text-warning' : 'fa-eye text-success'}"></i></button>
                            <button class="action-btn delete delete-job" data-id="${data.id}" title="Delete"><i class="fas fa-trash-can text-danger"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
        tbody.innerHTML = html;
        attachJobActionListeners();
    } catch (error) {
        console.error("Error loading jobs:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Error loading jobs. Please check network connection.</td></tr>';
    }
}

jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('saveJobBtn');
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Saving...';
    saveBtn.disabled = true;

    const id = document.getElementById('jobId').value;
    const jobData = {
        title: document.getElementById('jobTitle').value.trim(),
        slug: document.getElementById('jobSlug').value.trim(),
        department: document.getElementById('jobDepartment').value.trim(),
        location: document.getElementById('jobLocation').value.trim(),
        type: document.getElementById('jobType').value,
        experience: document.getElementById('jobExperience').value.trim(),
        qualification: document.getElementById('jobQualification').value.trim(),
        salary: document.getElementById('jobSalary').value.trim(),
        description: document.getElementById('jobDescription').value.trim(),
        requirements: document.getElementById('jobRequirements').value.trim(),
        responsibilities: document.getElementById('jobResponsibilities').value.trim(),
        benefits: document.getElementById('jobBenefits').value.trim(),
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
        saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i> Save Job Posting';
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
                document.getElementById('jobTitle').value = job.title || '';
                document.getElementById('jobSlug').value = job.slug || '';
                document.getElementById('jobDepartment').value = job.department || '';
                document.getElementById('jobLocation').value = job.location || '';
                document.getElementById('jobType').value = job.type || 'Full Time';
                document.getElementById('jobExperience').value = job.experience || '';
                document.getElementById('jobQualification').value = job.qualification || '';
                document.getElementById('jobSalary').value = job.salary || '';
                document.getElementById('jobDescription').value = job.description || '';
                document.getElementById('jobRequirements').value = job.requirements || '';
                document.getElementById('jobResponsibilities').value = job.responsibilities || '';
                document.getElementById('jobBenefits').value = job.benefits || '';
                document.getElementById('jobIsActive').checked = job.isActive !== false;
                
                document.getElementById('jobModalTitle').innerText = 'Edit Job Posting';
                jobModal.style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.toggle-job').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            const job = currentJobs.find(j => j.id === id);
            if (job) {
                const action = job.isActive ? 'disable' : 'enable';
                if (confirm(`Are you sure you want to ${action} this job posting?`)) {
                    await updateDoc(doc(db, "jobs", id), { isActive: !job.isActive });
                    loadJobs();
                }
            }
        });
    });

    document.querySelectorAll('.delete-job').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm('Are you sure you want to permanently delete this job posting? This cannot be undone.')) {
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
    const tbody = document.getElementById('applicantsTableBody');
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
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No applicants found yet or loading error.</td></tr>';
    }
}

function renderApplicantsTable() {
    const search = (document.getElementById('searchApplicant').value || '').toLowerCase();
    const filter = document.getElementById('filterStatus').value;
    
    let filtered = currentApplicants.filter(a => {
        const nameMatch = (a.fullName || '').toLowerCase().includes(search);
        const emailMatch = (a.email || '').toLowerCase().includes(search);
        const matchesFilter = filter ? a.status === filter : true;
        return (nameMatch || emailMatch) && matchesFilter;
    });

    let html = '';
    if (filtered.length === 0) {
        html = '<tr><td colspan="6" class="text-center py-4 text-muted"><i class="fa-solid fa-inbox fs-3 mb-2 d-block opacity-50"></i>No applicants match the criteria.</td></tr>';
    } else {
        filtered.forEach(a => {
            const dateStr = a.createdAt ? new Date(a.createdAt.toMillis ? a.createdAt.toMillis() : a.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : 'N/A';
            const statusClass = 'status-' + (a.status ? a.status.toLowerCase() : 'applied');
            
            html += `
                <tr>
                    <td>
                        <strong class="text-dark">${a.fullName || 'Candidate'}</strong><br>
                        <small class="text-muted">
                            <a href="mailto:${a.email || ''}" class="text-decoration-none">${a.email || '-'}</a> | 
                            <a href="tel:${a.mobile || ''}" class="text-decoration-none text-muted">${a.mobile || '-'}</a>
                        </small>
                    </td>
                    <td><span class="badge bg-light text-dark border">${a.positionAppliedFor || 'General Application'}</span></td>
                    <td>${a.experience || '-'}</td>
                    <td class="small text-muted">${dateStr}</td>
                    <td>
                        <select class="status-select ${statusClass}" data-id="${a.id}">
                            <option value="Applied" ${a.status === 'Applied' ? 'selected' : ''}>Applied</option>
                            <option value="Shortlisted" ${a.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
                            <option value="Interview" ${a.status === 'Interview' ? 'selected' : ''}>Interview</option>
                            <option value="Selected" ${a.status === 'Selected' ? 'selected' : ''}>Selected</option>
                            <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </td>
                    <td>
                        ${a.resumeUrl ? `<a href="${a.resumeUrl}" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1" style="font-size:0.75rem;"><i class="fa-solid fa-file-pdf me-1"></i> View Resume</a>` : '<span class="text-muted small">No Resume</span>'}
                    </td>
                </tr>
            `;
        });
    }
    document.getElementById('applicantsTableBody').innerHTML = html;
    
    // Status update listeners
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const id = e.target.dataset.id;
            const newStatus = e.target.value;
            try {
                await updateDoc(doc(db, "applicants", id), { status: newStatus });
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

// Initialize Auth & Dashboard
initAdminAuth();
