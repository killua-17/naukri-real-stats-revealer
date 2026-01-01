// inject.js
(function() {
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        const clone = response.clone();
        const url = args[0] ? args[0].toString() : "";

        // 1. Detect Job Listing API
        if (url.includes("/jobapi/v4/job/")) {
            clone.json().then(data => {
                window.postMessage({ type: "NAUKRI_JOB_DATA", payload: data }, "*");
            }).catch(e => {});
        }
        
        // 2. Detect Inbox API (New!)
        else if (url.includes("/inbox/users/self/mail")) {
            clone.json().then(data => {
                window.postMessage({ type: "NAUKRI_INBOX_DATA", payload: data }, "*");
            }).catch(e => {});
        }
        
        return response;
    };
})();