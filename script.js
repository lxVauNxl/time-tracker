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
    
    // Convert end time to Philippine Standard Time (PST)
    const endPST = endTime.toLocaleString("en-US", { timeZone: "Asia/Manila" });
    
    saveRecord(employeeId, startTime, endTime);
    startBtn.classList.remove('hidden');
    endBtn.classList.add('hidden');
});

// Save records to localStorage
function saveRecord(empId, start, end) {
    const record = {
        empId,
        date: start.toLocaleDateString("en-US", { timeZone: "Asia/Manila" }),
        startTime: start.toLocaleTimeString("en-US", { timeZone: "Asia/Manila" }),
        endTime: end.toLocaleTimeString("en-US", { timeZone: "Asia/Manila" })
    };

    let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    records.push(record);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));

    displayRecords();
}

// Display records in the table
function displayRecords() {
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    recordsTableBody.innerHTML = '';

    records.forEach(record => {
        const row = `<tr>
                        <td>${record.empId}</td>
                        <td>${record.date}</td>
                        <td>${record.startTime}</td>
                        <td>${record.endTime}</td>
                     </tr>`;
        recordsTableBody.innerHTML += row;
    });
}

// Load records on page load
window.onload = displayRecords;
