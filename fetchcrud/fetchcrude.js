const url = 'http://localhost:3000/child';
const output = document.getElementById('output');
const savedOutput = document.getElementById('savedOutput');

// Load saved Children from localStorage
function loadSavedChildren() {
    try {
        const savedChildren = JSON.parse(localStorage.getItem('savedChildren') || '[]');
        savedOutput.innerHTML = '';
        
        if (savedChildren.length === 0) {
            const noChildrenMessage = document.createElement('div');
            noChildrenMessage.className = 'no-children-message';
            noChildrenMessage.textContent = 'No saved children yet!';
            savedOutput.appendChild(noChildrenMessage);
            return;
        }

        // Sort saved Children by name in alphabetical order
        const sortedChildren = savedChildren.sort((a, b) => a.name.localeCompare(b.name));

        // Display saved Children
        sortedChildren.forEach(child => {
            const childDiv = document.createElement('div');
            childDiv.className = 'child-item';
            childDiv.innerHTML = `
                <span class="child-content"><p><b>${child.name}</b> (${child.age || 0})</p><p>Score: ${child.goodieScore}</p></span>
                <button onclick="removeFromSaved('${child.id}')">Remove</button>
            `;
            savedOutput.appendChild(childDiv);
        });
    } catch (error) {
        console.error('Error loading saved Children:', error);
        localStorage.setItem('savedChildren', '[]');
    }
}

// Save child to localStorage
function saveToLocal(childId, childname, childgoodieScore, childage, timestamp) {
    try {
        const child = {
            id: childId,
            name: childname,
            goodieScore: childgoodieScore,
            age: childage || 0,
            timestamp: timestamp
        };
        const savedChildren = JSON.parse(localStorage.getItem('savedChildren') || '[]');

        // remove child from output
        const childDiv = document.getElementById(`child-${child.id}`);
        if (childDiv) {
            childDiv.remove();
        }

        if (!savedChildren.some(p => p.id === child.id)) {
            savedChildren.push(child);
            localStorage.setItem('savedChildren', JSON.stringify(savedChildren));
            loadSavedChildren(); // Refresh the display immediately
        } 
        else {
            alert('This child is already saved!');
        }
    } catch (error) {
        console.error('Error saving child:', error);
    }
}

// Remove child from saved Children
function removeFromSaved(childId) {
    try {
        const savedChildren = JSON.parse(localStorage.getItem('savedChildren') || '[]');
        // add child to output
        const child = savedChildren.find(p => p.id === childId);
        if (child) {
            const childDiv = document.createElement('div');
            childDiv.className = 'child-item';
            childDiv.id = `child-${child.id}`;
            childDiv.innerHTML = `
                <span class="child-content"><p><b>${child.name}</b> (${child.age || 0})</p><p>Score: ${child.goodieScore}</p></span>
                <div class="edit-form" style="display: none;">
                    <input type="text" class="edit-name" value="${child.name}">
                    <input type="number" class="edit-goodieScore" value="${child.goodieScore}">
                    <input type="number" class="edit-age" value="${child.age || 0}">
                    <button class="smallbutton" onclick="saveEdit('${child.id}')">S</button>
                    <button class="smallbutton" onclick="cancelEdit('${child.id}')">X</button>
                </div>
                <div class="button-group">
                    <button onclick="editchild('${child.id}')">Edit</button>
                    <button onclick="saveToLocal('${child.id}', '${child.name}', ${child.goodieScore}, ${child.age || 0}, ${child.timestamp})">Save</button>
                    <button onclick="deleteChild('${child.id}')">Delete</button>
                </div>
            `;
            output.appendChild(childDiv);
        }
        // Convert childId to string for consistent comparison
        const childIdString = String(childId);
        const updatedChildren = savedChildren.filter(child => child.id !== childIdString);
        localStorage.setItem('savedChildren', JSON.stringify(updatedChildren));
        loadSavedChildren();
    } catch (error) {
        console.error('Error removing saved child:', error);
    }
}

// remove child from saved Children
function removeFromSaved(childId) {
    try {
        const savedChildren = JSON.parse(localStorage.getItem('savedChildren') || '[]');

        // Convert childId to string for consistent comparison
        const childIdString = String(childId);
        const updatedChildren = savedChildren.filter(child => child.id !== childIdString);
        localStorage.setItem('savedChildren', JSON.stringify(updatedChildren));
        loadSavedChildren();
    } catch (error) {
        console.error('Error removing saved child:', error);
    }
}

function fetchdata() {
    output.innerHTML = '';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                const noChildrenMessage = document.createElement('div');
                noChildrenMessage.className = 'no-children-message';
                noChildrenMessage.textContent = 'No children available. Add your first child!';
                output.appendChild(noChildrenMessage);
                return;
            }
            
            // Sort Children by name in alphabetical order
            const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
            
            sortedData.forEach(child => {
                output.innerHTML += `
                    <div class="child-item" id="child-${child.id}">
                        <span class="child-content"><p><b>${child.name}</b> (${child.age || 0})</p><p>Score: ${child.goodieScore}</p></span>
                        <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-name" value="${child.name}">
                            <input type="number" class="edit-goodieScore" value="${child.goodieScore}">
                            <input type="number" class="edit-age" value="${child.age || 0}">
                            <button class="smallbutton" onclick="saveEdit('${child.id}')">S</button>
                            <button class="smallbutton" onclick="cancelEdit('${child.id}')">X</button>
                        </div>
                        <div class="button-group">
                            <button onclick="editchild('${child.id}')">Edit</button>
                            <button onclick="saveToLocal('${child.id}', '${child.name}', ${child.goodieScore}, ${child.age || 0}, ${child.timestamp})">Save</button>
                            <button onclick="deleteChild('${child.id}')">Delete</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(e => console.error('Error fetching Children:', e));
}

// Add new child
document.getElementById('addChildButton').addEventListener('click',
    function() {
    const name = document.getElementById('name').value;
    const goodieScore = document.getElementById('goodieScore').value;
    const age = document.getElementById('age').value;

    if (name && goodieScore && age) {
        const newChild = {
            id: Date.now().toString(),
            name: name,
            goodieScore: parseInt(goodieScore),
            age: parseInt(age) || 0,
            timestamp: Date.now()
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newChild)
        })
        .then(() => fetchdata())
        .catch(e => console.log('Error adding child:', e));
        

        // Clear input fields
        document.getElementById('name').value = '';
        document.getElementById('goodieScore').value = '';
        document.getElementById('age').value = '';
    }
        // Refresh the displayed Children
    
    else {
        alert('Please fill in all fields.');
    }
});


// Delete child
function deleteChild(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchdata())
    .catch(e => console.error('Error deleting child:', e));
}

// Clear localStorage
document.getElementById('clearStorage').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved childre?')) {
        localStorage.removeItem('savedChildren');
        loadSavedChildren();
    }
});

// Refresh button - anyways; absolute refresh bruh ;)
document.getElementById('clear').addEventListener('click', fetchdata);

function editchild(id) {
    // Show edit form and hide content for the selected child
    const childDiv = document.getElementById(`child-${id}`);
    childDiv.querySelector('.child-content').style.display = 'none';
    childDiv.querySelector('.edit-form').style.display = 'block';
    childDiv.querySelector('.button-group').style.display = 'none';
}

function cancelEdit(id) {
    // Hide edit form and show content
    const childDiv = document.getElementById(`child-${id}`);
    childDiv.querySelector('.child-content').style.display = 'block';
    childDiv.querySelector('.edit-form').style.display = 'none';
    childDiv.querySelector('.button-group').style.display = 'block';
}

function saveEdit(id) {
    // Get the edited values
    const childDiv = document.getElementById(`child-${id}`);
    const newname = childDiv.querySelector('.edit-name').value;
    const newgoodieScore = parseInt(childDiv.querySelector('.edit-goodieScore').value);
    const newage = parseInt(childDiv.querySelector('.edit-age').value);

    // Create updated child object
    const updatedchild = {
        name: newname,
        goodieScore: newgoodieScore,
        age: newage,
        timestamp: Date.now() // Update timestamp
    };

    // Send PUT request to update the child
    fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedchild)
    })
    .then(res => res.json())
    .then(() => {
        // Refresh the Children display
        fetchdata();
    })
    .catch(e => console.error('Error updating child:', e));
}

// Initial load
fetchdata();
loadSavedChildren();

