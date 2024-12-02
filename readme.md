Absolutely! Let's add some styling to make the password manager extension look more appealing. We'll use CSS to enhance the appearance of the elements.

### Updated `popup.html`

Add some classes to the HTML elements for styling:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Password Manager</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      margin: 0;
      padding: 20px;
    }
    h1 {
      color: #333;
      text-align: center;
    }
    .container {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      max-width: 400px;
      margin: auto;
    }
    input[type="text"], input[type="number"] {
      width: calc(100% - 22px);
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: none;
      border-radius: 4px;
      background-color: #4CAF50;
      color: white;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
    .checkbox-container {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    .copied-message {
      color: green;
      display: none;
      text-align: center;
      margin-top: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      display: none;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #4CAF50;
      color: white;
    }
    tr:hover {
      background-color: #f1f1f1;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Manager</h1>
    <input type="text" id="id" placeholder="ID (e.g., admin)">
    <input type="text" id="password" placeholder="Generated Password">
    <input type="number" id="length" placeholder="Password Length" min="1" value="12">
    <div class="checkbox-container">
      <label>
        <input type="checkbox" id="include-numbers"> Include Numbers
      </label>
      <label>
        <input type="checkbox" id="include-symbols"> Include Symbols
      </label>
    </div>
    <button id="generate">Generate Password</button>
    <button id="save">Save Password</button>
    <button id="retrieve">Retrieve Passwords</button>
    <div id="passwords-list">
      <table id="passwords-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <!-- Passwords will be inserted here -->
        </tbody>
      </table>
    </div>
    <div id="copied-message" class="copied-message">Copied!</div>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

### Updated `popup.js`

No changes are needed to the JavaScript for styling, but here's the complete code for reference:

```javascript
document.getElementById('generate').addEventListener('click', function() {
  const length = parseInt(document.getElementById('length').value, 10);
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeSymbols = document.getElementById('include-symbols').checked;
  const password = generatePassword(length, includeNumbers, includeSymbols);
  document.getElementById('password').value = password;
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
```

### Steps to Verify

1. **Generate Password**: Click "Generate Password" to create a password.
2. **Edit Password**: Modify the generated password or enter your own password in the input field.
3. **Save Password**: Enter an ID and click "Save Password." The password should be saved and copied to the clipboard, and the "Copied!" message should appear and then disappear after 2 seconds.
4. **Retrieve Passwords**: Click "Retrieve Passwords" to display all saved passwords in a table format. The table should only be visible after clicking this button.
5. **Copy ID**: Click on the ID to copy it to the clipboard. The "Copied!" message should appear and then disappear after 2 seconds.
6. **Copy Password**: Click on the password to copy it to the clipboard. The "Copied!" message should appear and then disappear after 2 seconds.

This should make the password manager extension look more appealing and user-friendly. If you have any other features you'd like to add or any issues, feel free to let me know!