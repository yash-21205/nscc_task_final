document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (result.qrCode) {
    document.getElementById('qrResult').innerHTML = `<h3>Your QR Code</h3><img src="${result.qrCode}" />`;
  } else {
    alert(result.error || 'Registration failed');
  }
});