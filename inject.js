// inject.js
(function() {
    // 1. PATCH FETCH (Modern method)
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        
        // Clone the response because we can only read the body once
        const clone = response.clone();
        
        // Check if this URL looks like the Job API
        if (args[0] && args[0].includes && args[0].includes("/jobapi/v4/job/")) {
            clone.json().then(data => {
                // Send the stolen data to our Content Script
                window.postMessage({ type: "NAUKRI_DATA_INTERCEPT", payload: data }, "*");
            }).catch(e => { /* Ignore parsing errors */ });
        }
        
        return response;
    };

    // 2. PATCH XHR (Older method, just in case they use Axios/XHR)
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;

    XHR.open = function(method, url) {
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function(postData) {
        this.addEventListener('load', function() {
            if (this._url && this._url.includes("/jobapi/v4/job/")) {
                try {
                    const data = JSON.parse(this.responseText);
                    window.postMessage({ type: "NAUKRI_DATA_INTERCEPT", payload: data }, "*");
                } catch(e) { /* Ignore */ }
            }
        });
        return send.apply(this, arguments);
    };
})();