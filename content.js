// content.js

// 1. Inject the Spy Script immediately
const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove(); // Clean up tag
};
(document.head || document.documentElement).appendChild(s);


// 2. Listen for the intercepted data
window.addEventListener("message", function(event) {
    if (event.source != window) return;

    if (event.data.type && (event.data.type === "NAUKRI_DATA_INTERCEPT")) {
        
        const data = event.data.payload;
        
        if (data && data.jobDetails) {
            const applyCount = parseInt(data.jobDetails.applyCount) || 0;
            const viewCount = parseInt(data.jobDetails.viewCount) || 0;
            const vacancy = parseInt(data.jobDetails.vacancy) || 1;
            
            // NEW: Extract Salary Label
            // We use ?. safely in case salaryDetail is missing entirely
            const salaryLabel = data.jobDetails.salaryDetail?.label || "Not Disclosed";

            // Wait slightly for the header to exist
            setTimeout(() => {
                createStatsDashboard(applyCount, viewCount, vacancy, salaryLabel);
            }, 1000);
        }
    }
});

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

function createStatsDashboard(applyCount, viewCount, vacancy, salaryLabel) {
    const header = document.querySelector('.styles_jd-header-title__rZwM1') || document.querySelector('header');
    
    if (header && !document.getElementById('naukri-stats-dashboard')) {
        
        const verdict = getVerdict(applyCount, vacancy);
        
        const dashboard = document.createElement('div');
        dashboard.id = 'naukri-stats-dashboard';
        
        // CSS Styling
        dashboard.style.marginTop = "15px";
        dashboard.style.marginBottom = "15px";
        dashboard.style.padding = "0"; 
        dashboard.style.backgroundColor = "#ffffff"; 
        dashboard.style.border = `1px solid ${verdict.border}`; 
        dashboard.style.borderRadius = "8px";
        dashboard.style.fontFamily = "Roboto, sans-serif";
        dashboard.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
        dashboard.style.overflow = "hidden";
        dashboard.style.width = "fit-content";
        dashboard.style.minWidth = "300px";

        // HTML Content
        dashboard.innerHTML = `
            <div style="padding: 12px 15px; display: flex; align-items: center; gap: 15px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">💰</span>
                    <div>
                        <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Salary</div>
                        <div style="font-size: 15px; color: #0f172a; font-weight: 800;">${salaryLabel}</div>
                    </div>
                </div>

                <div style="width: 1px; height: 25px; background-color: #cbd5e1;"></div>

                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">👁️</span>
                    <div>
                        <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Views</div>
                        <div style="font-size: 16px; color: #0f172a; font-weight: 800;">${viewCount.toLocaleString()}</div>
                    </div>
                </div>
                
                <div style="width: 1px; height: 25px; background-color: #cbd5e1;"></div>

                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">🔥</span>
                    <div>
                        <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Applicants</div>
                        <div style="font-size: 16px; color: #0f172a; font-weight: 800;">${applyCount.toLocaleString()}</div>
                    </div>
                </div>

                <div style="width: 1px; height: 25px; background-color: #cbd5e1;"></div>

                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">🪑</span>
                    <div>
                        <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Vacancies</div>
                        <div style="font-size: 16px; color: #0f172a; font-weight: 800;">${vacancy}</div>
                    </div>
                </div>
            </div>

            <div style="padding: 10px 15px; background-color: ${verdict.bg}; color: ${verdict.color};">
                <div style="font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 5px;">
                    ${verdict.title}
                </div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">
                    ${verdict.desc}
                </div>
            </div>
        `;
        
        header.appendChild(dashboard);
    }
}