# 🚀 Naukri Real Stats Revealer

A Chrome Extension that reveals the **Real Applicant Count** and **View Count** on Naukri.com job listings, replacing the generic "100+ Applicants" label. It also calculates a **Competition Score** to help you decide if a job is worth applying for.

## ✨ Features

* **Hidden Salary Reveal:** Displays the actual salary range (e.g., "₹6-10 Lacs") even if the recruiter has set it to "Not Disclosed".
* **Real Data:** Fetches the actual number of applicants (e.g., "325" instead of "100+").
* **Views Counter:** Shows how many people have viewed the job.
* **Smart Verdict:** Automatically calculates competition based on vacancies:
    * 🟢 **Green:** Excellent Opportunity (<50 applicants/seat)
    * 🟠 **Orange:** Moderate Competition (50-200 applicants/seat)
    * 🔴 **Red:** Super Crowded (>200 applicants/seat)
* **Safe & Private:** Runs entirely in your browser. No data is sent to any server.

### 📸 Comparison

<table>
  <tr>
    <th width="50%">Without Extension</th>
    <th width="50%">With Extension</th>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/ac44881e-0227-4e69-9686-6106de0a630a" width="100%" alt="Before Extension"></td>
    <td><img src="https://github.com/user-attachments/assets/4ad15bb0-a8dd-4b85-9538-8391955a012b" width="100%" alt="After Extension"></td>
  </tr>
</table>




## 📥 How to Install (Developer Mode)

Since this is an open-source tool, you will install it manually:

1.  **Download the Code:**
    * Click the green **Code** button above and select **Download ZIP**.
    * Unzip the file into a folder.
2.  **Open Chrome Extensions:**
    * Type `chrome://extensions` in your address bar.
3.  **Enable Developer Mode:**
    * Toggle the switch in the top-right corner named **"Developer mode"**.
4.  **Load the Extension:**
    * Click the button **"Load unpacked"** (top left).
    * Select the folder you just unzipped.
5.  **Done!** Go to any Naukri job page and refresh to see the real stats.

## 🔒 Privacy & Safety

This extension intercepts the API call that Naukri.com *already makes* to your browser. It simply reads that data and displays it on the screen. It does not make any unauthorized external calls or store your data.

## ⚠️ Disclaimer

This is an unofficial fan-made project and is not affiliated with, endorsed by, or connected to Naukri.com or Info Edge (India) Ltd.
This tool is for educational and productivity purposes only. Use it at your own discretion.
