// typing effect elements and config
const typedTextSpan = document.querySelector(".typed-text");
const cursor = document.querySelector(".cursor");

const words = ["Swift", "Java", "Python", "C#", "JavaScript", "HTML/CSS"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

// main typing animation function that handles typewriter effect
function type() {
    const currentWord = words[wordIndex];
    
    updateCharIndex();
    updateTypedText(currentWord);

    // control typing speed based on state
    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;  // pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;  // pause before new word
    }

    setTimeout(type, typeSpeed);
}

function updateCharIndex() {
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }
}

function updateTypedText(currentWord) {
    typedTextSpan.textContent = currentWord.substring(0, charIndex);
}

// initialize page and handle navigation
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000);

    // show landing section by default
    document.getElementById('landing').classList.add('active');

    // handle smooth navigation between sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });

            document.getElementById(targetId).classList.add('active');
        });
    });
});

// fetch and show latest github repo
async function fetchLatestRepo() {
    try {
        const response = await fetch('https://api.github.com/users/derek-m-martin/repos?sort=updated&per_page=1');
        const data = await response.json();
        if (data && data.length > 0) {
            const latestRepo = data[0];
            const repoLink = document.getElementById('latest-repo');
            repoLink.textContent = latestRepo.name;
            repoLink.href = latestRepo.html_url;
        }
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        document.getElementById('latest-repo').textContent = 'Error loading repository';
    }
}

fetchLatestRepo();

// project data and content
const projects = [
    {
        name: "Portfolio Website",
        language: "js",
        position: { x: 0, y: 0 },
        readme: "Demo readme content...",
        code: "// Demo code content...",
        screenshots: [],
        filePositions: {}
    },
    {
        name: "Finance Tracker",
        language: "java",
        position: { x: 0, y: 0 },
        readme: "Demo readme content...",
        code: "// Demo code content...",
        screenshots: [],
        filePositions: {}
    },
    {
        name: "EvoEstimator",
        language: "swift",
        position: { x: 0, y: 0 },
        readme: "Demo readme content...",
        code: "// Demo code content...",
        screenshots: [],
        filePositions: {}
    }
];

let projectsInitialized = false;

// get random position for folders with spacing
function getRandomPosition(folderWidth, folderHeight, existingPositions = []) {
    const navHeight = 100;
    const padding = 20;
    const minDistance = 200;  // min space between folders
    
    // calculate boundaries with window size and padding
    const maxX = window.innerWidth - folderWidth - padding;
    const minX = padding;
    const maxY = window.innerHeight - folderHeight - padding;
    const minY = navHeight;
    
    let attempts = 0;
    const maxAttempts = 50;  // prevent infinite loops
    
    // try to find position with minimum distance from others
    while (attempts < maxAttempts) {
        const position = {
            x: Math.floor(Math.random() * (maxX - minX) + minX),
            y: Math.floor(Math.random() * (maxY - minY) + minY)
        };
        
        const isFarEnough = existingPositions.every(existing => {
            const distance = Math.sqrt(
                Math.pow(position.x - existing.x, 2) + 
                Math.pow(position.y - existing.y, 2)
            );
            return distance >= minDistance;
        });
        
        if (isFarEnough || existingPositions.length === 0) {
            return position;
        }
        
        attempts++;
    }
    
    // fallback random position if no good spot found
    return {
        x: Math.floor(Math.random() * (maxX - minX) + minX),
        y: Math.floor(Math.random() * (maxY - minY) + minY)
    };
}

// set up project folders on desktop
function initializeProjects() {
    if (projectsInitialized) return;
    
    const desktop = document.querySelector('.finder-desktop');
    desktop.innerHTML = '';
    
    const folderWidth = 160;
    const folderHeight = 140;
    const existingPositions = [];
    
    // make and place folder elements for each project
    const folderElements = projects.map(project => {
        const position = getRandomPosition(folderWidth, folderHeight, existingPositions);
        existingPositions.push(position);
        project.position = position;
        
        const folder = document.createElement('div');
        folder.className = 'project-folder';
        folder.style.left = position.x + 'px';
        folder.style.top = position.y + 'px';
        
        folder.innerHTML = `
            <img src="assets/mac_folder.png" alt="Folder">
            <div class="folder-name">${project.name}</div>
        `;
        
        makeDraggable(folder);
        folder.addEventListener('dblclick', () => openFinder(project));
        
        return folder;
    });
    
    desktop.append(...folderElements);
    projectsInitialized = true;
}

// add drag functionality to folders and files
function makeDraggable(element, project = null, fileType = null) {
    let isDragging = false;
    let currentX = parseInt(element.style.left) || 0;
    let currentY = parseInt(element.style.top) || 0;
    let startX;
    let startY;

    element.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    function onMouseDown(e) {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        e.preventDefault();
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        
        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';

        if (project && fileType) {
            project.filePositions[fileType] = { x: currentX, y: currentY };
        }
        
        e.preventDefault();
    }

    function onMouseUp() {
        isDragging = false;
    }
}

// create and show finder window for project
function openFinder(project) {
    const finderTemplate = document.getElementById('finder-template');
    const finder = finderTemplate.cloneNode(true);
    finder.id = `finder-${project.name.toLowerCase().replace(/\s+/g, '-')}`;
    finder.classList.add('active');

    // set up window content and controls
    finder.querySelector('.project-name').textContent = project.name;
    finder.querySelector('.close').onclick = () => finder.remove();
    finder.querySelector('.minimize').onclick = () => finder.classList.remove('active');

    // set up files in finder window
    finder.querySelectorAll('.file').forEach(file => {
        const fileType = file.dataset.type;
        
        // restore saved file positions
        if (project.filePositions[fileType]) {
            file.style.left = `${project.filePositions[fileType].x}px`;
            file.style.top = `${project.filePositions[fileType].y}px`;
        }
        
        // set file extension based on project language
        if (fileType === 'code') {
            const fileNameElement = file.querySelector('.file-name');
            const extension = project.language || 'txt';
            fileNameElement.textContent = `code_snippet.${extension}`;
        }
        
        makeDraggable(file, project, fileType);
        
        file.addEventListener('dblclick', () => {
            const type = file.dataset.type;
            alert(`Opening ${type} file... (to be implemented)`);
        });
    });
    
    document.body.appendChild(finder);
    
    // enable dragging finder window by header
    let isDragging = false;
    let startX;
    let startY;
    let initialLeft;
    let initialTop;

    finder.querySelector('.finder-header').addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('control')) return;
        
        isDragging = true;
        const rect = finder.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        startX = e.clientX - initialLeft;
        startY = e.clientY - initialTop;
        finder.style.cursor = 'move';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        e.preventDefault();
        
        const left = e.clientX - startX;
        const top = e.clientY - startY;
        
        finder.style.left = `${left}px`;
        finder.style.top = `${top}px`;
        finder.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        finder.style.cursor = 'default';
    });
}

// start projects when projects section becomes active
document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.getElementById('projects');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                initializeProjects();
            }
        });
    });
    
    observer.observe(projectsSection, {
        attributes: true,
        attributeFilter: ['class']
    });
});
