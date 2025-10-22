// typewriter effect setup
const typedTextSpan = document.querySelector(".typed-text");
const cursor = document.querySelector(".cursor");
const words = ["Swift", "Java", "Python", "C#", "JavaScript", "HTML/CSS"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

// main typewriter function
function type() {
    const currentWord = words[wordIndex];
    updateCharIndex();
    updateTypedText(currentWord);
    let typeSpeed = isDeleting ? 100 : 200;
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // pause at full word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // pause before new word
    }
    setTimeout(type, typeSpeed);
}

// update character index based on mode
function updateCharIndex() {
    isDeleting ? charIndex-- : charIndex++;
}

// update the displayed text
function updateTypedText(currentWord) {
    typedTextSpan.textContent = currentWord.substring(0, charIndex);
}

// dom loaded: init typewriter and navigation behavior
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000);
    document.getElementById('landing').classList.add('active');

    // smooth scrolling for anchor links
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
    
    // check for form redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('thankyou')) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('contact').classList.add('active');
        const formSuccess = document.getElementById('form-success');
        if (formSuccess) {
            formSuccess.classList.add('visible');
            setTimeout(() => {
                formSuccess.classList.remove('visible');
            }, 5000);
        }
    }
});

// fetch latest github repo and update link
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

// project data for portfolio
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
        filePositions: {},
        githubUrl: "https://github.com/derek-m-martin/PortfolioSite",
        liveUrl: "#"
    },
    {
        name: "Finance Tracker",
        description: "Personal finance tracking application for a school project",
        techStack: ["Java"],
        lastUpdated: "2024-11-29",
        position: { x: 0, y: 0 },
        githubUrl: "https://github.com/derek-m-martin/Simple-Java-Finance-Tracker",
        liveUrl: null
    },
    {
        name: "EvoEstimator",
        description: "iOS app for providing real-time cost estimates for vancouver's evo car-share service",
        techStack: ["Swift", "SwiftUI", "Google API's"],
        lastUpdated: "2025-02-05",
        position: { x: 0, y: 0 },
        githubUrl: "https://github.com/derek-m-martin/EvoEstimatorApp",
        liveUrl: "https://apps.apple.com/ca/app/evoestimator/id6740095673"
    }
];
let projectsInitialized = false;

// initialize project cards for portfolio
function initializeProjects() {
    if (projectsInitialized) return;
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.innerHTML = '';
    const projectElements = projects.map(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-card-header">
                <h3 class="project-title">${project.name}</h3>
                <div class="project-actions">
                    ${project.githubUrl ? `
                        <a href="${project.githubUrl}" target="_blank" class="project-action" aria-label="GitHub Repo">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.016-2.04-3.338.73-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.73.084-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.304 3.492.997.107-.775.417-1.305.76-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.469-2.38 1.236-3.22-.124-.304-.536-1.527.117-3.176 0 0 1.008-.322 3.301 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.293-1.552 3.3-1.23 3.3-1.23.653 1.649.241 2.872.118 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.624-5.48 5.92.43.372.81 1.102.81 2.222 0 1.606-.015 2.898-.015 3.293 0 .318.216.69.825.574C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/>
                            </svg>
                        </a>
                    ` : ''}
                    ${project.liveUrl ? `
                        <a href="${project.liveUrl}" target="_blank" class="project-action" aria-label="Live Demo">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
                                <path d="M14 3H21V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 21H3V3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                    ` : ''}
                </div>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="tech-stack">
                ${project.techStack.map(tech => `<span class="tech-pill">${tech}</span>`).join('')}
            </div>
        `;
        return card;
    });
    projectsContainer.append(...projectElements);

    // special behavior for portfolio site card
    const portfolioCard = projectElements[0];
    if (portfolioCard) {
        const liveLink = portfolioCard.querySelector('.project-action[aria-label="Live Demo"]');
        if (liveLink) {
            liveLink.addEventListener('click', function(e) {
                e.preventDefault();
                showPortfolioPopup();
            });
        }
    }
    // force repaint
    projectsContainer.style.display = 'none';
    setTimeout(() => {
        projectsContainer.style.display = 'flex';
    }, 10);
    projectsInitialized = true;
}

// show portfolio popup message
function showPortfolioPopup() {
    let popup = document.getElementById('portfolio-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'portfolio-popup';
        popup.className = 'portfolio-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <p>You're already on my portfolio site!</p>
                <button class="popup-close">Close</button>
            </div>
        `;
        document.body.appendChild(popup);
        popup.querySelector('.popup-close').addEventListener('click', function() {
            popup.classList.remove('visible');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        });
    }
    popup.style.display = 'flex';
    setTimeout(() => {
        popup.classList.add('visible');
    }, 10);
}

// fetch and display recent github activity
async function fetchGitHubActivity() {
    const activityContainer = document.querySelector('.github-activity');
    // show loading message
    activityContainer.innerHTML = `
        <h2 class="activity-title">Recent GitHub Activity</h2>
        <div class="activity-item visible">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.1); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span>loading activity...</span>
            </div>
        </div>
    `;
    try {
        const response = await fetch('https://api.github.com/users/derek-m-martin/events/public', {
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API Error:', errorText);
            throw new Error('Failed to fetch GitHub activity');
        }
        const events = await response.json();
        // create html for each activity event
        const activityPromises = events
            .slice(0, 10)
            .map(async event => {
                let actionText = '';
                let detailText = '';
                const repoName = event.repo.name.split('/')[1];
                const date = new Date(event.created_at);
                const formattedDate = date.toLocaleDateString('en-us', { month: 'numeric', day: 'numeric', year: 'numeric' });
                switch (event.type) {
                    case 'PushEvent':
                        actionText = `Pushed commits to`;
                        try {
                            // Get the commit details using the commit API
                            const commitResponse = await fetch(`https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`);
                            if (commitResponse.ok) {
                                const commitData = await commitResponse.json();
                                detailText = commitData.commit.message;
                            } else {
                                detailText = `Commit ${event.payload.head.substring(0, 7)}`;
                            }
                        } catch (e) {
                            console.error('Error fetching commit details:', e);
                            detailText = `Commit ${event.payload.head.substring(0, 7)}`;
                        }
                        break;
                    case 'CreateEvent':
                        actionText = `Created a ${event.payload.ref_type} in`;
                        if (event.payload.ref) detailText = event.payload.ref;
                        break;
                    case 'DeleteEvent':
                        actionText = `Deleted a ${event.payload.ref_type} in`;
                        if (event.payload.ref) detailText = event.payload.ref;
                        break;
                    case 'PullRequestEvent':
                        actionText = `${event.payload.action} a pull request in`;
                        detailText = event.payload.pull_request.title;
                        break;
                    case 'IssuesEvent':
                        actionText = `${event.payload.action} an issue in`;
                        detailText = event.payload.issue.title;
                        break;
                    case 'WatchEvent':
                        actionText = `starred`;
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
            .filter(item => item !== null);
        
        // Wait for all promises to resolve
        const resolvedItems = await Promise.all(activityPromises);
        const activityItems = resolvedItems.join('');
        activityContainer.innerHTML = `
            <h2 class="activity-title">Recent GitHub Activity</h2>
            ${activityItems || '<div class="activity-item visible">No recent activity</div>'}
        `;
        document.querySelectorAll('.activity-item').forEach(item => {
            item.classList.add('visible');
        });
    } catch (error) {
        console.error('Error fetching GitHub activity:', error);
        console.log('API Response:', events);
        activityContainer.innerHTML = `
            <h2 class="activity-title">Recent GitHub Activity</h2>
            <div class="activity-item visible">
                <div style="color: #e74c3c;">Failed to load github activity. Please try again later.</div>
            </div>
        `;
    }
}

// setup periodic github activity update
function initializeGitHubActivity() {
    fetchGitHubActivity();
    const updateInterval = setInterval(fetchGitHubActivity, 120000);
    const projectsSection = document.getElementById('projects');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (!mutation.target.classList.contains('active')) {
                clearInterval(updateInterval);
            }
        });
    });
    observer.observe(projectsSection, { attributes: true, attributeFilter: ['class'] });
}

// create a timeline item element
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

// initialize timeline with navigation buttons
function initializeTimeline() {
    const timelineWrapper = document.querySelector('.timeline-items-wrapper');
    const timelineContainer = document.querySelector('.timeline-items-container');
    const prevButton = document.querySelector('.timeline-nav-button.prev');
    const nextButton = document.querySelector('.timeline-nav-button.next');
    let currentIndex = 0;
    timelineWrapper.innerHTML = '';
    timelineItems.forEach((item, index) => {
        timelineWrapper.appendChild(createTimelineItem(item, index));
    });
    const items = document.querySelectorAll('.timeline-item');
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
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateTimelineState();
        }
    });
    nextButton.addEventListener('click', () => {
        if (currentIndex < items.length - 1) {
            currentIndex++;
            updateTimelineState();
        }
    });
    updateTimelineState();
}

// init timeline when about section becomes active
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                initializeTimeline();
            }
        });
    });
    observer.observe(aboutSection, { attributes: true, attributeFilter: ['class'] });
});

// timeline data
const timelineItems = [
    {
        type: "project",
        icon: "project_icon.png",
        date: "March 2025 - Ongoing",
        title: "Portfolio Website",
        organization: "Personal Project",
        description: "Decided to pick up some HTML, CSS, and JS to create this very portfolio website so I can showcase my projects and skills to you!"
    },
    {
        type: "education",
        icon: "grad_cap.png",
        date: "September 2025 - Ongoing",
        title: "B.Sc. in Computer Science",
        organization: "Wilfrid Laurier University",
        description: "Transferred from UBC to Laurier"
    },
    {
        type: "work",
        icon: "work_icon.png",
        date: "September 2025 - Ongoing",
        title: "Food Service Worker",
        organization: "Costco Wholesale Canada",
        description: null
    },
    {
        type: "project",
        icon: "project_icon.png",
        date: "August 2024 - April 2025",
        title: "EvoEstimator iOS App",
        organization: "Personal Project",
        description: "Self-learned Swift, SwiftUI, and a few google api's to create an iOS app to provide real-time cost estimates and trip planning for Evo, Vancouver's car-sharing service."
    },
    {
        type: "work",
        icon: "work_icon.png",
        date: "April 2024 - July 2025",
        title: "Truck Team Member",
        organization: "1800-GOT-JUNK?",
        description: null
    },
    {
        type: "education",
        icon: "grad_cap.png",
        date: "September 2023 - April 2025",
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
        description: null
    }
];

// skills data for portfolio
const skills = [
    { name: "Java", level: "Experienced", percentage: 75 },
    { name: "Python", level: "Experienced", percentage: 75 },
    { name: "Swift", level: "Proficient", percentage: 50 },
    { name: "Google API's", level: "Proficient", percentage: 50 },
    { name: "C#", level: "Experienced", percentage: 75 },
    { name: "HTML/CSS", level: "Proficient", percentage: 50 },
    { name: "JavaScript", level: "Learning", percentage: 25 },
    { name: "Git/GitHub Version Control", level: "Experienced", percentage: 75 }
];
const skillLevels = ["No Experience", "Learning", "Proficient", "Experienced", "Expert"];

// create a skill bar element for each skill
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

// initialize skills section
function initializeSkills() {
    const skillBarsContainer = document.querySelector('.skill-bars');
    if (!skillBarsContainer) return;
    skillBarsContainer.innerHTML = '';
    skills.forEach(skill => {
        skillBarsContainer.appendChild(createSkillBar(skill));
    });
}

// init skills when about section becomes active
document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                initializeSkills();
            }
        });
    });
    observer.observe(aboutSection, { attributes: true, attributeFilter: ['class'] });

    // initializes projects section when it becomes active
    const projectsSection = document.getElementById('projects');
    const projectsObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                initializeProjects();
                initializeGitHubActivity();
            }
        });
    });
    projectsObserver.observe(projectsSection, { attributes: true, attributeFilter: ['class'] });
});

// handle contact form submission and initialization
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    const contactSection = document.getElementById('contact');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                console.log('contact section is now active');
                const formSuccess = document.getElementById('form-success');
                const formError = document.getElementById('form-error');
                if (formSuccess) formSuccess.classList.remove('visible');
                if (formError) formError.classList.remove('visible');
            }
        });
    });
    if (contactSection) {
        observer.observe(contactSection, { attributes: true, attributeFilter: ['class'] });
    }
});

// process contact form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    console.log('form submission started');
    const form = event.target;
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const loadingSpinner = document.getElementById('loading-spinner');
    const submitButton = form.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    loadingSpinner.style.display = 'block';
    buttonText.textContent = 'sending...';
    submitButton.disabled = true;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const formSubmitURL = 'https://formsubmit.co/ajax/derekmartin1005@gmail.com';
    try {
        console.log('sending form data');
        const response = await fetch(formSubmitURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _subject: 'portfolio contact: new message',
                _template: 'table'
            })
        });
        const result = await response.json();
        console.log('form submission result:', result);
        if (result.success === 'true' || result.success === true) {
            form.reset();
            formSuccess.classList.add('visible');
            setTimeout(() => {
                formSuccess.classList.remove('visible');
            }, 5000);
        } else {
            throw new Error('form submission failed');
        }
    } catch (error) {
        console.error('error submitting form:', error);
        formError.classList.add('visible');
        setTimeout(() => {
            formError.classList.remove('visible');
        }, 5000);
    } finally {
        loadingSpinner.style.display = 'none';
        buttonText.textContent = 'send message';
        submitButton.disabled = false;
    }
}
