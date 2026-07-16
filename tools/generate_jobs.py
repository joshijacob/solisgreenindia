import os
import json

jobs = [
    {
        "title": "Solar Project Engineer",
        "slug": "solar-project-engineer",
        "department": "Engineering",
        "type": "Full Time",
        "location": "Kerala (Various Districts)",
        "experience": "2-4 Years",
        "qualification": "B.Tech in Electrical/Mechanical Engineering",
        "salary": "As per industry standards",
        "description": "We are looking for an experienced Solar Project Engineer to lead the design, execution, and commissioning of rooftop and ground-mounted solar projects.",
        "requirements": "<ul><li>Proven experience in solar EPC projects.</li><li>Strong knowledge of PVsyst, AutoCAD, and electrical drawings.</li><li>Understanding of KSEB regulations and net-metering processes.</li><li>Strong project management skills.</li></ul>",
        "responsibilities": "<ul><li>Design and engineer solar PV systems.</li><li>Manage site execution teams and ensure timely project completion.</li><li>Coordinate with clients and KSEB officials.</li><li>Ensure compliance with safety and quality standards.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Travel Allowance</li><li>Performance Incentives</li><li>Health Insurance</li></ul>"
    },
    {
        "title": "Solar Site Supervisor",
        "slug": "solar-site-supervisor",
        "department": "Operations",
        "type": "Full Time",
        "location": "Kerala (Various Districts)",
        "experience": "1-3 Years",
        "qualification": "Diploma in Electrical/Civil Engineering",
        "salary": "Based on experience",
        "description": "Responsible for the day-to-day supervision of solar installation sites, ensuring quality of work and strict adherence to safety protocols.",
        "requirements": "<ul><li>Experience in managing labor and site activities.</li><li>Ability to read engineering drawings.</li><li>Willingness to travel.</li><li>Valid two-wheeler license.</li></ul>",
        "responsibilities": "<ul><li>Supervise panel mounting and wiring.</li><li>Manage material delivery and inventory at site.</li><li>Ensure site safety compliance.</li><li>Report daily progress to the Project Manager.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Travel Allowance</li><li>Safety Gear Provided</li></ul>"
    },
    {
        "title": "Electrical Technician",
        "slug": "electrical-technician",
        "department": "Engineering",
        "type": "Full Time",
        "location": "Kerala (Various Districts)",
        "experience": "1+ Years",
        "qualification": "ITI Electrical / Wireman License",
        "salary": "Based on experience",
        "description": "Skilled electrical technician needed for DC/AC wiring, inverter installation, and earthing for solar PV systems.",
        "requirements": "<ul><li>ITI certification in electrical trade.</li><li>Valid wireman license is a plus.</li><li>Experience in solar wiring or general electrical contracting.</li></ul>",
        "responsibilities": "<ul><li>Execute AC and DC wiring safely.</li><li>Install and configure solar inverters.</li><li>Perform earthing and lightning arrester installations.</li><li>Assist in system testing and commissioning.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Overtime Pay</li><li>Safety Equipment Provided</li></ul>"
    },
    {
        "title": "Solar Installation Technician",
        "slug": "solar-installation-technician",
        "department": "Operations",
        "type": "Full Time",
        "location": "Kerala (Various Districts)",
        "experience": "0-2 Years",
        "qualification": "ITI / Plus Two",
        "salary": "Based on experience",
        "description": "Join our field operations team to install solar mounting structures and modules on residential and commercial rooftops.",
        "requirements": "<ul><li>Physical fitness and ability to work at heights.</li><li>Basic understanding of tools and hardware.</li><li>Strong commitment to safety.</li></ul>",
        "responsibilities": "<ul><li>Assemble and fix anodized aluminum mounting structures.</li><li>Securely mount solar panels.</li><li>Assist electrical technicians as needed.</li><li>Maintain site cleanliness.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Safety Gear Provided</li><li>On-the-job Training</li></ul>"
    },
    {
        "title": "Sales Executive",
        "slug": "sales-executive",
        "department": "Sales",
        "type": "Full Time",
        "location": "Trivandrum / Kollam / Pathanamthitta",
        "experience": "1-3 Years",
        "qualification": "Any Degree",
        "salary": "Fixed Salary + High Incentives",
        "description": "We are seeking a dynamic Sales Executive to drive residential and commercial solar sales in local markets.",
        "requirements": "<ul><li>Proven track record in direct sales.</li><li>Excellent communication and negotiation skills.</li><li>Own two-wheeler is mandatory.</li><li>Knowledge of solar industry is a plus but not required.</li></ul>",
        "responsibilities": "<ul><li>Generate leads and conduct site visits.</li><li>Explain ROI and benefits of solar to customers.</li><li>Prepare and present proposals.</li><li>Close sales and achieve monthly targets.</li></ul>",
        "benefits": "<ul><li>Uncapped Incentives</li><li>Travel Allowance</li><li>Career Growth Opportunities</li></ul>"
    },
    {
        "title": "Marketing Executive",
        "slug": "marketing-executive",
        "department": "Sales",
        "type": "Full Time",
        "location": "Thiruvalla",
        "experience": "1-2 Years",
        "qualification": "Degree in Marketing/Business",
        "salary": "Based on experience",
        "description": "Looking for a creative Marketing Executive to handle social media, local campaigns, and lead generation.",
        "requirements": "<ul><li>Experience in digital marketing and social media management.</li><li>Basic graphic design skills (Canva/Photoshop).</li><li>Strong copywriting skills in English and Malayalam.</li></ul>",
        "responsibilities": "<ul><li>Manage social media accounts.</li><li>Run local advertising campaigns.</li><li>Organize local awareness camps.</li><li>Track marketing ROI.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Performance Bonus</li><li>Creative Work Environment</li></ul>"
    },
    {
        "title": "Office Administrator",
        "slug": "office-administrator",
        "department": "Administration",
        "type": "Full Time",
        "location": "Thiruvalla",
        "experience": "1-3 Years",
        "qualification": "Any Degree",
        "salary": "Based on experience",
        "description": "Manage day-to-day office operations, handle inquiries, and support the management team.",
        "requirements": "<ul><li>Excellent organizational skills.</li><li>Proficiency in MS Office.</li><li>Good communication skills in Malayalam and English.</li></ul>",
        "responsibilities": "<ul><li>Manage front desk and incoming calls.</li><li>Maintain office records and files.</li><li>Coordinate with field teams.</li><li>Assist in HR documentation.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Fixed Working Hours</li><li>Pleasant Office Environment</li></ul>"
    },
    {
        "title": "Customer Support Executive",
        "slug": "customer-support-executive",
        "department": "Administration",
        "type": "Full Time",
        "location": "Thiruvalla",
        "experience": "0-2 Years",
        "qualification": "Any Degree",
        "salary": "Based on experience",
        "description": "Be the first point of contact for our customers. Handle queries, schedule site visits, and coordinate after-sales support.",
        "requirements": "<ul><li>Pleasant telephone etiquette.</li><li>Patience and problem-solving attitude.</li><li>Basic computer skills.</li></ul>",
        "responsibilities": "<ul><li>Answer inbound customer calls.</li><li>Log service requests and AMC schedules.</li><li>Follow up with customers for feedback.</li><li>Maintain customer database.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Training Provided</li><li>Performance Bonus</li></ul>"
    },
    {
        "title": "Accounts Assistant",
        "slug": "accounts-assistant",
        "department": "Administration",
        "type": "Full Time",
        "location": "Thiruvalla",
        "experience": "1-3 Years",
        "qualification": "B.Com / Tally Certified",
        "salary": "Based on experience",
        "description": "Handle day-to-day accounting, invoicing, and support financial reporting.",
        "requirements": "<ul><li>Proficiency in Tally Prime.</li><li>Knowledge of GST filing and basic taxation.</li><li>Attention to detail.</li></ul>",
        "responsibilities": "<ul><li>Generate invoices and track payments.</li><li>Maintain daily ledgers.</li><li>Assist in month-end closing and GST preparation.</li><li>Process vendor payments.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Fixed Working Hours</li></ul>"
    },
    {
        "title": "Store Keeper",
        "slug": "store-keeper",
        "department": "Operations",
        "type": "Full Time",
        "location": "Thiruvalla",
        "experience": "1-2 Years",
        "qualification": "Plus Two / Degree",
        "salary": "Based on experience",
        "description": "Manage our inventory of solar panels, inverters, cables, and mounting structures.",
        "requirements": "<ul><li>Experience in inventory management.</li><li>Basic computer knowledge for data entry.</li><li>Honesty and reliability.</li></ul>",
        "responsibilities": "<ul><li>Receive and inspect incoming materials.</li><li>Issue materials to site teams securely.</li><li>Maintain accurate stock registers.</li><li>Conduct regular physical stock audits.</li></ul>",
        "benefits": "<ul><li>Competitive Salary</li><li>Stable Job</li></ul>"
    },
    {
        "title": "Internship Program",
        "slug": "internship-program",
        "department": "Engineering/Sales",
        "type": "Internship",
        "location": "Thiruvalla",
        "experience": "Fresher",
        "qualification": "B.Tech / Diploma / Degree Students",
        "salary": "Stipend Provided",
        "description": "Kickstart your career in the renewable energy sector with our structured 3-month internship program.",
        "requirements": "<ul><li>Strong passion for renewable energy.</li><li>Eagerness to learn.</li><li>Currently pursuing or recently completed degree/diploma.</li></ul>",
        "responsibilities": "<ul><li>Shadow senior engineers or sales executives.</li><li>Assist in project documentation or market research.</li><li>Complete assigned learning modules.</li></ul>",
        "benefits": "<ul><li>Monthly Stipend</li><li>Certificate of Completion</li><li>Pre-Placement Offer (PPO) for top performers</li></ul>"
    }
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>{title} | Careers at Solis Green Energy Solutions</title>

<meta name="description" content="Apply for the {title} position at Solis Green Energy Solutions. Join our {department} team and help build sustainable energy in Kerala." />

<link rel="canonical" href="https://www.solisgreenindia.in/careers/{slug}/" />

<!-- FAVICON -->
<link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">

<link rel="stylesheet" href="/style.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<style>
.job-header {{
  background: linear-gradient(rgba(11, 69, 122, 0.9), rgba(0, 136, 204, 0.9)), url('https://images.unsplash.com/photo-1508514177221-188b1c77eca2?auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  padding: 120px 0 60px;
  color: #fff;
  margin-top: 80px;
}}
.job-meta-header {{
    display: flex;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
    font-size: 1.1rem;
}}
.job-meta-header span {{ display: flex; align-items: center; gap: 8px; }}

.job-content-layout {{
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    margin: 60px 0;
}}
@media(max-width: 992px) {{
    .job-content-layout {{ grid-template-columns: 1fr; }}
}}
.job-details h3 {{
    color: var(--primary-dark);
    margin-top: 30px;
    margin-bottom: 15px;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
}}
.job-details ul {{
    list-style-type: none;
    padding-left: 0;
}}
.job-details ul li {{
    position: relative;
    padding-left: 25px;
    margin-bottom: 10px;
    line-height: 1.6;
}}
.job-details ul li::before {{
    content: '\\f00c';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    position: absolute;
    left: 0;
    color: var(--primary-blue);
}}
.application-card {{
    background: #f8faff;
    padding: 30px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    position: sticky;
    top: 100px;
}}
.form-group {{ margin-bottom: 20px; }}
.form-group label {{ display: block; margin-bottom: 8px; font-weight: 600; color: #333; }}
.form-control {{
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: inherit;
}}
.file-upload-wrapper {{
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 100%;
}}
.file-upload-wrapper input[type=file] {{
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}}
.btn-upload {{
    background: white;
    border: 2px dashed #0088cc;
    color: #0088cc;
    padding: 20px;
    text-align: center;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
    font-weight: bold;
}}
</style>

<!-- JobPosting Schema -->
<script type="application/ld+json">
{{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "{title}",
  "description": "{description}",
  "hiringOrganization" : {{
    "@type": "Organization",
    "name": "Solis Green Energy Solutions",
    "sameAs": "https://www.solisgreenindia.in"
  }},
  "employmentType": "{type_schema}",
  "jobLocation": {{
    "@type": "Place",
    "address": {{
      "@type": "PostalAddress",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    }}
  }}
}}
</script>

</head>
<body>

<header class="solis-header">
<div class="header-inner">
<div class="header-logo">
<a href="/"><img src="/images/logo/logo.png" alt="Solis Green Energy Solutions"></a>
</div>
<nav class="header-menu" id="mainNav">
<a href="/">Home</a>
<a href="/services/">Services</a>
<a href="/cities/">Service Areas</a>
<a href="/projects/">Projects</a>
<a href="/about/">About</a>
<a href="/careers/" class="active">Careers</a>
</nav>
<div class="header-cta">
<a href="tel:8301849474" class="contact-btn">Call</a>
<button class="mobile-menu-btn">☰</button>
</div>
</div>
</header>

<section class="job-header">
<div class="container">
    <a href="/careers/" style="color: #fff; text-decoration: none; margin-bottom: 20px; display: inline-block;">
        <i class="fas fa-arrow-left"></i> Back to Careers
    </a>
    <h1>{title}</h1>
    <div class="job-meta-header">
        <span><i class="fas fa-building"></i> {department}</span>
        <span><i class="fas fa-map-marker-alt"></i> {location}</span>
        <span><i class="fas fa-briefcase"></i> {type}</span>
        <span><i class="fas fa-clock"></i> Exp: {experience}</span>
    </div>
</div>
</section>

<section class="container">
<div class="job-content-layout">
    <div class="job-details">
        <h3>Job Overview</h3>
        <p>{description}</p>
        
        <h3>Responsibilities</h3>
        {responsibilities}
        
        <h3>Requirements & Qualifications</h3>
        {requirements}
        <p><strong>Education:</strong> {qualification}</p>
        <p><strong>Salary:</strong> {salary}</p>
        
        <h3>Benefits</h3>
        {benefits}
    </div>
    
    <div>
        <div class="application-card">
            <h3 style="margin-bottom: 20px; color: var(--primary-dark);">Apply for this position</h3>
            <form id="applicationForm">
                <input type="hidden" id="jobTitleApplied" value="{title}">
                
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" id="fullName" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label>Email Address *</label>
                    <input type="email" id="email" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" id="mobile" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label>Total Experience *</label>
                    <input type="text" id="experienceLevel" class="form-control" placeholder="e.g. 2 Years" required>
                </div>
                
                <div class="form-group">
                    <label>Upload Resume (PDF, DOC) *</label>
                    <div class="file-upload-wrapper">
                        <div class="btn-upload" id="uploadText"><i class="fas fa-cloud-upload-alt"></i> Click to select file</div>
                        <input type="file" id="resumeFile" accept=".pdf,.doc,.docx" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Cover Letter / Message</label>
                    <textarea id="message" class="form-control" rows="3"></textarea>
                </div>
                
                <div class="form-group" style="font-size: 0.9rem;">
                    <label style="font-weight: normal; display: flex; align-items: flex-start; gap: 10px;">
                        <input type="checkbox" required style="margin-top: 4px;">
                        I confirm that the information provided is correct and I consent to Solis Green Energy Solutions processing my data for recruitment purposes.
                    </label>
                </div>
                
                <button type="submit" id="submitBtn" class="btn btn-primary btn-block">Submit Application</button>
                <div id="formStatus" style="margin-top: 15px; font-weight: bold; text-align: center;"></div>
            </form>
        </div>
    </div>
</div>
</section>

<div id="footer-placeholder"></div>

<script src="/script.js"></script>

<!-- Firebase Application Logic -->
<script type="module">
import {{ db, storage }} from "/careers/js/firebase-config.js";
import {{ collection, addDoc, serverTimestamp }} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {{ ref, uploadBytes, getDownloadURL }} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const fileInput = document.getElementById('resumeFile');
const uploadText = document.getElementById('uploadText');

fileInput.addEventListener('change', function() {{
    if(this.files && this.files.length > 0) {{
        uploadText.innerHTML = '<i class="fas fa-file-check"></i> ' + this.files[0].name;
    }}
}});

document.getElementById('applicationForm').addEventListener('submit', async (e) => {{
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('formStatus');
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Uploading Resume...";
    statusDiv.innerText = "";
    statusDiv.style.color = "#333";
    
    try {{
        // 1. Upload Resume
        const file = fileInput.files[0];
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storageRef = ref(storage, `resumes/${{timestamp}}_${{safeName}}`);
        
        await uploadBytes(storageRef, file);
        const resumeUrl = await getDownloadURL(storageRef);
        
        submitBtn.innerText = "Saving Application...";
        
        // 2. Save to Firestore
        const applicationData = {{
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            experience: document.getElementById('experienceLevel').value,
            message: document.getElementById('message').value,
            positionAppliedFor: document.getElementById('jobTitleApplied').value,
            resumeUrl: resumeUrl,
            status: "Applied",
            createdAt: serverTimestamp()
        }};
        
        await addDoc(collection(db, "applicants"), applicationData);
        
        // Success
        statusDiv.style.color = "green";
        statusDiv.innerText = "Application submitted successfully! We will contact you soon.";
        document.getElementById('applicationForm').reset();
        uploadText.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Click to select file';
        
    }} catch (error) {{
        console.error(error);
        statusDiv.style.color = "red";
        statusDiv.innerText = "An error occurred. Please try again later.";
    }} finally {{
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Application";
    }}
}});
</script>

</body>
</html>"""

base_dir = r"d:\Antigravity\solisgreenindia.in\careers"

for job in jobs:
    job_dir = os.path.join(base_dir, job['slug'])
    os.makedirs(job_dir, exist_ok=True)
    
    # Map employment type to schema type
    type_schema = "FULL_TIME"
    if job['type'] == "Part Time": type_schema = "PART_TIME"
    elif job['type'] == "Contract": type_schema = "CONTRACTOR"
    elif job['type'] == "Internship": type_schema = "INTERN"
    
    html = template.format(
        title=job['title'],
        slug=job['slug'],
        department=job['department'],
        type=job['type'],
        location=job['location'],
        experience=job['experience'],
        qualification=job['qualification'],
        salary=job['salary'],
        description=job['description'],
        requirements=job['requirements'],
        responsibilities=job['responsibilities'],
        benefits=job['benefits'],
        type_schema=type_schema
    )
    
    with open(os.path.join(job_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)

print("Generated all 11 job pages successfully.")
