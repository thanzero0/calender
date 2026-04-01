const monthYearDisplay = document.getElementById('current-month');
const calendarGrid = document.getElementById('calendar-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const themeToggle = document.getElementById('theme-toggle');
const jumpOverlay = document.getElementById('jump-overlay');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const jumpBtn = document.getElementById('jump-btn');
const closeJump = document.getElementById('close-jump');
const applyJump = document.getElementById('apply-jump');
const todayJump = document.getElementById('today-jump');
const monthYearWrapper = document.querySelector('.month-year-wrapper');



// Theme Logic
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

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

// Populate jump selectors
function populateSelectors() {
    // Months
    monthSelect.innerHTML = monthNames.map((month, index) => 
        `<option value="${index}">${month}</option>`
    ).join('');
    
    // Years (Current year +/- 10 years)
    const currentYear = new Date().getFullYear();
    let yearHTML = '';
    for (let i = currentYear - 20; i <= currentYear + 20; i++) {
        yearHTML += `<option value="${i}">${i}</option>`;
    }
    yearSelect.innerHTML = yearHTML;
}

function openJumpOverlay() {
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();
    jumpOverlay.classList.add('active');
}

function closeJumpOverlay() {
    jumpOverlay.classList.remove('active');
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

jumpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openJumpOverlay();
});

monthYearWrapper.addEventListener('click', openJumpOverlay);

closeJump.addEventListener('click', closeJumpOverlay);

applyJump.addEventListener('click', () => {
    const selectedMonth = parseInt(monthSelect.value);
    const selectedYear = parseInt(yearSelect.value);
    
    // Set to 1st of the month first to avoid "31st Feb" jumping to March
    currentDate.setDate(1);
    currentDate.setMonth(selectedMonth);
    currentDate.setFullYear(selectedYear);
    
    renderCalendar();
    closeJumpOverlay();
    
    // Animation
    calendarGrid.style.opacity = '0';
    setTimeout(() => { calendarGrid.style.opacity = '1'; }, 10);
});

todayJump.addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar();
    closeJumpOverlay();
    
    // Animation
    calendarGrid.style.opacity = '0';
    setTimeout(() => { calendarGrid.style.opacity = '1'; }, 10);
});


// Close overlay on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeJumpOverlay();
});

// Initialization
populateSelectors();
renderCalendar();


// Add CSS transition via JS for easier dynamic animation
calendarGrid.style.transition = 'opacity 0.4s ease';

// --- Custom Cursor Glow Logic ---
const cursorGlow = document.getElementById('cursor-glow');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Movement for the glow
    cursorGlow.style.left = `${posX}px`;
    cursorGlow.style.top = `${posY}px`;
    
    // Show on first move
    if (cursorGlow.style.opacity === '0' || !cursorGlow.style.opacity) {
        cursorGlow.style.opacity = '1';
    }
});

// Hide glow when leaving the window
document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
});
