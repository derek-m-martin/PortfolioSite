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
        description: "My personal portfolio website to showcase my projects and skills",
        techStack: ["HTML", "CSS", "JavaScript"],
        lastUpdated: "2024-02-10",
        position: { x: 0, y: 0 },
        readme: "Demo readme content...",
        code: "// Demo code content...",
        screenshots: [],
        filePositions: {}
    },
    {
        name: "Finance Tracker",
        language: "java",
        description: "Personal finance tracking application for a school project",
        techStack: ["Java"],
        lastUpdated: "2024-02-08",
        position: { x: 0, y: 0 },
        readme: "Demo readme content...",
        code: "// Demo code content...",
        screenshots: [],
        filePositions: {}
    },
    {
        name: "EvoEstimator",
        language: "swift",
        description: "iOS app for providing real-time cost estimates for Vancouver's Evo Car-Share service",
        techStack: ["Swift", "SwiftUI", "Google API's"],
        lastUpdated: "2024-02-05",
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
    
    const foldersContainer = document.querySelector('.folders-container');
    foldersContainer.innerHTML = '';
    
    // make and place folder elements for each project
    const folderElements = projects.map(project => {
        const folder = document.createElement('div');
        folder.className = 'project-folder';
        
        folder.innerHTML = `
            <img src="assets/mac_folder.png" alt="Folder">
            <div class="folder-name">${project.name}</div>
        `;
        
        makeDraggable(folder, project);
        
        folder.addEventListener('mouseenter', () => updateProjectInfo(project));
        folder.addEventListener('dblclick', () => openFinder(project));
        
        return folder;
    });
    
    foldersContainer.append(...folderElements);
    
    // initialize with first project's info
    if (projects.length > 0) {
        updateProjectInfo(projects[0]);
    }
    
    projectsInitialized = true;

    // set up finder window controls
    document.querySelectorAll('.control.close').forEach(control => {
        control.addEventListener('click', (e) => {
            const finderWindow = e.target.closest('.finder-window');
            if (finderWindow) {
                finderWindow.classList.remove('active');
            }
        });
    });
}

// update project info panel
function updateProjectInfo(project) {
    const projectInfo = document.querySelector('.project-info');
    projectInfo.innerHTML = `
        <h2 class="project-info-title">${project.name}</h2>
        <p class="project-description">${project.description}</p>
        <div class="tech-stack">
            ${project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
        </div>
        <p class="last-updated">Last updated: ${project.lastUpdated}</p>
    `;
}

// fetch and show github activity
async function fetchGitHubActivity() {
    try {
        const response = await fetch('https://api.github.com/users/derek-m-martin/events?per_page=30');
        const events = await response.json();
        
        const activityContainer = document.querySelector('.github-activity');
        const activityItems = events
            .map(event => {
                let actionText = '';
                let detailText = '';
                const repoName = event.repo.name.split('/')[1];
                const date = new Date(event.created_at);
                const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
                });

                switch(event.type) {
                    case 'PushEvent':
                        const commit = event.payload.commits[0];
                        actionText = `Pushed a commit to`;
                        detailText = commit.message;
                        break;
                    case 'CreateEvent':
                        actionText = `Created a ${event.payload.ref_type}`;
                        if (event.payload.ref) {
                            detailText = `Named: ${event.payload.ref}`;
                        }
                        break;
                    case 'DeleteEvent':
                        actionText = `Deleted a ${event.payload.ref_type}`;
                        if (event.payload.ref) {
                            detailText = `Named: ${event.payload.ref}`;
                        }
                        break;
                    case 'PullRequestEvent':
                        actionText = `${event.payload.action} a pull request in`;
                        detailText = event.payload.pull_request.title;
                        break;
                    case 'IssuesEvent':
                        actionText = `${event.payload.action} an issue in`;
                        detailText = event.payload.issue.title;
                        break;
                    case 'ForkEvent':
                        actionText = `Forked`;
                        detailText = `to ${event.payload.forkee.full_name}`;
                        break;
                    case 'WatchEvent':
                        actionText = `Starred`;
                        break;
                    case 'PublicEvent':
                        actionText = `Made public`;
                        break;
                    default:
                        return null;
                }
                
                return `
                    <div class="activity-item">
                        <div>${actionText} <a href="https://github.com/${event.repo.name}" target="_blank">${repoName}</a></div>
                        ${detailText ? `<div class="activity-message">${detailText}</div>` : ''}
                        <div class="activity-time">${formattedDate}</div>
                    </div>
                `;
            })
            .filter(item => item !== null)
            .join('');
        
        activityContainer.innerHTML = `
            <h2 class="activity-title">Recent Activity</h2>
            ${activityItems}
        `;

        // set up intersection observer for fade-in effect
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            root: activityContainer,
            threshold: 0.1,
            rootMargin: '10px'
        });

        // observe all activity items
        document.querySelectorAll('.activity-item').forEach(item => {
            observer.observe(item);
        });

    } catch (error) {
        console.error('Error fetching GitHub activity:', error);
        const activityContainer = document.querySelector('.github-activity');
        activityContainer.innerHTML = `
            <h2 class="activity-title">Recent Activity</h2>
            <div class="activity-item visible">Error loading GitHub activity</div>
        `;
    }
}

// set up periodic GitHub activity updates
function initializeGitHubActivity() {
    fetchGitHubActivity();
    // Update every 5 minutes
    setInterval(fetchGitHubActivity, 5 * 60 * 1000);
}

// add drag functionality to folders and files
function makeDraggable(element, project, fileType) {
    let isDragging = false;
    let startX;
    let startY;
    let initialLeft;
    let initialTop;

    element.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseDown(e) {
        if (e.target.classList.contains('control')) return;
        
        isDragging = true;
        const rect = element.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        startX = e.clientX - initialLeft;
        startY = e.clientY - initialTop;
        element.style.cursor = 'grabbing';
        
        // if it's a file in the finder window, get its position relative to the finder-files container
        if (fileType) {
            const finderFiles = element.closest('.finder-files');
            if (finderFiles) {
                const finderRect = finderFiles.getBoundingClientRect();
                initialLeft = rect.left - finderRect.left;
                initialTop = rect.top - finderRect.top;
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
            }
        }
        
        e.preventDefault();
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        if (fileType) {
            // for files in finder window, position relative to finder-files container
            const finderFiles = element.closest('.finder-files');
            if (finderFiles) {
                const finderRect = finderFiles.getBoundingClientRect();
                const x = e.clientX - finderRect.left - startX;
                const y = e.clientY - finderRect.top - startY;
                
                element.style.position = 'absolute';
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                
                // save position for this file type
                if (project.filePositions) {
                    project.filePositions[fileType] = { x, y };
                }
            }
        } else {
            // for desktop folders
            const x = e.clientX - startX;
            const y = e.clientY - startY;
            element.style.position = 'absolute';
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            project.position = { x, y };
        }
    }

    function onMouseUp() {
        isDragging = false;
        element.style.cursor = fileType ? 'move' : 'grab';
    }
}

// start projects and fetch activity when projects section becomes active
document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.getElementById('projects');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                initializeProjects();
                initializeGitHubActivity();
            }
        });
    });
    
    observer.observe(projectsSection, {
        attributes: true,
        attributeFilter: ['class']
    });
});

// create and show finder window for project
function openFinder(project) {
    // Hide folders
    const foldersContainer = document.querySelector('.folders-container');
    foldersContainer.style.opacity = '0';
    foldersContainer.style.pointerEvents = 'none';
    
    // remove any existing finder windows
    document.querySelectorAll('.finder-window:not(#finder-template)').forEach(window => window.remove());
    
    const finderTemplate = document.getElementById('finder-template');
    const finder = finderTemplate.cloneNode(true);
    finder.id = `finder-${project.name.toLowerCase().replace(/\s+/g, '-')}`;
    finder.classList.add('active');

    // set up window content and controls
    finder.querySelector('.project-name').textContent = project.name;
    finder.querySelector('.close').onclick = () => {
        finder.remove();
        // show folders when finder is closed
        foldersContainer.style.opacity = '1';
        foldersContainer.style.pointerEvents = 'all';
    };
    finder.querySelector('.minimize').onclick = () => finder.classList.remove('active');

    // set up files in finder window
    const finderFiles = finder.querySelector('.finder-files');
    finderFiles.innerHTML = ''; // Clear existing files
    
    // create files with proper layout
    const fileTypes = ['readme', 'code', 'demo', 'preview'];
    fileTypes.forEach(fileType => {
        const file = document.createElement('div');
        file.className = 'file';
        file.dataset.type = fileType;
        
        let iconSrc, fileName;
        switch(fileType) {
            case 'readme':
                iconSrc = 'assets/paper.png';
                fileName = 'readme.txt';
                break;
            case 'code':
                iconSrc = 'assets/code_icon.png';
                fileName = `code_snippet.${project.language || 'txt'}`;
                break;
            case 'demo':
                iconSrc = 'assets/project_icon.png';
                fileName = 'demo.proj';
                break;
            case 'preview':
                iconSrc = 'assets/photo_icon.png';
                fileName = 'screenshot.jpg';
                break;
        }
        
        file.innerHTML = `
            <img src="${iconSrc}" alt="${fileType} File" class="file-icon">
            <div class="file-name">${fileName}</div>
        `;
        
        makeDraggable(file, project, fileType);
        
        file.addEventListener('dblclick', () => {
            alert(`Opening ${fileType} file... (to be implemented)`);
        });
        
        finderFiles.appendChild(file);
    });
    
    document.querySelector('.finder-desktop').appendChild(finder);
    
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

// helper function to get file icon based on extension
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        html: 'code_icon.png',
        css: 'code_icon.png',
        js: 'js.png',
        java: 'code_icon.png',
        swift: 'code_icon.png',
        md: 'paper.png'
    };
    return iconMap[ext] || 'code_icon.png';
}

