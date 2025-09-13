// 🌐 Backend URL
const API_URL = "http://localhost:3000";

// =========================
// 📌 REGISTER FORM HANDLER
// =========================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      regId: formData.get("regId"),
    };

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        document.getElementById("qrResult").innerHTML = `
          <h3>Registration Successful ✅</h3>
          <p><b>Name:</b> ${result.participant.name}</p>
          <p><b>Email:</b> ${result.participant.email}</p>
          <p><b>Reg ID:</b> ${result.participant.regId}</p>
          <img src="${result.qrCode}" alt="QR Code" />
        `;
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Server error, try again later.");
    }
  });
}

// =========================
// 📌 ATTENDANCE SCAN HANDLER
// =========================
const scanForm = document.getElementById("scanForm");
if (scanForm) {
  scanForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(scanForm);
    const regId = formData.get("regId");

    try {
      const res = await fetch(`${API_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regId }),
      });

      const result = await res.json();
      if (result.success) {
        document.getElementById("scanResult").innerHTML = `
          <p>✅ Attendance marked for <b>${result.participant.name}</b> at ${result.timestamp}</p>
        `;
      } else {
        document.getElementById("scanResult").innerHTML = `
          <p>❌ ${result.message}</p>
        `;
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Server error, try again later.");
    }
  });
}

// =========================
// 📌 ADMIN LOGIN + DASHBOARD
// =========================
const adminLogin = document.getElementById("adminLogin");
if (adminLogin) {
  adminLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("adminPass").value;

    // simple static password check
    if (pass === "admin123") {
      document.getElementById("dashboard").style.display = "block";
      adminLogin.style.display = "none";
      loadAttendance();
    } else {
      alert("❌ Wrong password");
    }
  });
}

// Load Attendance Data
async function loadAttendance() {
  try {
    const res = await fetch(`${API_URL}/attendance`);
    const result = await res.json();

    const table = document.getElementById("attendanceTable");
    table.innerHTML = `
      <tr><th>Name</th><th>Email</th><th>ID</th><th>Status</th><th>Timestamp</th></tr>
    `;

    result.forEach((row) => {
      table.innerHTML += `
        <tr>
          <td>${row.name}</td>
          <td>${row.email}</td>
          <td>${row.regId}</td>
          <td>${row.status || "Not Marked"}</td>
          <td>${row.timestamp || "-"}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error loading attendance:", err);
  }
}

// Export Attendance
async function exportAttendance() {
  try {
    const res = await fetch(`${API_URL}/export`);
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.xlsx";
      a.click();

      window.URL.revokeObjectURL(url);
    } else {
      alert("❌ Export failed");
    }
  } catch (err) {
    console.error("Export error:", err);
  }
}