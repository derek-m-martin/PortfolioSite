// select elements for typewriter effect
const typedTextSpan = document.querySelector(".typed-text");
const cursor = document.querySelector(".cursor");

// list of words for typewriter effect
const words = ["Swift", "Java", "Python", "C#", "JavaScript", "HTML/CSS"];
let wordIndex = 0; // current word index
let charIndex = 0; // current character index
let isDeleting = false; // flag to indicate deleting mode

// main function to run typewriter effect
function type() {
    const currentWord = words[wordIndex];
    updateCharIndex(); // update character index based on state
    updateTypedText(currentWord); // update displayed text

    // set typing speed based on whether text is being deleted or added
    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // pause when word is fully typed
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; // switch to typing mode
        wordIndex = (wordIndex + 1) % words.length; // move to next word
        typeSpeed = 500; // pause before starting new word
    }

    setTimeout(type, typeSpeed); // schedule next update
}

// update the character index based on whether deleting or typing
function updateCharIndex() {
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }
}

// update the text content of the typewriter element
function updateTypedText(currentWord) {
    typedTextSpan.textContent = currentWord.substring(0, charIndex);
}

// on dom loaded, start typewriter and set up navigation
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000); // start type effect after a short delay

    // show landing section by default
    document.getElementById('landing').classList.add('active');

    // enable smooth navigation for each anchor link
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            // remove active class from all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });

            // add active class to target section
            document.getElementById(targetId).classList.add('active');
        });
    });
});

// fetch latest github repository and update the link in the page
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
        console.error('error fetching github data:', error);
        document.getElementById('latest-repo').textContent = 'error loading repository';
    }
}

fetchLatestRepo();

// project data for portfolio display
const projects = [
    {
        name: "Portfolio Website",
        language: "js",
        description: "My personal portfolio website to showcase my projects and skills",
        techStack: ["HTML", "CSS", "JavaScript"],
        lastUpdated: "2025-02-14",
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
        lastUpdated: "2024-11-29",
        position: { x: 0, y: 0 },
        readme: "Demo readme content...",
        code: "// Demo code content...",
        screenshots: [],
        filePositions: {}
    },
    {
        name: "EvoEstimator",
        language: "swift",
        description: "iOS app for providing real-time cost estimates for vancouver's evo car-share service",
        techStack: ["Swift", "SwiftUI", "Google API's"],
        lastUpdated: "2025-02-05",
        position: { x: 0, y: 0 },
        readme: "Demo readme content...",
        code: "// Demo code content...",
        screenshots: [],
        filePositions: {}
    }
];

let projectsInitialized = false;

// get a random position for folders with a spacing constraint
function getRandomPosition(folderWidth, folderHeight, existingPositions = []) {
    const navHeight = 100;
    const padding = 20;
    const minDistance = 200; // minimum distance between folders

    // calculate boundaries based on window size and padding
    const maxX = window.innerWidth - folderWidth - padding;
    const minX = padding;
    const maxY = window.innerHeight - folderHeight - padding;
    const minY = navHeight;

    let attempts = 0;
    const maxAttempts = 50; // avoid infinite loops

    // find a position that is far enough from existing ones
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

    // fallback to a random position if none found
    return {
        x: Math.floor(Math.random() * (maxX - minX) + minX),
        y: Math.floor(Math.random() * (maxY - minY) + minY)
    };
}

// initialize project folders on the desktop
function initializeProjects() {
    if (projectsInitialized) return;

    const foldersContainer = document.querySelector('.folders-container');
    foldersContainer.innerHTML = '';

    // create folder element for each project
    const folderElements = projects.map(project => {
        const folder = document.createElement('div');
        folder.className = 'project-folder';
        folder.innerHTML = `
      <img src="assets/mac_folder.png" alt="folder">
      <div class="folder-name">${project.name}</div>
    `;
        makeDraggable(folder, project); // enable drag functionality
        folder.addEventListener('mouseenter', () => updateProjectInfo(project)); // update info on hover
        folder.addEventListener('dblclick', () => openFinder(project)); // open finder on double click
        return folder;
    });

    foldersContainer.append(...folderElements);

    // update info panel with first project info
    if (projects.length > 0) {
        updateProjectInfo(projects[0]);
    }

    projectsInitialized = true;

    // set up close controls for finder windows
    document.querySelectorAll('.control.close').forEach(control => {
        control.addEventListener('click', (e) => {
            const finderWindow = e.target.closest('.finder-window');
            if (finderWindow) {
                finderWindow.classList.remove('active');
            }
        });
    });
}

// update the project info panel with project details
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

// fetch and display recent github activity
async function fetchGitHubActivity() {
    const activityContainer = document.querySelector('.github-activity');

    // show loading state
    activityContainer.innerHTML = `
    <h2 class="activity-title">Recent Activity</h2>
    <div class="activity-item visible">loading activity...</div>
  `;

    try {
        const response = await fetch('https://api.github.com/users/derek-m-martin/events?per_page=30');
        const events = await response.json();

        // map each event to an html element
        const activityItems = events
            .map(event => {
                let actionText = '';
                let detailText = '';
                const repoName = event.repo.name.split('/')[1];
                const date = new Date(event.created_at);
                const formattedDate = date.toLocaleDateString('en-us', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
                });

                switch (event.type) {
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
                        actionText = `${event.payload.action} A Pull Request in`;
                        detailText = event.payload.pull_request.title;
                        break;
                    case 'IssuesEvent':
                        actionText = `${event.payload.action} An Issue in`;
                        detailText = event.payload.issue.title;
                        break;
                    case 'ForkEvent':
                        actionText = `Forked`;
                        detailText = `To ${event.payload.forkee.full_name}`;
                        break;
                    case 'WatchEvent':
                        actionText = `Starred`;
                        break;
                    case 'PublicEvent':
                        actionText = `Made Public`;
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

        // update activity container with fetched items
        activityContainer.innerHTML = `
      <h2 class="activity-title">Recent Activity</h2>
      ${activityItems}
    `;

        // use intersection observer to fade in items
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

        // observe each activity item
        document.querySelectorAll('.activity-item').forEach(item => {
            observer.observe(item);
        });

    } catch (error) {
        console.error('error fetching github activity:', error);
        activityContainer.innerHTML = `
      <h2 class="activity-title">Recent Activity</h2>
      <div class="activity-item visible">error loading github activity</div>
    `;
    }
}

// set up periodic updates for github activity
function initializeGitHubActivity() {
    fetchGitHubActivity(); // fetch immediately

    // update every 2 minutes
    const updateInterval = setInterval(fetchGitHubActivity, 2 * 60 * 1000);

    // clear update interval when projects section is not active
    const projectsSection = document.getElementById('projects');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (!mutation.target.classList.contains('active')) {
                clearInterval(updateInterval);
            }
        });
    });

    observer.observe(projectsSection, {
        attributes: true,
        attributeFilter: ['class']
    });
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

    // start dragging process
    function onMouseDown(e) {
        if (e.target.classList.contains('control')) return;

        isDragging = true;
        const rect = element.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        startX = e.clientX - initialLeft;
        startY = e.clientY - initialTop;
        element.style.cursor = 'grabbing';

        // adjust for files in finder window
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

    // update element position while dragging
    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        if (fileType) {
            const finderFiles = element.closest('.finder-files');
            if (finderFiles) {
                const finderRect = finderFiles.getBoundingClientRect();
                const x = e.clientX - finderRect.left - startX;
                const y = e.clientY - finderRect.top - startY;
                element.style.position = 'absolute';
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                if (project.filePositions) {
                    project.filePositions[fileType] = { x, y };
                }
            }
        } else {
            const x = e.clientX - startX;
            const y = e.clientY - startY;
            element.style.position = 'absolute';
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            project.position = { x, y };
        }
    }

    // end dragging process
    function onMouseUp() {
        isDragging = false;
        element.style.cursor = fileType ? 'move' : 'grab';
    }
}

// observe activation of projects section to initialize projects and github activity
document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.getElementById('projects');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                initializeProjects();
                initializeGitHubActivity(); // set up new interval each time
            }
        });
    });

    observer.observe(projectsSection, {
        attributes: true,
        attributeFilter: ['class']
    });
});

// open finder window for the selected project
function openFinder(project) {
    // hide desktop folders
    const foldersContainer = document.querySelector('.folders-container');
    foldersContainer.style.opacity = '0';
    foldersContainer.style.pointerEvents = 'none';

    // remove any existing finder windows except the template
    document.querySelectorAll('.finder-window:not(#finder-template)').forEach(window => window.remove());

    const finderTemplate = document.getElementById('finder-template');
    const finder = finderTemplate.cloneNode(true);
    finder.id = `finder-${project.name.toLowerCase().replace(/\s+/g, '-')}`;
    finder.classList.add('active');

    // set finder window title to project name
    finder.querySelector('.project-name').textContent = project.name;
    // close finder and show folders when close button is clicked
    finder.querySelector('.close').onclick = () => {
        finder.remove();
        foldersContainer.style.opacity = '1';
        foldersContainer.style.pointerEvents = 'all';
    };
    // minimize finder window when minimize button is clicked
    finder.querySelector('.minimize').onclick = () => finder.classList.remove('active');

    // setup files in finder window
    const finderFiles = finder.querySelector('.finder-files');
    finderFiles.innerHTML = ''; // clear previous files

    // create file elements for each file type
    const fileTypes = ['readme', 'code', 'demo', 'preview'];
    fileTypes.forEach(fileType => {
        const file = document.createElement('div');
        file.className = 'file';
        file.dataset.type = fileType;

        let iconSrc, fileName;
        switch (fileType) {
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
      <img src="${iconSrc}" alt="${fileType} file" class="file-icon">
      <div class="file-name">${fileName}</div>
    `;

        makeDraggable(file, project, fileType); // enable drag for file

        // placeholder action for double click on file
        file.addEventListener('dblclick', () => {
            alert(`opening ${fileType} file... (to be implemented)`);
        });

        finderFiles.appendChild(file);
    });

    document.querySelector('.finder-desktop').appendChild(finder);

    // enable dragging for finder window via its header
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

// timeline data for display
const timelineItems = [
    {
        type: "project",
        icon: "code_icon.png",
        date: "August 2024 - Present",
        title: "EvoEstimator iOS App",
        organization: "Personal Project",
        description: "Self-learned Swift, SwiftUI, and Google API's to create an iOS app to provide real-time cost estimates for trips using evo, vancouver's car-sharing service."
    },
    {
        type: "work",
        icon: "work_icon.png",
        date: "April 2024 - Present",
        title: "Truck Team Member",
        organization: "1800-GOT-JUNK?",
        description: "Performed physical labor to help remove junk from customer's homes."
    },
    {
        type: "education",
        icon: "grad_cap.png",
        date: "September 2023 - Present",
        title: "B.A. in Computer Science",
        organization: "University of British Columbia",
        description: null
    },
    {
        type: "work",
        icon: "work_icon.png",
        date: "January 2023 - August 2023",
        title: "Line Cook",
        organization: "City of Waterloo",
        description: "Prepared catering events, cooked food for the public, and maintained a rigorously clean kitchen environment."
    }
];

// create a timeline item element from timeline data
function createTimelineItem(item, index) {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    if (index === 0) timelineItem.classList.add('active');

    timelineItem.innerHTML = `
    <div class="timeline-icon ${item.type}"></div>
    <div class="timeline-content">
      <div class="timeline-date">${item.date}</div>
      <h3>${item.title}</h3>
      <h4>${item.organization}</h4>
      ${item.description ? `<p>${item.description}</p>` : ''}
    </div>
  `;

    return timelineItem;
}

// initialize timeline section with navigation buttons
function initializeTimeline() {
    const timelineWrapper = document.querySelector('.timeline-items-wrapper');
    const timelineContainer = document.querySelector('.timeline-items-container');
    const prevButton = document.querySelector('.timeline-nav-button.prev');
    const nextButton = document.querySelector('.timeline-nav-button.next');
    let currentIndex = 0;

    // clear previous timeline items
    timelineWrapper.innerHTML = '';

    // add timeline items to wrapper
    timelineItems.forEach((item, index) => {
        timelineWrapper.appendChild(createTimelineItem(item, index));
    });

    const items = document.querySelectorAll('.timeline-item');

    // update timeline position and active state based on index
    function updateTimelineState() {
        const containerHeight = timelineContainer.offsetHeight;
        const itemHeight = items[0].offsetHeight;
        const centerOffset = (containerHeight - itemHeight) / 2;
        const translation = -(currentIndex * itemHeight) + centerOffset;

        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        timelineWrapper.style.transform = `translateY(${translation}px)`;
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === items.length - 1;
    }

    // navigate to previous timeline item
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateTimelineState();
        }
    });

    // navigate to next timeline item
    nextButton.addEventListener('click', () => {
        if (currentIndex < items.length - 1) {
            currentIndex++;
            updateTimelineState();
        }
    });

    // set initial timeline state
    updateTimelineState();
}

// initialize timeline when the about section becomes active
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                initializeTimeline();
            }
        });
    });

    observer.observe(aboutSection, {
        attributes: true,
        attributeFilter: ['class']
    });
});

// skills data for portfolio
const skills = [
    { name: "Java", level: "Experienced", percentage: 75 },
    { name: "Python", level: "Experienced", percentage: 75 },
    { name: "Swift", level: "Proficient", percentage: 50 },
    { name: "Google API's", level: "Proficient", percentage: 50 },
    { name: "C#", level: "Proficient", percentage: 50 },
    { name: "HTML/CSS", level: "Learning", percentage: 25 },
    { name: "JavaScript", level: "Learning", percentage: 25 },
    { name: "Git/GitHub Version Control", level: "Experienced", percentage: 75 }
];

const skillLevels = ["No Experience", "Learning", "Proficient", "Experienced", "Expert"];

// create a skill bar element for a given skill
function createSkillBar(skill) {
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.setAttribute('data-level', skill.level);

    skillItem.innerHTML = `
    <div class="skill-info">
      <span>${skill.name}</span>
    </div>
    <div class="skill-bar">
      <div class="skill-thresholds">
        ${skillLevels.map(level => `<span>${level}</span>`).join('')}
      </div>
      <div class="skill-fill" style="width: ${skill.percentage}%"></div>
    </div>
  `;

    return skillItem;
}

// initialize the skills section by adding all skill bars
function initializeSkills() {
    const skillBarsContainer = document.querySelector('.skill-bars');
    if (!skillBarsContainer) return;

    // clear previous skill bars
    skillBarsContainer.innerHTML = '';

    // add each skill as a skill bar
    skills.forEach(skill => {
        skillBarsContainer.appendChild(createSkillBar(skill));
    });
}

// initialize skills when the about section becomes active
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                initializeSkills();
            }
        });
    });

    observer.observe(aboutSection, {
        attributes: true,
        attributeFilter: ['class']
    });
});
