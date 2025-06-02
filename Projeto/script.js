const beeModel = document.getElementById("bee-model");
const sections = Array.from(document.querySelectorAll("section"));
let sectionOffsets = sections.map(section => section.offsetTop);
const lastSectionIndex = sections.length - 1;

const shiftPositions = [0, -20, 0, 25];
const cameraOrbits = [[90, 90], [-45, 90], [-180, 0], [45, 90]];

const interpolate = (start, end, progress) => start + (end - start) * progress;

const getScrollProgress = scrolly => {
    for (let i = 0; i < lastSectionIndex; i++) {
        if (scrolly >= sectionOffsets[i] && scrolly < sectionOffsets[i + 1]) {
            return i + (scrolly - sectionOffsets[i]) / (sectionOffsets[i + 1] - sectionOffsets[i]);
        }
    }
    return lastSectionIndex;
};

let ticking = false;

window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateModelOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener("resize", () => {
    sectionOffsets = sections.map(section => section.offsetTop);
});

function updateModelOnScroll() {
    const scrollProgress = getScrollProgress(window.scrollY);
    const sectionIndex = Math.floor(scrollProgress);
    const sectionProgress = scrollProgress - sectionIndex;

    const currentShift = interpolate(
        shiftPositions[sectionIndex],
        shiftPositions[sectionIndex + 1] ?? shiftPositions[sectionIndex],
        sectionProgress
    );

    const currentOrbit = cameraOrbits[sectionIndex].map((val, i) =>
        interpolate(val, cameraOrbits[sectionIndex + 1]?.[i] ?? val, sectionProgress)
    );

    beeModel.style.transform = `translateX(${currentShift}%)`;
    beeModel.setAttribute("camera-orbit", `${currentOrbit[0]}deg ${currentOrbit[1]}deg`);
}

const animatedEls = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

animatedEls.forEach(el => observer.observe(el));
