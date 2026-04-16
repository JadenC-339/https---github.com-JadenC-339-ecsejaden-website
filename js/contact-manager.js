/**
 * Contact Manager Logic
 * Handles fetching, adding, and deleting contacts from MongoDB
 */

const API_URL = '/api/contacts';
const contactForm = document.getElementById('contactForm');
const contactsList = document.getElementById('contactsList');
const contactCountElem = document.getElementById('contactCount');
const totalContactsElem = document.getElementById('totalContacts');
const recentlyAddedElem = document.getElementById('recentlyAdded');
const storageUsedElem = document.getElementById('storageUsed');
const clearAllBtn = document.getElementById('clearAllBtn');
const searchInput = document.getElementById('searchInput');

let allContacts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();
});

// Fetch all contacts
async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        allContacts = await response.json();
        renderContacts(allContacts);
        updateStats();
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

// Render contacts list
function renderContacts(contacts) {
    if (contacts.length === 0) {
        contactsList.innerHTML = `
            <div id="emptyState" class="text-center py-12">
              <svg class="w-20 h-20 mx-auto mb-4 text-yellow-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <p class="text-yellow-300/50 text-lg font-medium">No contacts found</p>
            </div>
        `;
        return;
    }

    contactsList.innerHTML = contacts.map(contact => `
        <div class="bg-black/40 p-4 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all flex justify-between items-center group">
            <div>
                <h4 class="font-bold text-yellow-300">${contact.name}</h4>
                <p class="text-sm text-yellow-200/60">${contact.email}</p>
                <p class="text-sm text-yellow-200/60">${contact.phone}</p>
            </div>
            <button onclick="deleteContact('${contact._id}')" class="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

// Add new contact
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            contactForm.reset();
            const successMsg = document.getElementById('successMessage');
            successMsg.classList.remove('hidden');
            setTimeout(() => successMsg.classList.add('hidden'), 3000);
            fetchContacts();
        }
    } catch (error) {
        console.error('Error adding contact:', error);
    }
});

// Delete individual contact
async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchContacts();
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

// Clear all contacts
clearAllBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete ALL contacts?')) return;

    try {
        const response = await fetch(API_URL, { method: 'DELETE' });
        if (response.ok) {
            fetchContacts();
        }
    } catch (error) {
        console.error('Error clearing contacts:', error);
    }
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allContacts.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term)
    );
    renderContacts(filtered);
});

// Update Statistics
function updateStats() {
    const count = allContacts.length;
    contactCountElem.textContent = count;
    totalContactsElem.textContent = count;
    
    const today = new Date().toISOString().split('T')[0];
    const addedToday = allContacts.filter(c => c.createdAt && c.createdAt.startsWith(today)).length;
    recentlyAddedElem.textContent = addedToday;
    
    // Estimate storage (rough approximation)
    const bytes = JSON.stringify(allContacts).length;
    storageUsedElem.textContent = (bytes / 1024).toFixed(2) + ' KB';
}
