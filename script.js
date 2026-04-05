const monthYearDisplay = document.getElementById('current-month');
const calendarGrid = document.getElementById('calendar-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const themeToggle = document.getElementById('theme-toggle');
const jumpOverlay = document.getElementById('jump-overlay');
const monthPicker = document.getElementById('month-picker');
const yearPicker = document.getElementById('year-picker');
const jumpBtn = document.getElementById('jump-btn');
const sizeToggle = document.getElementById('size-toggle');
const closeJump = document.getElementById('close-jump');
const applyJump = document.getElementById('apply-jump');
const todayJump = document.getElementById('today-jump');
const monthYearWrapper = document.querySelector('.month-year-wrapper');

let currentDate = new Date();
let tempSelectedMonth = currentDate.getMonth();
let tempSelectedYear = currentDate.getFullYear();

// Theme Initialization
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Size Initialization
const sizes = ['small', 'medium', 'large'];
let currentSizeIndex = sizes.indexOf(localStorage.getItem('calendar-size') || 'medium');
if (currentSizeIndex === -1) currentSizeIndex = 1;
document.body.setAttribute('data-size', sizes[currentSizeIndex]);

// Events state persistence
let calendarEvents = JSON.parse(localStorage.getItem('calendar-events')) || {};

function saveEvents() {
    localStorage.setItem('calendar-events', JSON.stringify(calendarEvents));
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

sizeToggle.addEventListener('click', () => {
    currentSizeIndex = (currentSizeIndex + 1) % sizes.length;
    const newSize = sizes[currentSizeIndex];
    document.body.setAttribute('data-size', newSize);
    localStorage.setItem('calendar-size', newSize);
});

const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

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
        // Get correct date info for previous month
        const prevMonthDate = new Date(year, month - 1, daysInPrevMonth - x + 1);
        const dayKey = `${prevMonthDate.getFullYear()}-${prevMonthDate.getMonth()}-${prevMonthDate.getDate()}`;
        
        dayDiv.textContent = daysInPrevMonth - x + 1;
        if (calendarEvents[dayKey]) dayDiv.classList.add('has-event');
        
        dayDiv.addEventListener('click', () => toggleEvent(dayKey, dayDiv));
        calendarGrid.appendChild(dayDiv);
    }
    
    // Current month's days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;
        const dayKey = `${year}-${month}-${i}`;
        
        // Check if it's today
        const today = new Date();
        if (i === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        
        if (calendarEvents[dayKey]) dayDiv.classList.add('has-event');
        
        dayDiv.addEventListener('click', () => toggleEvent(dayKey, dayDiv));
        calendarGrid.appendChild(dayDiv);
    }
    
    // Fill remaining grid slots (next month)
    const totalSlots = 42; 
    const totalRendered = adjustedFirstDay + daysInCurrentMonth;
    const remainingSlots = totalSlots - totalRendered;
    
    for (let i = 1; i <= remainingSlots; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day', 'other-month');
        const nextMonthDate = new Date(year, month + 1, i);
        const dayKey = `${nextMonthDate.getFullYear()}-${nextMonthDate.getMonth()}-${nextMonthDate.getDate()}`;
        
        dayDiv.textContent = i;
        if (calendarEvents[dayKey]) dayDiv.classList.add('has-event');
        
        dayDiv.addEventListener('click', () => toggleEvent(dayKey, dayDiv));
        calendarGrid.appendChild(dayDiv);
    }
}

function toggleEvent(dateKey, element) {
    if (calendarEvents[dateKey]) {
        delete calendarEvents[dateKey];
        element.classList.remove('has-event');
    } else {
        calendarEvents[dateKey] = true;
        element.classList.add('has-event');
    }
    saveEvents();
}

// Populate jump selectors (Custom Grid)
function populateSelectors() {
    // Months Grid
    monthPicker.innerHTML = monthNames.map((month, index) => 
        `<div class="month-item ${index === tempSelectedMonth ? 'selected' : ''}" data-month="${index}">
            ${month.substring(0, 3)}
        </div>`
    ).join('');
    
    // Years Scroller
    const currentYear = new Date().getFullYear();
    let yearHTML = '';
    for (let i = currentYear - 20; i <= currentYear + 20; i++) {
        yearHTML += `<div class="year-item ${i === tempSelectedYear ? 'selected' : ''}" data-year="${i}">${i}</div>`;
    }
    yearPicker.innerHTML = yearHTML;

    // Add click events to month items
    document.querySelectorAll('.month-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.month-item').forEach(m => m.classList.remove('selected'));
            item.classList.add('selected');
            tempSelectedMonth = parseInt(item.dataset.month);
        });
    });

    // Add click events to year items
    document.querySelectorAll('.year-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.year-item').forEach(y => y.classList.remove('selected'));
            item.classList.add('selected');
            tempSelectedYear = parseInt(item.dataset.year);
        });
    });
}

function openJumpOverlay() {
    tempSelectedMonth = currentDate.getMonth();
    tempSelectedYear = currentDate.getFullYear();
    populateSelectors();
    jumpOverlay.classList.add('active');
    
    // Scroll selected year into view
    setTimeout(() => {
        const selectedYearEl = yearPicker.querySelector('.year-item.selected');
        if (selectedYearEl) {
            selectedYearEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, 100);
}

function closeJumpOverlay() {
    jumpOverlay.classList.remove('active');
}


const animateCalendar = (direction) => {
    // direction: 'left' (next), 'right' (prev), or 'fade' (jump/today)
    
    if (direction === 'fade') {
        calendarGrid.style.opacity = '0';
        monthYearDisplay.style.opacity = '0';
        setTimeout(() => {
            renderCalendar();
            calendarGrid.style.opacity = '1';
            monthYearDisplay.style.opacity = '1';
        }, 200);
        return;
    }

    const outClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
    const inClass = direction === 'next' ? 'slide-in-right' : 'slide-in-left';

    // Slide out
    calendarGrid.classList.add(outClass);
    monthYearDisplay.classList.add(outClass);
    
    setTimeout(() => {
        // Change month
        if (direction === 'next') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        
        renderCalendar();
        
        // Setup for slide in (instantly move to opposite side)
        calendarGrid.classList.remove(outClass);
        monthYearDisplay.classList.remove(outClass);
        
        calendarGrid.classList.add(inClass);
        monthYearDisplay.classList.add(inClass);
        
        // Force reflow
        void calendarGrid.offsetWidth;
        
        // Slide in
        calendarGrid.classList.remove(inClass);
        monthYearDisplay.classList.remove(inClass);
    }, 250);
};

// Navigation Events
prevBtn.addEventListener('click', () => {
    animateCalendar('prev');
});

nextBtn.addEventListener('click', () => {
    animateCalendar('next');
});

jumpBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openJumpOverlay();
});

monthYearWrapper.addEventListener('click', openJumpOverlay);

closeJump.addEventListener('click', closeJumpOverlay);

applyJump.addEventListener('click', () => {
    // Update currentDate with temp values
    currentDate.setDate(1);
    currentDate.setMonth(tempSelectedMonth);
    currentDate.setFullYear(tempSelectedYear);
    
    animateCalendar('fade');
    closeJumpOverlay();
});


todayJump.addEventListener('click', () => {
    currentDate = new Date();
    animateCalendar('fade');
    closeJumpOverlay();
});


// Close overlay on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeJumpOverlay();
});

// Initialization
populateSelectors();
renderCalendar();

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
