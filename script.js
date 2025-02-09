const typedTextSpan = document.querySelector(".typed-text");
const cursor = document.querySelector(".cursor");

const words = ["Swift", "Java", "Python", "C#", "JavaScript", "HTML/CSS"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000);

    document.getElementById('landing').classList.add('active');

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
