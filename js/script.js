// Contact Manager - Dynamic Contact Form with Local Storage
class ContactManager {
  constructor() {
    this.contacts = this.loadContacts();
    this.editingIndex = null;
    this.init();
  }

  init() {
    // Form elements
    this.form = document.getElementById('contactForm');
    this.nameInput = document.getElementById('name');
    this.emailInput = document.getElementById('email');
    this.phoneInput = document.getElementById('phone');
    this.submitBtn = document.getElementById('submitBtn');
    this.cancelBtn = document.getElementById('cancelBtn');
    this.formTitle = document.getElementById('formTitle');
    
    // List elements
    this.contactsList = document.getElementById('contactsList');
    this.searchInput = document.getElementById('searchInput');
    this.clearAllBtn = document.getElementById('clearAllBtn');
    this.emptyState = document.getElementById('emptyState');
    
    // Stats elements
    this.contactCount = document.getElementById('contactCount');
    this.totalContacts = document.getElementById('totalContacts');
    this.recentlyAdded = document.getElementById('recentlyAdded');
    this.storageUsed = document.getElementById('storageUsed');
    
    // Success message
    this.successMessage = document.getElementById('successMessage');
    
    // Event listeners
    this.attachEventListeners();
    
    // Initial render
    this.renderContacts();
    this.updateStats();
    
    // Initialize drag and drop
    this.initializeDragAndDrop();
  }

  attachEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Cancel edit
    this.cancelBtn.addEventListener('click', () => this.cancelEdit());
    
    // Search
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    
    // Clear all
    this.clearAllBtn.addEventListener('click', () => this.clearAllContacts());
    
    // Real-time validation
    this.nameInput.addEventListener('input', () => this.validateField('name'));
    this.emailInput.addEventListener('input', () => this.validateField('email'));
    this.phoneInput.addEventListener('input', () => this.validateField('phone'));
  }

  validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const error = document.getElementById(`${fieldName}Error`);
    
    if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value) && field.value !== '') {
        error.classList.remove('hidden');
        return false;
      } else {
        error.classList.add('hidden');
        return true;
      }
    } else {
      if (field.value.trim() === '') {
        error.classList.remove('hidden');
        return false;
      } else {
        error.classList.add('hidden');
        return true;
      }
    }
  }

  validateForm() {
    const nameValid = this.validateField('name');
    const emailValid = this.validateField('email');
    const phoneValid = this.validateField('phone');
    
    // Additional validation
    if (this.nameInput.value.trim() === '') {
      document.getElementById('nameError').classList.remove('hidden');
      return false;
    }
    
    if (this.emailInput.value.trim() === '') {
      document.getElementById('emailError').classList.remove('hidden');
      return false;
    }
    
    if (this.phoneInput.value.trim() === '') {
      document.getElementById('phoneError').classList.remove('hidden');
      return false;
    }
    
    return nameValid && emailValid && phoneValid;
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    const contact = {
      id: this.editingIndex !== null ? this.contacts[this.editingIndex].id : Date.now(),
      name: this.nameInput.value.trim(),
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
      createdAt: this.editingIndex !== null ? this.contacts[this.editingIndex].createdAt : new Date().toISOString()
    };
    
    if (this.editingIndex !== null) {
      // Update existing contact
      this.contacts[this.editingIndex] = contact;
      this.editingIndex = null;
      this.resetFormToAdd();
    } else {
      // Add new contact
      this.contacts.unshift(contact);
    }
    
    this.saveContacts();
    this.renderContacts();
    this.updateStats();
    this.form.reset();
    this.showSuccessMessage();
    
    // Hide all error messages
    document.querySelectorAll('[id$="Error"]').forEach(el => el.classList.add('hidden'));
  }

  showSuccessMessage() {
    this.successMessage.classList.remove('hidden');
    setTimeout(() => {
      this.successMessage.classList.add('hidden');
    }, 3000);
  }

  editContact(index) {
    const contact = this.contacts[index];
    this.editingIndex = index;
    
    this.nameInput.value = contact.name;
    this.emailInput.value = contact.email;
    this.phoneInput.value = contact.phone;
    
    this.formTitle.textContent = 'Edit Contact';
    this.submitBtn.textContent = 'Update Contact';
    this.cancelBtn.classList.remove('hidden');
    
    // Scroll to form
    this.form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  cancelEdit() {
    this.editingIndex = null;
    this.resetFormToAdd();
    this.form.reset();
  }

  resetFormToAdd() {
    this.formTitle.textContent = 'Add New Contact';
    this.submitBtn.textContent = 'Add Contact';
    this.cancelBtn.classList.add('hidden');
  }

  deleteContact(index) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contacts.splice(index, 1);
      this.saveContacts();
      this.renderContacts();
      this.updateStats();
      
      // If we were editing this contact, reset the form
      if (this.editingIndex === index) {
        this.cancelEdit();
      }
    }
  }

  clearAllContacts() {
    if (confirm('Are you sure you want to delete all contacts? This action cannot be undone.')) {
      this.contacts = [];
      this.saveContacts();
      this.renderContacts();
      this.updateStats();
      this.cancelEdit();
    }
  }

  handleSearch(query) {
    const filtered = this.contacts.filter(contact => 
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase())
    );
    this.renderContacts(filtered);
  }

  renderContacts(contactsToRender = this.contacts) {
    if (contactsToRender.length === 0) {
      this.emptyState.classList.remove('hidden');
      this.contactsList.innerHTML = '';
      this.contactsList.appendChild(this.emptyState);
      return;
    }
    
    this.emptyState.classList.add('hidden');
    
    this.contactsList.innerHTML = contactsToRender.map((contact, index) => `
      <div class="contact-item bg-black/70 p-6 rounded-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 group animate__animated animate__fadeIn" data-id="${contact.id}">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-lg font-bold text-yellow-300 truncate">${this.escapeHtml(contact.name)}</h4>
                <p class="text-sm text-yellow-200/60">${this.formatDate(contact.createdAt)}</p>
              </div>
            </div>
            
            <div class="space-y-2 ml-15">
              <div class="flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-yellow-200 truncate">${this.escapeHtml(contact.email)}</span>
              </div>
              
              <div class="flex items-center gap-2 text-sm">
                <svg class="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span class="text-yellow-200">${this.escapeHtml(contact.phone)}</span>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2 flex-shrink-0">
            <button 
              onclick="contactManager.editContact(${this.contacts.indexOf(contact)})" 
              class="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition border border-blue-500/50"
              title="Edit contact"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            
            <button 
              onclick="contactManager.deleteContact(${this.contacts.indexOf(contact)})" 
              class="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition border border-red-500/50"
              title="Delete contact"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            
            <div class="drag-handle cursor-move p-2 text-yellow-400/50 hover:text-yellow-400 transition" title="Drag to reorder">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    this.contactCount.textContent = contactsToRender.length;
    
    // Reinitialize drag and drop after rendering
    this.initializeDragAndDrop();
  }

  initializeDragAndDrop() {
    if (typeof Sortable !== 'undefined' && this.contactsList) {
      new Sortable(this.contactsList, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        onEnd: (evt) => {
          // Reorder the contacts array
          const movedItem = this.contacts.splice(evt.oldIndex, 1)[0];
          this.contacts.splice(evt.newIndex, 0, movedItem);
          this.saveContacts();
        }
      });
    }
  }

  updateStats() {
    // Total contacts
    this.totalContacts.textContent = this.contacts.length;
    this.contactCount.textContent = this.contacts.length;
    
    // Recently added (today)
    const today = new Date().toDateString();
    const addedToday = this.contacts.filter(contact => 
      new Date(contact.createdAt).toDateString() === today
    ).length;
    this.recentlyAdded.textContent = addedToday;
    
    // Storage used
    const storageSize = new Blob([JSON.stringify(this.contacts)]).size;
    this.storageUsed.textContent = (storageSize / 1024).toFixed(2) + ' KB';
  }

  saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  loadContacts() {
    const stored = localStorage.getItem('contacts');
    return stored ? JSON.parse(stored) : [];
  }

  formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Added today';
    } else if (diffDays === 1) {
      return 'Added yesterday';
    } else if (diffDays < 7) {
      return `Added ${diffDays} days ago`;
    } else {
      return `Added on ${date.toLocaleDateString()}`;
    }
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize Contact Manager when DOM is ready
let contactManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    contactManager = new ContactManager();
  });
} else {
  contactManager = new ContactManager();
}
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const toggleThumb = document.getElementById('toggleThumb');

  if (!themeToggle || !toggleThumb) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.checked = true;
    toggleThumb.style.transform = 'translateX(24px)';
  }

  // Toggle theme
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      toggleThumb.style.transform = 'translateX(24px)';
    } else {
      body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      toggleThumb.style.transform = 'translateX(0)';
    }
  });
});
