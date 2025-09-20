// Amway 4 Basics Mobile App - JavaScript
// Professional business management application for Amway distributors

class AmwayApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.contacts = [];
        this.activities = [];
        this.events = [];
        this.followUps = [];
        this.currentDate = new Date();
        this.currentMonth = new Date();
        this.calendarView = 'month';
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
        this.renderCalendar();
        this.hideLoadingScreen();
        this.updateDateTime();
        
        // Update date/time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    // Data Management
    loadData() {
        // Load from localStorage or initialize with sample data
        this.contacts = JSON.parse(localStorage.getItem('amway_contacts')) || this.getSampleContacts();
        this.activities = JSON.parse(localStorage.getItem('amway_activities')) || this.getSampleActivities();
        this.events = JSON.parse(localStorage.getItem('amway_events')) || this.getSampleEvents();
        this.followUps = JSON.parse(localStorage.getItem('amway_followups')) || this.getSampleFollowUps();
    }

    saveData() {
        localStorage.setItem('amway_contacts', JSON.stringify(this.contacts));
        localStorage.setItem('amway_activities', JSON.stringify(this.activities));
        localStorage.setItem('amway_events', JSON.stringify(this.events));
        localStorage.setItem('amway_followups', JSON.stringify(this.followUps));
    }

    getSampleContacts() {
        return [
            {
                id: 1,
                name: 'John Smith',
                phone: '+1-555-0123',
                email: 'john.smith@email.com',
                category: 'prospect',
                dreams: 'Financial freedom, early retirement',
                notes: 'Interested in business opportunity',
                dateAdded: new Date().toISOString(),
                lastContact: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 2,
                name: 'Sarah Johnson',
                phone: '+1-555-0124',
                email: 'sarah.j@email.com',
                category: 'customer',
                dreams: 'Health and wellness goals',
                notes: 'Regular product user',
                dateAdded: new Date(Date.now() - 172800000).toISOString(),
                lastContact: new Date(Date.now() - 43200000).toISOString()
            },
            {
                id: 3,
                name: 'Mike Wilson',
                phone: '+1-555-0125',
                email: 'mike.wilson@email.com',
                category: 'distributor',
                dreams: 'Build successful team',
                notes: 'New distributor, needs mentoring',
                dateAdded: new Date(Date.now() - 259200000).toISOString(),
                lastContact: new Date().toISOString()
            }
        ];
    }

    getSampleActivities() {
        return [
            {
                id: 1,
                type: 'call',
                contactId: 1,
                date: new Date().toISOString(),
                outcome: 'Interested, scheduled presentation',
                nextAction: 'Business presentation on Friday',
                notes: 'Very enthusiastic about opportunity'
            },
            {
                id: 2,
                type: 'presentation',
                contactId: 2,
                date: new Date(Date.now() - 86400000).toISOString(),
                outcome: 'Decided to become customer',
                nextAction: 'Product order follow-up',
                notes: 'Loved the products, not interested in business yet'
            }
        ];
    }

    getSampleEvents() {
        const today = new Date();
        return [
            {
                id: 1,
                title: 'Business Presentation',
                type: 'presentation',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0).toISOString(),
                contactId: 1,
                notes: 'Coffee meeting at Starbucks downtown',
                status: 'scheduled'
            },
            {
                id: 2,
                title: 'Follow-up Call',
                type: 'call',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0).toISOString(),
                contactId: 2,
                notes: 'Check on product satisfaction',
                status: 'scheduled'
            },
            {
                id: 3,
                title: 'Team Training',
                type: 'meeting',
                date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 19, 0).toISOString(),
                contactId: null,
                notes: 'Monthly team development meeting',
                status: 'scheduled'
            }
        ];
    }

    getSampleFollowUps() {
        return [
            {
                id: 1,
                contactId: 1,
                type: 'presentation_followup',
                dueDate: new Date().toISOString(),
                priority: 'high',
                notes: 'Follow up on business presentation interest',
                status: 'pending'
            },
            {
                id: 2,
                contactId: 2,
                type: 'product_followup',
                dueDate: new Date(Date.now() + 86400000).toISOString(),
                priority: 'medium',
                notes: 'Check product satisfaction and reorder',
                status: 'pending'
            }
        ];
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Modal controls
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.currentTarget.dataset.modal;
                this.toggleModal(modalId);
            });
        });

        // Form submissions
        document.getElementById('add-contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addContact();
        });

        document.getElementById('add-event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addEvent();
        });

        // Search functionality
        document.getElementById('contact-search').addEventListener('input', (e) => {
            this.searchContacts(e.target.value);
        });

        // Filter functionality
        document.getElementById('contact-filter').addEventListener('change', (e) => {
            this.filterContacts(e.target.value);
        });

        // Calendar controls
        document.getElementById('prev-month').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Calendar view toggle
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.changeCalendarView(view);
            });
        });

        // Notification panel
        document.getElementById('notifications-btn').addEventListener('click', () => {
            this.toggleNotificationPanel();
        });

        document.getElementById('close-notifications').addEventListener('click', () => {
            this.toggleNotificationPanel();
        });

        // Quick action buttons
        document.getElementById('add-contact-btn').addEventListener('click', () => {
            this.toggleModal('add-contact-modal');
        });

        document.getElementById('quick-call-btn').addEventListener('click', () => {
            this.showToast('Quick call feature - Select a contact to call', 'info');
        });

        document.getElementById('send-message-btn').addEventListener('click', () => {
            this.showToast('Message feature - Select a contact to message', 'info');
        });

        document.getElementById('schedule-meeting-btn').addEventListener('click', () => {
            this.toggleModal('add-event-modal');
        });

        // Touch gestures for mobile
        this.setupTouchGestures();
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next section
                    this.navigateNext();
                } else {
                    // Swipe right - previous section
                    this.navigatePrevious();
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    // Navigation Functions
    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(sectionId).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        this.currentSection = sectionId;

        // Load section-specific data
        switch(sectionId) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'namelist':
                this.renderContactList();
                break;
            case 'activities':
                this.renderActivities();
                break;
            case 'followup':
                this.renderFollowUps();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
        }
    }

    navigateNext() {
        const sections = ['dashboard', 'namelist', 'activities', 'followup', 'calendar'];
        const currentIndex = sections.indexOf(this.currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        this.navigateToSection(sections[nextIndex]);
    }

    navigatePrevious() {
        const sections = ['dashboard', 'namelist', 'activities', 'followup', 'calendar'];
        const currentIndex = sections.indexOf(this.currentSection);
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
        this.navigateToSection(sections[prevIndex]);
    }

    switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show target tab content
        document.getElementById(tabId).classList.add('active');

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    }

    // Dashboard Functions
    renderDashboard() {
        this.updateStats();
        this.renderTodayActivities();
    }

    updateStats() {
        document.getElementById('total-contacts').textContent = this.contacts.length;
        
        const today = new Date().toDateString();
        const callsToday = this.activities.filter(activity => 
            activity.type === 'call' && new Date(activity.date).toDateString() === today
        ).length;
        document.getElementById('calls-today').textContent = callsToday;

        const thisWeek = this.getThisWeekRange();
        const presentationsWeek = this.activities.filter(activity =>
            activity.type === 'presentation' && 
            new Date(activity.date) >= thisWeek.start && 
            new Date(activity.date) <= thisWeek.end
        ).length;
        document.getElementById('presentations-week').textContent = presentationsWeek;

        const pendingFollowUps = this.followUps.filter(followUp => 
            followUp.status === 'pending'
        ).length;
        document.getElementById('follow-ups-pending').textContent = pendingFollowUps;
    }

    renderTodayActivities() {
        const today = new Date().toDateString();
        const todayEvents = this.events.filter(event => 
            new Date(event.date).toDateString() === today
        ).sort((a, b) => new Date(a.date) - new Date(b.date));

        const container = document.getElementById('today-activities');
        container.innerHTML = '';

        if (todayEvents.length === 0) {
            container.innerHTML = '<p class="no-activities">No activities scheduled for today</p>';
            return;
        }

        todayEvents.forEach(event => {
            const contact = this.contacts.find(c => c.id === event.contactId);
            const eventDate = new Date(event.date);
            
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-time">${this.formatTime(eventDate)}</div>
                <div class="activity-content">
                    <h4>${event.title}</h4>
                    <p>${contact ? contact.name : 'General'} - ${event.notes}</p>
                </div>
                <div class="activity-status ${event.status}">${this.capitalizeFirst(event.status)}</div>
            `;
            
            container.appendChild(activityItem);
        });
    }

    // Contact Management Functions
    renderContactList() {
        const container = document.getElementById('contact-list');
        container.innerHTML = '';

        if (this.contacts.length === 0) {
            container.innerHTML = '<p class="no-contacts">No contacts added yet. Click "Add Contact" to get started!</p>';
            return;
        }

        this.contacts.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.innerHTML = `
                <div class="contact-avatar">${contact.name.charAt(0).toUpperCase()}</div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-details">${contact.phone} • ${contact.email}</div>
                    <div class="contact-dreams">${contact.dreams}</div>
                </div>
                <div class="contact-status ${contact.category}">${this.capitalizeFirst(contact.category)}</div>
            `;
            
            contactItem.addEventListener('click', () => {
                this.showContactDetails(contact);
            });
            
            container.appendChild(contactItem);
        });

        this.updateContactProgress();
    }

    updateContactProgress() {
        const progress = Math.min((this.contacts.length / 300) * 100, 100);
        document.getElementById('contact-progress').textContent = `${this.contacts.length}/300`;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }

    searchContacts(query) {
        const filteredContacts = this.contacts.filter(contact =>
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            contact.email.toLowerCase().includes(query.toLowerCase()) ||
            contact.phone.includes(query)
        );
        this.renderFilteredContacts(filteredContacts);
    }

    filterContacts(category) {
        let filteredContacts = this.contacts;
        if (category !== 'all') {
            filteredContacts = this.contacts.filter(contact => contact.category === category);
        }
        this.renderFilteredContacts(filteredContacts);
    }

    renderFilteredContacts(contacts) {
        const container = document.getElementById('contact-list');
        container.innerHTML = '';

        contacts.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.innerHTML = `
                <div class="contact-avatar">${contact.name.charAt(0).toUpperCase()}</div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-details">${contact.phone} • ${contact.email}</div>
                    <div class="contact-dreams">${contact.dreams}</div>
                </div>
                <div class="contact-status ${contact.category}">${this.capitalizeFirst(contact.category)}</div>
            `;
            
            contactItem.addEventListener('click', () => {
                this.showContactDetails(contact);
            });
            
            container.appendChild(contactItem);
        });
    }

    addContact() {
        const form = document.getElementById('add-contact-form');
        const formData = new FormData(form);
        
        const newContact = {
            id: Date.now(),
            name: document.getElementById('contact-name').value,
            phone: document.getElementById('contact-phone').value,
            email: document.getElementById('contact-email').value,
            category: document.getElementById('contact-category').value,
            dreams: document.getElementById('contact-dreams').value,
            notes: document.getElementById('contact-notes').value,
            dateAdded: new Date().toISOString(),
            lastContact: null
        };

        this.contacts.push(newContact);
        this.saveData();
        this.renderContactList();
        this.toggleModal('add-contact-modal');
        this.showToast('Contact added successfully!', 'success');
        
        // Reset form
        form.reset();
    }

    showContactDetails(contact) {
        // This would open a detailed contact view
        this.showToast(`Contact details for ${contact.name}`, 'info');
    }

    // Activities Functions
    renderActivities() {
        this.renderContactLog();
        this.renderPresentationHistory();
    }

    renderContactLog() {
        const container = document.getElementById('contact-log');
        container.innerHTML = '';

        const recentActivities = this.activities
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        recentActivities.forEach(activity => {
            const contact = this.contacts.find(c => c.id === activity.contactId);
            const activityDate = new Date(activity.date);
            
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.innerHTML = `
                <div class="log-date">${this.formatDate(activityDate)}</div>
                <div class="log-content">
                    <h4>${this.capitalizeFirst(activity.type)} - ${contact ? contact.name : 'Unknown'}</h4>
                    <p><strong>Outcome:</strong> ${activity.outcome}</p>
                    <p><strong>Next Action:</strong> ${activity.nextAction}</p>
                    ${activity.notes ? `<p><strong>Notes:</strong> ${activity.notes}</p>` : ''}
                </div>
            `;
            
            container.appendChild(logItem);
        });
    }

    renderPresentationHistory() {
        const container = document.getElementById('presentation-list');
        container.innerHTML = '';

        const presentations = this.activities.filter(activity => activity.type === 'presentation');
        
        presentations.forEach(presentation => {
            const contact = this.contacts.find(c => c.id === presentation.contactId);
            const presentationDate = new Date(presentation.date);
            
            const presentationItem = document.createElement('div');
            presentationItem.className = 'presentation-item';
            presentationItem.innerHTML = `
                <div class="presentation-date">${this.formatDate(presentationDate)}</div>
                <div class="presentation-content">
                    <h4>${contact ? contact.name : 'Unknown Contact'}</h4>
                    <p><strong>Outcome:</strong> ${presentation.outcome}</p>
                    <p><strong>Next Steps:</strong> ${presentation.nextAction}</p>
                </div>
            `;
            
            container.appendChild(presentationItem);
        });
    }

    // Follow-up Functions
    renderFollowUps() {
        this.updateFollowUpCounts();
        this.renderFollowUpList();
    }

    updateFollowUpCounts() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const urgent = this.followUps.filter(followUp => 
            followUp.status === 'pending' && 
            new Date(followUp.dueDate) < today
        ).length;

        const todayCount = this.followUps.filter(followUp =>
            followUp.status === 'pending' &&
            new Date(followUp.dueDate).toDateString() === today.toDateString()
        ).length;

        const weekCount = this.followUps.filter(followUp =>
            followUp.status === 'pending' &&
            new Date(followUp.dueDate) >= today &&
            new Date(followUp.dueDate) <= weekFromNow
        ).length;

        document.getElementById('urgent-count').textContent = urgent;
        document.getElementById('today-count').textContent = todayCount;
        document.getElementById('week-count').textContent = weekCount;
    }

    renderFollowUpList() {
        const container = document.getElementById('followup-list');
        container.innerHTML = '';

        const sortedFollowUps = this.followUps
            .filter(followUp => followUp.status === 'pending')
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        sortedFollowUps.forEach(followUp => {
            const contact = this.contacts.find(c => c.id === followUp.contactId);
            const dueDate = new Date(followUp.dueDate);
            const isOverdue = dueDate < new Date();
            const isToday = dueDate.toDateString() === new Date().toDateString();

            const followUpItem = document.createElement('div');
            followUpItem.className = `followup-item ${followUp.priority} ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}`;
            followUpItem.innerHTML = `
                <div class="followup-priority">${followUp.priority.toUpperCase()}</div>
                <div class="followup-content">
                    <h4>${contact ? contact.name : 'Unknown Contact'}</h4>
                    <p>${followUp.notes}</p>
                    <div class="followup-due">Due: ${this.formatDate(dueDate)}</div>
                </div>
                <button class="btn-complete" onclick="app.completeFollowUp(${followUp.id})">✓</button>
            `;
            
            container.appendChild(followUpItem);
        });
    }

    completeFollowUp(followUpId) {
        const followUp = this.followUps.find(f => f.id === followUpId);
        if (followUp) {
            followUp.status = 'completed';
            followUp.completedDate = new Date().toISOString();
            this.saveData();
            this.renderFollowUps();
            this.showToast('Follow-up completed!', 'success');
        }
    }

    // Calendar Functions
    renderCalendar() {
        this.updateCalendarHeader();
        
        switch(this.calendarView) {
            case 'month':
                this.renderMonthView();
                break;
            case 'week':
                this.renderWeekView();
                break;
            case 'day':
                this.renderDayView();
                break;
        }
    }

    updateCalendarHeader() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        document.getElementById('current-month').textContent = 
            `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
    }

    renderMonthView() {
        const container = document.getElementById('calendar-grid');
        container.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            container.appendChild(dayHeader);
        });

        const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();
            
            // Check if day has events
            const dayEvents = this.events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === currentDate.toDateString();
            });
            
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-event');
            }
            
            // Highlight today
            if (currentDate.toDateString() === new Date().toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Dim days outside current month
            if (currentDate.getMonth() !== this.currentMonth.getMonth()) {
                dayElement.classList.add('other-month');
            }
            
            dayElement.addEventListener('click', () => {
                this.showDayEvents(currentDate, dayEvents);
            });
            
            container.appendChild(dayElement);
        }
    }

    renderWeekView() {
        // Simplified week view implementation
        const container = document.getElementById('calendar-grid');
        container.innerHTML = '<p>Week view - Coming soon!</p>';
    }

    renderDayView() {
        // Simplified day view implementation
        const container = document.getElementById('calendar-grid');
        container.innerHTML = '<p>Day view - Coming soon!</p>';
    }

    changeMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.renderCalendar();
    }

    changeCalendarView(view) {
        this.calendarView = view;
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.renderCalendar();
    }

    showDayEvents(date, events) {
        const eventPanel = document.getElementById('event-panel');
        const eventTitle = document.getElementById('event-title');
        const eventDescription = document.getElementById('event-description');
        
        if (events.length === 0) {
            eventTitle.textContent = `${this.formatDate(date)}`;
            eventDescription.textContent = 'No events scheduled for this day.';
        } else {
            eventTitle.textContent = `${this.formatDate(date)} (${events.length} event${events.length > 1 ? 's' : ''})`;
            
            let description = '';
            events.forEach(event => {
                const contact = this.contacts.find(c => c.id === event.contactId);
                description += `
                    <div class="event-item">
                        <strong>${this.formatTime(new Date(event.date))}</strong> - ${event.title}<br>
                        ${contact ? `Contact: ${contact.name}<br>` : ''}
                        ${event.notes ? `Notes: ${event.notes}` : ''}
                    </div>
                `;
            });
            
            eventDescription.innerHTML = description;
        }
    }

    addEvent() {
        const newEvent = {
            id: Date.now(),
            title: document.getElementById('event-title').value,
            type: document.getElementById('event-type').value,
            date: new Date(`${document.getElementById('event-date').value}T${document.getElementById('event-time').value}`).toISOString(),
            contactId: parseInt(document.getElementById('event-contact').value) || null,
            notes: document.getElementById('event-notes').value,
            status: 'scheduled'
        };

        this.events.push(newEvent);
        this.saveData();
        this.renderCalendar();
        this.toggleModal('add-event-modal');
        this.showToast('Event scheduled successfully!', 'success');
        
        // Reset form
        document.getElementById('add-event-form').reset();
    }

    // Utility Functions
    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1500);
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getThisWeekRange() {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        return { start: startOfWeek, end: endOfWeek };
    }

    // Modal Functions
    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.toggle('active');
        
        // Populate contact dropdown for event modal
        if (modalId === 'add-event-modal') {
            this.populateContactDropdown();
        }
    }

    populateContactDropdown() {
        const select = document.getElementById('event-contact');
        select.innerHTML = '<option value="">Select a contact...</option>';
        
        this.contacts.forEach(contact => {
            const option = document.createElement('option');
            option.value = contact.id;
            option.textContent = contact.name;
            select.appendChild(option);
        });
    }

    // Notification Functions
    toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        panel.classList.toggle('active');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.getElementById('toast-container').appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Analytics and Reporting
    generateReport() {
        const report = {
            totalContacts: this.contacts.length,
            contactsByCategory: this.getContactsByCategory(),
            activitiesThisMonth: this.getActivitiesThisMonth(),
            followUpStats: this.getFollowUpStats(),
            conversionRate: this.calculateConversionRate()
        };
        
        console.log('Business Report:', report);
        return report;
    }

    getContactsByCategory() {
        const categories = {};
        this.contacts.forEach(contact => {
            categories[contact.category] = (categories[contact.category] || 0) + 1;
        });
        return categories;
    }

    getActivitiesThisMonth() {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        
        return this.activities.filter(activity => 
            new Date(activity.date) >= thisMonth
        ).length;
    }

    getFollowUpStats() {
        const pending = this.followUps.filter(f => f.status === 'pending').length;
        const completed = this.followUps.filter(f => f.status === 'completed').length;
        const overdue = this.followUps.filter(f => 
            f.status === 'pending' && new Date(f.dueDate) < new Date()
        ).length;
        
        return { pending, completed, overdue };
    }

    calculateConversionRate() {
        const prospects = this.contacts.filter(c => c.category === 'prospect').length;
        const distributors = this.contacts.filter(c => c.category === 'distributor').length;
        
        return prospects > 0 ? ((distributors / prospects) * 100).toFixed(1) : 0;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AmwayApp();
});

// Service Worker Registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmwayApp;
}


    // New Features Implementation

    // Bulk Selection State
    isBulkSelectionMode = false;
    selectedContacts = new Set();
    currentContactForDetails = null;
    confirmationCallback = null;

    // Enhanced Event Listeners Setup
    setupEnhancedEventListeners() {
        // Bulk selection controls
        document.getElementById('bulk-select-btn').addEventListener('click', () => {
            this.toggleBulkSelectionMode();
        });

        document.getElementById('cancel-selection-btn').addEventListener('click', () => {
            this.exitBulkSelectionMode();
        });

        document.getElementById('select-all-btn').addEventListener('click', () => {
            this.selectAllContacts();
        });

        document.getElementById('delete-selected-btn').addEventListener('click', () => {
            this.deleteSelectedContacts();
        });

        // Custom follow-up controls
        document.getElementById('add-custom-followup-btn').addEventListener('click', () => {
            this.toggleModal('add-custom-followup-modal');
        });

        document.getElementById('add-custom-followup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCustomFollowUp();
        });

        // Confirmation dialog controls
        document.getElementById('close-confirmation').addEventListener('click', () => {
            this.hideConfirmationDialog();
        });

        document.getElementById('confirmation-cancel').addEventListener('click', () => {
            this.hideConfirmationDialog();
        });

        document.getElementById('confirmation-confirm').addEventListener('click', () => {
            this.executeConfirmationAction();
        });

        // Contact details modal controls
        document.getElementById('edit-contact-btn').addEventListener('click', () => {
            this.editCurrentContact();
        });

        document.getElementById('delete-contact-btn').addEventListener('click', () => {
            this.deleteCurrentContact();
        });

        document.getElementById('add-followup-for-contact-btn').addEventListener('click', () => {
            this.addFollowUpForCurrentContact();
        });
    }

    // Bulk Selection Functions
    toggleBulkSelectionMode() {
        this.isBulkSelectionMode = !this.isBulkSelectionMode;
        
        if (this.isBulkSelectionMode) {
            this.enterBulkSelectionMode();
        } else {
            this.exitBulkSelectionMode();
        }
    }

    enterBulkSelectionMode() {
        this.isBulkSelectionMode = true;
        this.selectedContacts.clear();
        
        // Show bulk actions bar
        document.getElementById('bulk-actions-bar').style.display = 'flex';
        
        // Update button text
        document.getElementById('bulk-select-btn').textContent = 'Cancel Selection';
        
        // Add checkboxes to contact items
        this.renderContactListWithSelection();
        
        this.showToast('Selection mode enabled. Tap contacts to select them.', 'info');
    }

    exitBulkSelectionMode() {
        this.isBulkSelectionMode = false;
        this.selectedContacts.clear();
        
        // Hide bulk actions bar
        document.getElementById('bulk-actions-bar').style.display = 'none';
        
        // Update button text
        document.getElementById('bulk-select-btn').textContent = 'Select Multiple';
        
        // Render normal contact list
        this.renderContactList();
    }

    selectAllContacts() {
        this.selectedContacts.clear();
        this.contacts.forEach(contact => {
            this.selectedContacts.add(contact.id);
        });
        
        this.updateBulkSelectionUI();
        this.renderContactListWithSelection();
    }

    toggleContactSelection(contactId) {
        if (this.selectedContacts.has(contactId)) {
            this.selectedContacts.delete(contactId);
        } else {
            this.selectedContacts.add(contactId);
        }
        
        this.updateBulkSelectionUI();
    }

    updateBulkSelectionUI() {
        const selectedCount = this.selectedContacts.size;
        document.getElementById('selected-count').textContent = selectedCount;
        
        // Update select all button
        const selectAllBtn = document.getElementById('select-all-btn');
        if (selectedCount === this.contacts.length && this.contacts.length > 0) {
            selectAllBtn.textContent = 'Deselect All';
        } else {
            selectAllBtn.textContent = 'Select All';
        }
        
        // Enable/disable delete button
        const deleteBtn = document.getElementById('delete-selected-btn');
        deleteBtn.disabled = selectedCount === 0;
    }

    deleteSelectedContacts() {
        const selectedCount = this.selectedContacts.size;
        if (selectedCount === 0) return;
        
        const message = `Are you sure you want to delete ${selectedCount} selected contact${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`;
        
        this.showConfirmationDialog(
            'Delete Selected Contacts',
            message,
            () => {
                // Delete selected contacts
                this.contacts = this.contacts.filter(contact => 
                    !this.selectedContacts.has(contact.id)
                );
                
                // Clean up related data
                this.cleanupRelatedData([...this.selectedContacts]);
                
                this.saveData();
                this.exitBulkSelectionMode();
                this.renderContactList();
                this.updateStats();
                
                this.showToast(`${selectedCount} contact${selectedCount > 1 ? 's' : ''} deleted successfully!`, 'success');
            }
        );
    }

    // Enhanced Contact List Rendering
    renderContactListWithSelection() {
        const container = document.getElementById('contact-list');
        container.innerHTML = '';

        if (this.contacts.length === 0) {
            container.innerHTML = '<p class="no-contacts">No contacts added yet. Click "Add Contact" to get started!</p>';
            return;
        }

        this.contacts.forEach(contact => {
            const isSelected = this.selectedContacts.has(contact.id);
            
            const contactItem = document.createElement('div');
            contactItem.className = `contact-item ${this.isBulkSelectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`;
            
            contactItem.innerHTML = `
                ${this.isBulkSelectionMode ? `
                    <input type="checkbox" class="contact-checkbox" ${isSelected ? 'checked' : ''} 
                           onchange="app.toggleContactSelection(${contact.id})">
                ` : ''}
                <div class="contact-avatar">${contact.name.charAt(0).toUpperCase()}</div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-details">${contact.phone} • ${contact.email}</div>
                    <div class="contact-dreams">${contact.dreams}</div>
                </div>
                <div class="contact-status ${contact.category}">${this.capitalizeFirst(contact.category)}</div>
                ${!this.isBulkSelectionMode ? `
                    <div class="contact-actions">
                        <button class="contact-action-btn edit" onclick="app.showContactDetails(${contact.id})" title="View Details">
                            👁️
                        </button>
                        <button class="contact-action-btn delete" onclick="app.confirmDeleteContact(${contact.id})" title="Delete Contact">
                            🗑️
                        </button>
                    </div>
                ` : ''}
            `;
            
            if (!this.isBulkSelectionMode) {
                contactItem.addEventListener('click', (e) => {
                    if (!e.target.closest('.contact-actions')) {
                        this.showContactDetails(contact.id);
                    }
                });
            }
            
            container.appendChild(contactItem);
        });

        this.updateContactProgress();
    }

    // Contact Details Functions
    showContactDetails(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        this.currentContactForDetails = contact;
        
        // Populate contact details modal
        document.getElementById('contact-details-name').textContent = contact.name;
        document.getElementById('contact-details-phone').textContent = contact.phone;
        document.getElementById('contact-details-email').textContent = contact.email;
        document.getElementById('contact-details-dreams').textContent = contact.dreams;
        document.getElementById('contact-details-notes').textContent = contact.notes;
        document.getElementById('contact-details-avatar').textContent = contact.name.charAt(0).toUpperCase();
        
        const categoryBadge = document.getElementById('contact-details-category');
        categoryBadge.textContent = this.capitalizeFirst(contact.category);
        categoryBadge.className = `contact-category-badge ${contact.category}`;
        
        this.toggleModal('contact-details-modal');
    }

    editCurrentContact() {
        if (!this.currentContactForDetails) return;
        
        // Pre-populate the add contact form with current contact data
        document.getElementById('contact-name').value = this.currentContactForDetails.name;
        document.getElementById('contact-phone').value = this.currentContactForDetails.phone;
        document.getElementById('contact-email').value = this.currentContactForDetails.email;
        document.getElementById('contact-category').value = this.currentContactForDetails.category;
        document.getElementById('contact-dreams').value = this.currentContactForDetails.dreams;
        document.getElementById('contact-notes').value = this.currentContactForDetails.notes;
        
        // Change form title and button text
        document.querySelector('#add-contact-modal .modal-header h3').textContent = 'Edit Contact';
        document.querySelector('#add-contact-form button[type="submit"]').textContent = 'Update Contact';
        
        // Set edit mode flag
        this.isEditingContact = true;
        this.editingContactId = this.currentContactForDetails.id;
        
        this.toggleModal('contact-details-modal');
        this.toggleModal('add-contact-modal');
    }

    deleteCurrentContact() {
        if (!this.currentContactForDetails) return;
        
        this.confirmDeleteContact(this.currentContactForDetails.id);
    }

    addFollowUpForCurrentContact() {
        if (!this.currentContactForDetails) return;
        
        // Pre-select the current contact in the follow-up form
        this.populateFollowUpContactDropdown();
        document.getElementById('followup-contact').value = this.currentContactForDetails.id;
        
        this.toggleModal('contact-details-modal');
        this.toggleModal('add-custom-followup-modal');
    }

    confirmDeleteContact(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        const message = `Are you sure you want to delete "${contact.name}"? This will also remove all related activities and follow-ups. This action cannot be undone.`;
        
        this.showConfirmationDialog(
            'Delete Contact',
            message,
            () => {
                this.deleteContact(contactId);
            }
        );
    }

    deleteContact(contactId) {
        // Remove contact
        this.contacts = this.contacts.filter(contact => contact.id !== contactId);
        
        // Clean up related data
        this.cleanupRelatedData([contactId]);
        
        this.saveData();
        this.renderContactList();
        this.updateStats();
        
        const contact = this.currentContactForDetails;
        this.showToast(`Contact "${contact ? contact.name : 'Unknown'}" deleted successfully!`, 'success');
        
        // Close contact details modal if open
        this.toggleModal('contact-details-modal');
    }

    cleanupRelatedData(contactIds) {
        // Remove related activities
        this.activities = this.activities.filter(activity => 
            !contactIds.includes(activity.contactId)
        );
        
        // Remove related events
        this.events = this.events.filter(event => 
            !contactIds.includes(event.contactId)
        );
        
        // Remove related follow-ups
        this.followUps = this.followUps.filter(followUp => 
            !contactIds.includes(followUp.contactId)
        );
    }

    // Custom Follow-up Functions
    populateFollowUpContactDropdown() {
        const select = document.getElementById('followup-contact');
        select.innerHTML = '<option value="">Choose a contact...</option>';
        
        this.contacts.forEach(contact => {
            const option = document.createElement('option');
            option.value = contact.id;
            option.textContent = contact.name;
            select.appendChild(option);
        });
    }

    addCustomFollowUp() {
        const contactId = parseInt(document.getElementById('followup-contact').value);
        const type = document.getElementById('followup-type').value;
        const dueDate = document.getElementById('followup-due-date').value;
        const dueTime = document.getElementById('followup-due-time').value;
        const priority = document.getElementById('followup-priority').value;
        const notes = document.getElementById('followup-notes').value;
        
        if (!contactId || !type || !dueDate || !priority) {
            this.showToast('Please fill in all required fields.', 'error');
            return;
        }
        
        // Create due date with time
        let dueDateTimeString = dueDate;
        if (dueTime) {
            dueDateTimeString += `T${dueTime}`;
        } else {
            dueDateTimeString += 'T09:00'; // Default to 9 AM
        }
        
        const newFollowUp = {
            id: Date.now(),
            contactId: contactId,
            type: type,
            dueDate: new Date(dueDateTimeString).toISOString(),
            priority: priority,
            notes: notes,
            status: 'pending',
            createdDate: new Date().toISOString()
        };
        
        this.followUps.push(newFollowUp);
        this.saveData();
        this.renderFollowUps();
        this.updateStats();
        this.toggleModal('add-custom-followup-modal');
        
        const contact = this.contacts.find(c => c.id === contactId);
        this.showToast(`Follow-up added for ${contact ? contact.name : 'contact'}!`, 'success');
        
        // Reset form
        document.getElementById('add-custom-followup-form').reset();
    }

    // Confirmation Dialog Functions
    showConfirmationDialog(title, message, callback) {
        document.getElementById('confirmation-title').textContent = title;
        document.getElementById('confirmation-message').textContent = message;
        this.confirmationCallback = callback;
        this.toggleModal('confirmation-modal');
    }

    hideConfirmationDialog() {
        this.toggleModal('confirmation-modal');
        this.confirmationCallback = null;
    }

    executeConfirmationAction() {
        if (this.confirmationCallback) {
            this.confirmationCallback();
            this.confirmationCallback = null;
        }
        this.hideConfirmationDialog();
    }

    // Enhanced Contact Addition (with edit support)
    addContact() {
        const form = document.getElementById('add-contact-form');
        
        const contactData = {
            name: document.getElementById('contact-name').value,
            phone: document.getElementById('contact-phone').value,
            email: document.getElementById('contact-email').value,
            category: document.getElementById('contact-category').value,
            dreams: document.getElementById('contact-dreams').value,
            notes: document.getElementById('contact-notes').value
        };
        
        if (this.isEditingContact && this.editingContactId) {
            // Update existing contact
            const contactIndex = this.contacts.findIndex(c => c.id === this.editingContactId);
            if (contactIndex !== -1) {
                this.contacts[contactIndex] = {
                    ...this.contacts[contactIndex],
                    ...contactData,
                    lastModified: new Date().toISOString()
                };
                this.showToast('Contact updated successfully!', 'success');
            }
            
            // Reset edit mode
            this.isEditingContact = false;
            this.editingContactId = null;
            
            // Reset form title and button
            document.querySelector('#add-contact-modal .modal-header h3').textContent = 'Add New Contact';
            document.querySelector('#add-contact-form button[type="submit"]').textContent = 'Add Contact';
        } else {
            // Add new contact
            const newContact = {
                id: Date.now(),
                ...contactData,
                dateAdded: new Date().toISOString(),
                lastContact: null
            };
            
            this.contacts.push(newContact);
            this.showToast('Contact added successfully!', 'success');
        }
        
        this.saveData();
        this.renderContactList();
        this.updateStats();
        this.toggleModal('add-contact-modal');
        
        // Reset form
        form.reset();
    }

    // Enhanced Modal Toggle
    toggleModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.toggle('active');
        
        // Populate dropdowns when opening modals
        if (modalId === 'add-event-modal' && modal.classList.contains('active')) {
            this.populateContactDropdown();
        }
        
        if (modalId === 'add-custom-followup-modal' && modal.classList.contains('active')) {
            this.populateFollowUpContactDropdown();
        }
    }

    // Enhanced Initialization
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupEnhancedEventListeners(); // Add new event listeners
        this.renderDashboard();
        this.renderCalendar();
        this.hideLoadingScreen();
        this.updateDateTime();
        
        // Initialize edit mode flags
        this.isEditingContact = false;
        this.editingContactId = null;
        
        // Update date/time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    // Override renderContactList to use enhanced version
    renderContactList() {
        if (this.isBulkSelectionMode) {
            this.renderContactListWithSelection();
        } else {
            const container = document.getElementById('contact-list');
            container.innerHTML = '';

            if (this.contacts.length === 0) {
                container.innerHTML = '<p class="no-contacts">No contacts added yet. Click "Add Contact" to get started!</p>';
                return;
            }

            this.contacts.forEach(contact => {
                const contactItem = document.createElement('div');
                contactItem.className = 'contact-item';
                contactItem.innerHTML = `
                    <div class="contact-avatar">${contact.name.charAt(0).toUpperCase()}</div>
                    <div class="contact-info">
                        <div class="contact-name">${contact.name}</div>
                        <div class="contact-details">${contact.phone} • ${contact.email}</div>
                        <div class="contact-dreams">${contact.dreams}</div>
                    </div>
                    <div class="contact-status ${contact.category}">${this.capitalizeFirst(contact.category)}</div>
                    <div class="contact-actions">
                        <button class="contact-action-btn edit" onclick="app.showContactDetails(${contact.id})" title="View Details">
                            👁️
                        </button>
                        <button class="contact-action-btn delete" onclick="app.confirmDeleteContact(${contact.id})" title="Delete Contact">
                            🗑️
                        </button>
                    </div>
                `;
                
                contactItem.addEventListener('click', (e) => {
                    if (!e.target.closest('.contact-actions')) {
                        this.showContactDetails(contact.id);
                    }
                });
                
                container.appendChild(contactItem);
            });

            this.updateContactProgress();
        }
    }
}

