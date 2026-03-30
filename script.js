const monthYearDisplay = document.getElementById('current-month');
const calendarGrid = document.getElementById('calendar-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

let currentDate = new Date();

function renderCalendar() {
    // Current month and year information
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Display header text
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
    
    // Reset grid content (keep only headers)
    const dayNameHTML = dayNames.map(day => `<div class="day-name">${day}</div>`).join('');
    calendarGrid.innerHTML = dayNameHTML;
    
    // Day calculation
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Adjusting for Monday start week (Senin = index 0)
    // 0(Sun)->6, 1(Mon)->0, 2(Tue)->1, ...
    const adjustedFirstDay = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Fill empty slots from previous month
    for (let x = adjustedFirstDay; x > 0; x--) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'other-month');
        dayDiv.textContent = daysInPrevMonth - x + 1;
        calendarGrid.appendChild(dayDiv);
    }
    
    // Current month's days
    const today = new Date();
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;
        
        // Check if it's today
        if (i === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        
        calendarGrid.appendChild(dayDiv);
    }
    
    // Fill remaining grid slots to maintain consistent layout (showing first few days of next month)
    const totalSlots = 42; // 6 rows * 7 columns
    const totalRendered = adjustedFirstDay + daysInCurrentMonth;
    const remainingSlots = totalSlots - totalRendered;
    
    for (let i = 1; i <= remainingSlots; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'other-month');
        dayDiv.textContent = i;
        calendarGrid.appendChild(dayDiv);
    }
}

// Navigation Events
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    // Add simple animation trigger
    calendarGrid.style.opacity = '0';
    setTimeout(() => { calendarGrid.style.opacity = '1'; }, 10);
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    // Add simple animation trigger
    calendarGrid.style.opacity = '0';
    setTimeout(() => { calendarGrid.style.opacity = '1'; }, 10);
});

// Initialization
renderCalendar();

// Add CSS transition via JS for easier dynamic animation
calendarGrid.style.transition = 'opacity 0.4s ease';
