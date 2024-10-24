// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVPszPyUGHr038cGelSXBXiBBLjjWpktU",
  authDomain: "time-tracker-1b563.firebaseapp.com",
  projectId: "time-tracker-1b563",
  storageBucket: "time-tracker-1b563.appspot.com",
  messagingSenderId: "117298828646",
  appId: "1:117298828646:web:f101ed31f1a6e9c3bd24a7",
  measurementId: "G-LNT95BZWV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Get references to elements
const loginBtn = document.getElementById('loginBtn');
const employeeIdInput = document.getElementById('employeeId');
const empName = document.getElementById('empName');
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');
const trackingSection = document.getElementById('trackingSection');
const recordsTableBody = document.querySelector('#recordsTable tbody');

let employeeId = null;
let startTime = null;

// Login function
loginBtn.addEventListener('click', () => {
    employeeId = employeeIdInput.value;
    if (employeeId) {
        empName.textContent = employeeId;
        trackingSection.classList.remove('hidden');
    } else {
        alert('Please enter Employee ID');
    }
});

// Start work
startBtn.addEventListener('click', () => {
    startTime = new Date();
    startBtn.classList.add('hidden');
    endBtn.classList.remove('hidden');

    // Convert start time to Philippine Standard Time (PST)
    const startPST = startTime.toLocaleString("en-US", { timeZone: "Asia/Manila" });
    
    alert(`Work started at ${startPST}`);
});

// End work and save record
endBtn.addEventListener('click', () => {
    const endTime = new Date();

    // Save record to Firebase
    saveRecord(employeeId, startTime, endTime);
    startBtn.classList.remove('hidden');
    endBtn.classList.add('hidden');
});

// Save records to Firebase
async function saveRecord(empId, start, end) {
    const record = {
        empId,
        date: start.toLocaleDateString("en-US", { timeZone: "Asia/Manila" }),
        startTime: start.toLocaleTimeString("en-US", { timeZone: "Asia/Manila" }),
        endTime: end.toLocaleTimeString("en-US", { timeZone: "Asia/Manila" })
    };

    // Push the record to the database
    const newRecordRef = ref(database, 'attendanceRecords/' + Date.now());
    await set(newRecordRef, record);

    // Update the records display
    displayRecords();
}

// Display records in the table
function displayRecords() {
    const recordsRef = ref(database, 'attendanceRecords');
    onValue(recordsRef, (snapshot) => {
        const records = snapshot.val();
        recordsTableBody.innerHTML = '';

        for (const id in records) {
            const record = records[id];
            const row = `<tr>
                            <td>${record.empId}</td>
                            <td>${record.date}</td>
                            <td>${record.startTime}</td>
                            <td>${record.endTime}</td>
                        </tr>`;
            recordsTableBody.innerHTML += row;
        }
    });
}

// Load records on page load
window.onload = displayRecords;
