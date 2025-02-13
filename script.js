class ParticleHeart {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particles-container');
        this.overlay = document.getElementById('regeneration-overlay');
        this.resizeTimeout = null;
        this.init();
    }

    init() {
        this.createParticles();
        window.addEventListener('resize', this.handleResize.bind(this));
        document.addEventListener('mousemove', this.handleInteraction.bind(this));
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleInteraction(e.touches[0]);
        }, { passive: false });
        this.animate();
        this.startRegeneration();
    }

    createParticles() {
        const particleCount = 500;
        const heartScale = 0.8;

        for (let i = 0; i < particleCount; i++) {
            const t = (Math.PI * 2) * (i / particleCount);
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t));
            const offsetX = (Math.random() - 0.5) * 5;
            const offsetY = (Math.random() - 0.5) * 5;

            const particle = document.createElement('div');
            particle.className = 'particle';

            this.particles.push({
                element: particle,
                baseX: (x + offsetX) * heartScale,
                baseY: (y + offsetY) * heartScale,
                x: 0,
                y: 0,
                dx: 0,
                dy: 0
            });

            this.container.appendChild(particle);
        }

        this.updatePositions(true);
    }

    updatePositions(immediate = false) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const scale = Math.min(window.innerWidth, window.innerHeight) / 40;

        this.particles.forEach(particle => {
            const targetX = centerX + particle.baseX * scale;
            const targetY = centerY + particle.baseY * scale;

            if (immediate) {
                particle.x = targetX;
                particle.y = targetY;
            }

            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updatePositions(true);
        }, 100);
    }

    handleInteraction(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const force = 15;
        const radius = 100;

        this.particles.forEach(particle => {
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < radius) {
                const angle = Math.atan2(dy, dx);
                const strength = (radius - distance) / radius * force;

                particle.dx += Math.cos(angle) * strength;
                particle.dy += Math.sin(angle) * strength;
            }
        });
    }

    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.dx;
            particle.y += particle.dy;

            particle.dx *= 0.9;
            particle.dy *= 0.9;

            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });

        requestAnimationFrame(this.animate.bind(this));
    }

    startRegeneration() {
        setInterval(() => {
            this.overlay.style.opacity = 1;
            setTimeout(() => this.overlay.style.opacity = 0, 500);

            this.particles.forEach(particle => {
                particle.dx = 0;
                particle.dy = 0;
            });

            this.updatePositions(true);
        }, 2000);
    }
}

new ParticleHeart();