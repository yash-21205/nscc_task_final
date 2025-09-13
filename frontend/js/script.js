document.getElementById("registrationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const regId = document.getElementById("regId").value.trim();

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, regId })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById("qrCode").src = data.qrCode;
      document.getElementById("qrResult").classList.remove("hidden");
      document.getElementById("registrationForm").reset();
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Something went wrong. Try again.");
  }
});