// content.js

// --- INJECT SPY ---
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(s);


// --- MAIN LISTENER ---
window.addEventListener("message", function(event) {
    if (event.source != window) return;

    // Handler 1: Standard Job Listing Page
    if (event.data.type === "NAUKRI_JOB_DATA") {
        const data = event.data.payload;
        if (data && data.jobDetails) {
            const applyCount = parseInt(data.jobDetails.applyCount) || 0;
            const viewCount = parseInt(data.jobDetails.viewCount) || 0;
            const vacancy = parseInt(data.jobDetails.vacancy) || 1;
            const salaryLabel = data.jobDetails.salaryDetail?.label || "Not Disclosed";

            setTimeout(() => {
                createJobDashboard(applyCount, viewCount, vacancy, salaryLabel);
            }, 1000);
        }
    }

    // Handler 2: Inbox Page
    if (event.data.type === "NAUKRI_INBOX_DATA") {
        const data = event.data.payload;
        if (data && data.mail && data.mail.jobDetails && data.mail.jobDetails.jobCtc) {
            const min = data.mail.jobDetails.jobCtc.minimum;
            const max = data.mail.jobDetails.jobCtc.maximum;
            
            // Format: "2.0 - 4.5"
            let salaryText = "Not Disclosed";
            if (min !== undefined && max !== undefined) {
                salaryText = `₹${min} - ${max} LPA`;
            }

            // Start looking for the DOM to appear
            attemptInjectInbox(salaryText, 0);
        }
    }
});


// --- RETRY LOGIC FOR INBOX ---
function attemptInjectInbox(salaryText, attempt) {
    // Try to find the container
    const success = createInboxDashboard(salaryText);
    
    if (!success && attempt < 10) {
        // If failed, try again in 300ms (Try up to 10 times / 3 seconds)
        setTimeout(() => {
            attemptInjectInbox(salaryText, attempt + 1);
        }, 300);
    }
}


// --- UI: JOB LISTING DASHBOARD (Standard) ---
function getVerdict(applyCount, vacancy) {
    const ratio = applyCount / vacancy;

    if (ratio < 50) {
        return {
            title: "⚡ Excellent Opportunity",
            desc: "Low competition! You have a high chance of being seen.",
            color: "#16a34a", // Green
            bg: "#dcfce7",
            border: "#86efac"
        };
    } else if (ratio < 200) {
        return {
            title: "⚠️ Moderate Competition",
            desc: "Standard crowd. Apply if your skills match perfectly.",
            color: "#d97706", // Amber/Orange
            bg: "#fef3c7",
            border: "#fcd34d"
        };
    } else {
        return {
            title: "🛑 Super Crowded",
            desc: "Very high competition. Consider skipping unless 100% match.",
            color: "#dc2626", // Red
            bg: "#fee2e2",
            border: "#fca5a5"
        };
    }
}

function createJobDashboard(applyCount, viewCount, vacancy, salaryLabel) {
    const header = document.querySelector('.styles_jd-header-title__rZwM1') || document.querySelector('header');
    if (header && !document.getElementById('naukri-stats-dashboard')) {
        const verdict = getVerdict(applyCount, vacancy);
        const dashboard = document.createElement('div');
        dashboard.id = 'naukri-stats-dashboard';
        dashboard.style.marginTop = "15px";
        dashboard.style.border = `1px solid ${verdict.border}`;
        dashboard.style.borderRadius = "8px";
        dashboard.style.backgroundColor = "#fff";
        dashboard.style.fontFamily = "Roboto, sans-serif";
        dashboard.style.width = "fit-content";
        dashboard.style.minWidth = "300px";
        dashboard.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
        dashboard.style.overflow = "hidden";

        dashboard.innerHTML = `
            <div style="padding: 12px 15px; display: flex; gap: 15px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">💰</span>
                    <div><div style="font-size: 10px; color:#64748b; font-weight:700;">SALARY</div><div style="font-size: 15px; font-weight:800; color:#0f172a;">${salaryLabel}</div></div>
                </div>
                <div style="width: 1px; background: #cbd5e1;"></div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">👁️</span>
                    <div><div style="font-size: 10px; color:#64748b; font-weight:700;">VIEWS</div><div style="font-size: 16px; font-weight:800; color:#0f172a;">${viewCount.toLocaleString()}</div></div>
                </div>
                <div style="width: 1px; background: #cbd5e1;"></div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">🔥</span>
                    <div><div style="font-size: 10px; color:#64748b; font-weight:700;">APPLICANTS</div><div style="font-size: 16px; font-weight:800; color:#0f172a;">${applyCount.toLocaleString()}</div></div>
                </div>
            </div>
            <div style="padding: 10px 15px; background: ${verdict.bg}; color: ${verdict.color};">
                <div style="font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 5px;">${verdict.title}</div>
                <div style="font-size: 12px; opacity: 0.9;">${verdict.desc}</div>
            </div>
        `;
        header.appendChild(dashboard);
    }
}


// --- UI: INBOX DASHBOARD (Fixed Selector) ---
function createInboxDashboard(salaryText) {
    // 1. Find the Main Right Section (using the class from your HTML source)
    const rightPane = document.querySelector('.job-right-section');
    
    // 2. Find the Details Component (where "Job description" lives)
    const detailsComponent = document.querySelector('.job-details-component');

    // 3. Prevent Duplicates (Check if we already injected into THIS specific pane)
    // We check if 'rightPane' already has our dashboard as a child
    const existing = rightPane ? rightPane.querySelector('#naukri-inbox-dashboard') : null;

    if (rightPane && detailsComponent && !existing) {
        const dashboard = document.createElement('div');
        dashboard.id = 'naukri-inbox-dashboard';
        
        // Styling to match the standard dashboard
        dashboard.style.marginBottom = "20px";
        dashboard.style.marginTop = "0px";
        dashboard.style.border = "1px solid #265DF5";
        dashboard.style.borderRadius = "8px";
        dashboard.style.backgroundColor = "#fff";
        dashboard.style.fontFamily = "Roboto, sans-serif";
        dashboard.style.width = "100%";
        dashboard.style.maxWidth = "400px";
        dashboard.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
        dashboard.style.overflow = "hidden";

        dashboard.innerHTML = `
            <div style="padding: 15px; display: flex; align-items: center; gap: 15px; background: #ECF5FF;">
                <span style="font-size: 24px;">💰</span>
                <div>
                    <div style="font-size: 11px; color: #265DF5; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Salary</div>
                    <div style="font-size: 18px; font-weight: 800; color: #265DF5;">${salaryText}</div>
                </div>
            </div>
            `;

        // INJECTION LOGIC:
        // We insert it into 'job-right-section', directly BEFORE 'job-details-component'
        // This puts it exactly between the Header (Title/Buttons) and the Description
        rightPane.insertBefore(dashboard, detailsComponent);
        
        return true; // Success!
    }
    return false; // Not found yet
}