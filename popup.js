document.addEventListener('DOMContentLoaded', function() {
  generateAndDisplayPassword();
});

document.getElementById('length-slider').addEventListener('input', function() {
  const length = document.getElementById('length-slider').value;
  document.getElementById('length-value').value = length;
  generateAndDisplayPassword();
});

document.getElementById('length-value').addEventListener('input', function() {
  const length = document.getElementById('length-value').value;
  document.getElementById('length-slider').value = length;
  generateAndDisplayPassword();
});

document.getElementById('include-numbers').addEventListener('change', function() {
  generateAndDisplayPassword();
});

document.getElementById('include-symbols').addEventListener('change', function() {
  generateAndDisplayPassword();
});

document.getElementById('save').addEventListener('click', function() {
  const id = document.getElementById('id').value;
  const password = document.getElementById('password').value;
  if (id && password) {
    savePassword(id, password);
  } else {
    alert('Please enter both ID and password.');
  }
});

document.getElementById('retrieve').addEventListener('click', function() {
  retrievePasswords();
});

document.getElementById('generate').addEventListener('click', function() {
  generateAndDisplayPassword();
});

function generateAndDisplayPassword() {
  const length = parseInt(document.getElementById('length-slider').value, 10);
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeSymbols = document.getElementById('include-symbols').checked;
  const password = generatePassword(length, includeNumbers, includeSymbols);
  document.getElementById('password').value = password;
  updateStrengthBar(password);
}

function generatePassword(length, includeNumbers, includeSymbols) {
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeNumbers) {
    charset += "0123456789";
  }
  if (includeSymbols) {
    charset += "!@#$%^&*()_+[]{}|;:,.<>?";
  }
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

function savePassword(id, password) {
  chrome.storage.sync.get('passwords', function(data) {
    const passwords = data.passwords || {};
    passwords[id] = password;
    chrome.storage.sync.set({ 'passwords': passwords }, function() {
      if (chrome.runtime.lastError) {
        console.error('Error saving password:', chrome.runtime.lastError);
      } else {
        console.log('Password saved');
        copyToClipboard(password);
        alert('Password saved and copied to clipboard!');
      }
    });
  });
}

function retrievePasswords() {
  chrome.storage.sync.get('passwords', function(data) {
    const passwords = data.passwords || {};
    const passwordsTable = document.getElementById('passwords-table');
    const passwordsTableBody = passwordsTable.querySelector('tbody');
    passwordsTableBody.innerHTML = '';
    for (const id in passwords) {
      const row = document.createElement('tr');
      const idCell = document.createElement('td');
      const passwordCell = document.createElement('td');

      idCell.textContent = id;
      idCell.style.cursor = 'pointer';
      idCell.addEventListener('click', function() {
        copyToClipboard(id);
      });

      passwordCell.textContent = passwords[id];
      passwordCell.style.cursor = 'pointer';
      passwordCell.addEventListener('click', function() {
        copyToClipboard(passwords[id]);
      });

      row.appendChild(idCell);
      row.appendChild(passwordCell);
      passwordsTableBody.appendChild(row);
    }
    if (Object.keys(passwords).length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 2;
      cell.textContent = 'No passwords found.';
      row.appendChild(cell);
      passwordsTableBody.appendChild(row);
    }
    passwordsTable.style.display = 'table'; // Show the table when passwords are retrieved
  });
}

function copyToClipboard(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);

  const copiedMessage = document.getElementById('copied-message');
  copiedMessage.style.display = 'block';
  setTimeout(function() {
    copiedMessage.style.display = 'none';
  }, 2000);
}

function calculatePasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;
  return strength;
}

function updateStrengthBar(password) {
  const strengthBarInner = document.getElementById('strength-bar-inner');
  const strength = calculatePasswordStrength(password);
  strengthBarInner.style.width = strength + '%';
  if (strength < 50) {
    strengthBarInner.style.backgroundColor = 'red';
  } else if (strength < 75) {
    strengthBarInner.style.backgroundColor = 'orange';
  } else {
    strengthBarInner.style.backgroundColor = 'green';
  }
}

