# Coaching Program Management System - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [Admin Guide](#admin-guide)
4. [Coach Guide](#coach-guide)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

## Getting Started

### System Requirements
- **Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet Connection**: Stable broadband connection
- **Screen Resolution**: Minimum 1024x768 for optimal experience

### Accessing the System
1. Navigate to the system URL provided by your administrator
2. Log in with your credentials
3. You'll be redirected to your role-specific dashboard

## User Roles

### Admin Role
- **Full Access**: Create, Read, Update, Delete programs
- **Management**: Manage all coaching programs
- **Analytics**: View program statistics and reports

### Coach Role
- **Read-Only Access**: View all available programs
- **Search & Filter**: Find programs by various criteria
- **Program Details**: View detailed program information

## Admin Guide

### 1. Managing Coaching Programs

#### 1.1 Viewing All Programs
1. **Login** as an admin
2. **Navigate** to "Admin Dashboard" → "Programs"
3. **View** the complete list of programs in a table format

![Admin Programs View](docs/images/admin-programs-view.png)

#### 1.2 Creating a New Program
1. **Click** the "Add New Program" button
2. **Fill** the form with program details:
   - **Program Name**: Enter a descriptive name (required)
   - **Description**: Provide detailed program information
   - **Duration**: Specify program length (e.g., "4 weeks", "3 months")
   - **Price**: Enter program cost in USD (required)
   - **Level**: Select difficulty level (Beginner, Intermediate, Advanced)
   - **Category**: Choose program category (Training, Specialized, etc.)
   - **Active Status**: Toggle program availability
3. **Click** "Create" to save the program

**Example Program Creation:**
```
Program Name: "Advanced Batting Masterclass"
Description: "Comprehensive 6-week program covering advanced batting techniques, including footwork, shot selection, and mental preparation"
Duration: "6 weeks"
Price: 299.99
Level: "Advanced"
Category: "Specialized"
Active: Yes
```

#### 1.3 Editing Existing Programs
1. **Locate** the program in the programs list
2. **Click** the "Edit" button next to the program
3. **Modify** the program details in the form
4. **Click** "Update" to save changes
5. **Verify** changes are reflected immediately

#### 1.4 Deleting Programs
1. **Locate** the program in the programs list
2. **Click** the "Delete" button
3. **Confirm** deletion in the popup dialog
4. **Note**: This action is permanent and cannot be undone

### 2. Program Management Best Practices

#### 2.1 Naming Conventions
- Use descriptive, clear names
- Include level or target audience
- Keep names under 50 characters
- Examples:
  - ✅ "Beginner Cricket Fundamentals"
  - ✅ "Advanced Bowling Techniques"
  - ❌ "Program 1"

#### 2.2 Pricing Guidelines
- Research market rates
- Consider program duration and complexity
- Use psychological pricing (e.g., $199 instead of $200)
- Regularly review and adjust based on demand

#### 2.3 Program Descriptions
- Start with a compelling hook
- List key learning outcomes
- Include prerequisites if any
- Mention equipment requirements
- Specify target audience

**Example Description:**
```
"Master the art of spin bowling in this intensive 4-week program designed for intermediate players. Learn advanced techniques including:
- Leg-spin and off-spin variations
- Flight and trajectory control
- Reading batsman's weaknesses
- Match strategy and planning

Prerequisites: Basic bowling experience required. Suitable for players aged 14+."
```

### 3. Program Analytics

#### 3.1 Performance Metrics
- **Total Programs**: Number of active programs
- **Enrollment Rates**: Programs with highest bookings
- **Revenue Analysis**: Revenue per program category
- **Coach Assignment**: Programs with assigned coaches

#### 3.2 Regular Reviews
- **Weekly**: Check program performance
- **Monthly**: Review pricing strategy
- **Quarterly**: Analyze market trends
- **Annually**: Complete program portfolio review

## Coach Guide

### 1. Viewing Available Programs

#### 1.1 Accessing Programs
1. **Login** as a coach
2. **Navigate** to "Programs" → "Available Programs"
3. **View** all active programs in card format

![Coach Programs View](docs/images/coach-programs-view.png)

#### 1.2 Understanding Program Cards
Each program card displays:
- **Program Name**: Clear, descriptive title
- **Status Badge**: Green for active, red for inactive
- **Description**: Brief overview of the program
- **Duration**: Program length
- **Price**: Cost in USD
- **Level**: Difficulty level
- **Category**: Program type

### 2. Searching and Filtering Programs

#### 2.1 Search Functionality
1. **Use** the search bar at the top
2. **Type** keywords related to:
   - Program name
   - Description content
   - Category
   - Level
3. **Results** update automatically as you type

**Search Examples:**
- "batting" - finds all batting-related programs
- "beginner" - finds all beginner-level programs
- "4 weeks" - finds programs with 4-week duration

#### 2.2 Category Filtering
1. **Click** the category dropdown
2. **Select** desired category:
   - Training
   - Specialized
   - Workshop
   - Masterclass
3. **View** filtered results instantly

#### 2.3 Level Filtering
1. **Click** the level dropdown
2. **Select** difficulty level:
   - Beginner
   - Intermediate
   - Advanced
3. **Combine** with category filter for precise results

### 3. Program Details

#### 3.1 Viewing Detailed Information
1. **Click** on any program card
2. **View** complete program details
3. **Note** assigned coaches (if any)
4. **Check** prerequisites and requirements

#### 3.2 Understanding Program Levels
- **Beginner**: No prior experience required
- **Intermediate**: Basic skills assumed
- **Advanced**: Significant experience required

### 4. Coach-Specific Features

#### 4.1 Program Recommendations
- **Based on Specialization**: Programs matching your expertise
- **Based on Experience**: Programs suitable for your skill level
- **Popular Programs**: Most enrolled programs

#### 4.2 Bookmarking (Future Feature)
- Save favorite programs
- Create personal program lists
- Share programs with students

## Troubleshooting

### Common Issues and Solutions

#### 1. Login Problems

**Issue**: Cannot log in
**Solutions:**
- Check username/password
- Clear browser cache
- Try different browser
- Contact administrator for password reset

**Issue**: "Unauthorized" error
**Solutions:**
- Ensure you have the correct role (Admin/Coach)
- Check if account is active
- Verify token hasn't expired

#### 2. Program Display Issues

**Issue**: Programs not loading
**Solutions:**
- Check internet connection
- Refresh the page
- Clear browser cache
- Check browser console for errors

**Issue**: Missing programs
**Solutions:**
- Verify program is active
- Check filters/search terms
- Ensure proper permissions

#### 3. Form Submission Errors

**Issue**: "Validation failed" error
**Solutions:**
- Check all required fields are filled
- Ensure price is greater than 0
- Verify program name is 2-255 characters
- Check for special characters in text fields

**Issue**: "Program not found" error
**Solutions:**
- Refresh the programs list
- Check if program was deleted
- Verify program ID is correct

### Getting Help

#### 1. Support Channels
- **Technical Issues**: Contact IT support
- **Business Questions**: Contact program manager
- **Feature Requests**: Submit through feedback form

#### 2. Information to Provide
When reporting issues, include:
- Screenshot of error
- Steps to reproduce
- Browser and version
- Time of occurrence
- User role (Admin/Coach)

## Best Practices

### For Admins

#### 1. Program Management
- **Regular Updates**: Keep program information current
- **Seasonal Adjustments**: Update pricing for peak seasons
- **Feedback Integration**: Use coach feedback to improve programs
- **Market Research**: Stay competitive with pricing

#### 2. Data Management
- **Regular Backups**: Ensure data safety
- **Clean Data**: Remove duplicate or outdated programs
- **Analytics Review**: Use data to make informed decisions

### For Coaches

#### 1. Program Utilization
- **Stay Informed**: Regularly check for new programs
- **Student Matching**: Recommend appropriate programs to students
- **Feedback Loop**: Provide feedback on program effectiveness

#### 2. Professional Development
- **Skill Alignment**: Choose programs matching your expertise
- **Continuous Learning**: Stay updated with new techniques
- **Networking**: Connect with other coaches through programs

## Quick Reference

### Keyboard Shortcuts
- **Ctrl/Cmd + F**: Search programs
- **Ctrl/Cmd + R**: Refresh page
- **Tab**: Navigate between form fields
- **Enter**: Submit forms

### Mobile Access
- **Responsive Design**: Works on all devices
- **Touch Gestures**: Swipe for navigation
- **Offline Mode**: Limited functionality when offline

### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari, Edge
- **Minimum**: IE 11+ (limited features)
- **Mobile**: iOS Safari, Chrome Mobile

## Updates and Maintenance

### System Updates
- **Automatic**: Security patches and bug fixes
- **Scheduled**: Feature updates (announced in advance)
- **Emergency**: Critical fixes (immediate)

### User Notifications
- **Email**: Major updates and announcements
- **In-App**: Minor updates and tips
- **Dashboard**: System status and maintenance

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Support**: support@cricketacademy.com
