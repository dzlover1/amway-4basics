# Amway 4 Basics Mobile App Design

## Application Overview
A comprehensive mobile web application designed for Amway distributors to manage their business activities using the proven 4 Basics system with integrated smart calendar functionality.

## Core Features

### 1. Name List Management
- Add, edit, and categorize contacts
- Track dreams and goals for each contact
- Search and filter functionality
- Progress tracking towards 300+ contacts goal
- Import/export capabilities

### 2. Contact & Invite System
- Contact history tracking
- Invitation templates and scripts
- Communication log
- Response tracking
- Follow-up reminders

### 3. Show the Plan Module
- Presentation scheduling
- Prospect information management
- Outcome tracking
- Resource library for presentations
- Success rate analytics

### 4. Follow Up & Follow Through
- Automated follow-up reminders
- Progress tracking for each prospect
- Activity logging
- Relationship status management
- Success metrics

### 5. Smart Calendar Integration
- Event scheduling and reminders
- Activity planning
- Goal tracking
- Performance analytics
- Sync with external calendars

## User Interface Design

### Navigation Structure
- Bottom navigation bar with 5 main sections:
  1. Dashboard (Home)
  2. Name List
  3. Activities (Contact/Invite/Show Plan)
  4. Follow Up
  5. Calendar

### Mobile-First Design Principles
- Touch-friendly interface with minimum 44px touch targets
- Swipe gestures for navigation
- Pull-to-refresh functionality
- Responsive design for various screen sizes
- Offline capability for core functions

### Color Scheme & Branding
- Primary: Amway Blue (#0066CC)
- Secondary: Gold (#FFD700)
- Success: Green (#28A745)
- Warning: Orange (#FFC107)
- Danger: Red (#DC3545)
- Background: Light Gray (#F8F9FA)

### Typography
- Headers: Bold, 18-24px
- Body text: Regular, 14-16px
- Captions: Light, 12-14px
- Font family: System fonts for optimal performance

## Technical Architecture

### Frontend Technologies
- HTML5 with semantic markup
- CSS3 with Flexbox and Grid
- Vanilla JavaScript (ES6+)
- Local Storage for data persistence
- Service Worker for offline functionality

### Key Components
1. Dashboard with quick stats and recent activities
2. Contact management with CRUD operations
3. Activity tracker with timeline view
4. Calendar component with event management
5. Analytics dashboard with charts and metrics

### Data Structure
- Contacts: name, phone, email, dreams, status, notes
- Activities: type, date, contact, outcome, next_action
- Events: title, date, time, type, attendees, notes
- Goals: target, current, deadline, progress

## User Experience Flow

### Onboarding
1. Welcome screen with app overview
2. Initial setup and goal setting
3. Quick tutorial of main features

### Daily Workflow
1. Check dashboard for today's activities
2. Review calendar for scheduled events
3. Add new contacts to name list
4. Log activities and outcomes
5. Schedule follow-up actions

### Key Interactions
- Swipe left/right to navigate between sections
- Long press for context menus
- Pull down to refresh data
- Tap and hold to select multiple items
- Pinch to zoom on calendar view

