console.log("Resume website loaded");

/* SMOOTH SCROLL */
document.querySelectorAll("a[href^='#']").forEach(anchor => {
anchor.addEventListener("click", function(e){
e.preventDefault();
document.querySelector(this.getAttribute("href"))
.scrollIntoView({
behavior:"smooth"
});
});
});

/* SCROLL REVEAL */
const sections = document.querySelectorAll(".section");
function revealSections(){
const trigger = window.innerHeight * 0.85;
sections.forEach(section => {
const top = section.getBoundingClientRect().top;
if(top < trigger){
section.style.opacity = "1";
section.style.transform = "translateY(0)";
}
});
}
window.addEventListener("scroll", revealSections);
revealSections();

/* PARTICLE BACKGROUND WITH CONNECTION LINES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];
class Particle {
    constructor(){
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        this.size = Math.random()*2 + 1;
        this.speedX = Math.random()*0.6 - 0.3;
        this.speedY = Math.random()*0.6 - 0.3;
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;

        if(this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if(this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw(){
        ctx.fillStyle = "cyan";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fill();
    }
}

function initParticles(){
    particlesArray = [];
    for(let i=0;i<100;i++){
        particlesArray.push(new Particle());
    }
}

function connectParticles(){
    for(let a=0; a<particlesArray.length; a++){
        for(let b=a; b<particlesArray.length; b++){
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;

            let distance = dx*dx + dy*dy;
            if(distance < 12000){
                ctx.strokeStyle = "rgba(0,255,255,0.15)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x,particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x,particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}
function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particlesArray.forEach(p=>{
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();


/* CUSTOM CURSOR */
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove",(e)=>{
cursor.style.left = e.clientX + "px";
cursor.style.top = e.clientY + "px";
});


/* FETCH GITHUB PROJECTS */
async function loadGitHubRepos(){
const username = "Farjad9305";
const response = await fetch(`https://api.github.com/users/${username}/repos`);
const repos = await response.json();
const container = document.getElementById("github-projects");
repos.slice(0,6).forEach(repo => {
const card = document.createElement("div");
card.className = "repo-card";
card.innerHTML = `
<h3>${repo.name}</h3>
<p>${repo.description || "No description available"}</p>
<a href="${repo.html_url}" target="_blank">View Repo</a>
`;
container.appendChild(card);
});
}
loadGitHubRepos();