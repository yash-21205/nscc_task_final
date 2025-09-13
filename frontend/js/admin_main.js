document.addEventListener('DOMContentLoaded', () => {

  const adminLoginForm = document.getElementById('adminLogin');
  const adminPassInput = document.getElementById('adminPass');
  const loginContainer = document.getElementById('loginContainer');
  const dashboard = document.getElementById('dashboard');
  const loginError = document.getElementById('loginError');

  // IMPORTANT: This is a client-side password check.
  // It is NOT secure and is for demonstration purposes only.
  // For a real application, authentication must be handled on a server.
  const CORRECT_PASSWORD = 'admin123';

  adminLoginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from reloading the page

    const enteredPassword = adminPassInput.value;

    if (enteredPassword === CORRECT_PASSWORD) {
      // Correct password
      loginError.textContent = '';
      loginContainer.style.display = 'none';
      
      // Make the dashboard visible with a smooth transition
      dashboard.style.display = 'block';
      setTimeout(() => { // Timeout ensures display:block is set before class is added
        dashboard.classList.add('visible');
      }, 10);

    } else {
      // Incorrect password
      loginError.textContent = 'Incorrect password. Please try again.';
      adminPassInput.value = ''; // Clear the input field
      
      // Add a shake animation for visual feedback
      loginContainer.classList.add('shake');
      setTimeout(() => {
        loginContainer.classList.remove('shake');
      }, 500);
    }
  });

});

// Placeholder function for the download button
function exportAttendance() {
  // In a real application, you would use a library like SheetJS (xlsx)
  // to generate an Excel file from the table data.
  alert('Exporting attendance data to Excel...');
}


// Add this CSS for the shake animation to your admin_style.css file
// Or you can add it here in a <style> tag in the head for simplicity.
// It's better to keep it in the CSS file.

/*
In admin_style.css, add this at the end:

.login-container.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

*/