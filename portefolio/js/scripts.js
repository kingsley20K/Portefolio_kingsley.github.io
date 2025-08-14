/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', event => {

    // --- Code navbar du template ---
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // --- Ton code carousel (version robuste avec queue et detection transitionend) ---
    const teamMembers = [
    	{ name: "Pac-Man", role: "GAME" },
    	{ name: "Michael Steward", role: "Creative Director" },
    	{ name: "Emma Rodriguez", role: "Lead Developer" },
    	{ name: "Julia Gimmel", role: "UX Designer" },
    	{ name: "Lisa Anderson", role: "Marketing Manager" },
    	{ name: "James Wilson", role: "Product Manager" }
    ];

    const cards = Array.from(document.querySelectorAll("#projects .card"));
    const dots = Array.from(document.querySelectorAll("#projects .dot"));
    const memberName = document.querySelector("#projects .member-name");
    const memberRole = document.querySelector("#projects .member-role");
    const leftArrow = document.querySelector("#projects .nav-arrow.left");
    const rightArrow = document.querySelector("#projects .nav-arrow.right");
    let currentIndex = 0;
    let isAnimating = false;
    let pendingIndex = null;

    function normalizeIndex(i) {
    	const n = cards.length;
    	return ((i % n) + n) % n;
    }

    function updateCarousel(newIndex) {
    	// si une animation est en cours, on met la demande en file d'attente
    	if (isAnimating) {
    		pendingIndex = newIndex;
    		return;
    	}
    	isAnimating = true;

    	const n = cards.length;
    	currentIndex = normalizeIndex(newIndex);

    	// calculer diff signé centré autour de 0 (ex: -2,-1,0,1,2)
    	const half = Math.floor(n / 2);
    	cards.forEach((card, i) => {
    		let diff = i - currentIndex;
    		diff = ((diff + n + half) % n) - half;

    		card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

    		if (diff === 0) card.classList.add("center");
    		else if (diff === 1) card.classList.add("right-1");
    		else if (diff === 2) card.classList.add("right-2");
    		else if (diff === -1) card.classList.add("left-1");
    		else if (diff === -2) card.classList.add("left-2");
    		else card.classList.add("hidden");
    	});

    	// points
    	dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));

    	// texte avec fondu
    	if (memberName && memberRole) {
    		memberName.style.opacity = "0";
    		memberRole.style.opacity = "0";
    		setTimeout(() => {
    			memberName.textContent = teamMembers[currentIndex].name;
    			memberRole.textContent = teamMembers[currentIndex].role;
    			memberName.style.opacity = "1";
    			memberRole.style.opacity = "1";
    		}, 250);
    	}

    	// DETECTION de la fin de transition : on écoute transitionend sur la carte centrale
    	const centerCard = cards[currentIndex];
    	if (!centerCard) {
    		// fallback improbable
    		isAnimating = false;
    		// traiter file si besoin
    		if (pendingIndex !== null) { const next = pendingIndex; pendingIndex = null; updateCarousel(next); }
    		return;
    	}

    	// Détecter la durée de transition (première valeur)
    	const cs = window.getComputedStyle(centerCard);
    	let td = cs.transitionDuration.split(',')[0].trim();
    	let durationMs = 0;
    	if (td.endsWith('ms')) durationMs = parseFloat(td);
    	else if (td.endsWith('s')) durationMs = parseFloat(td) * 1000;
    	else durationMs = 0;

    	let handled = false;
    	const onTransitionEnd = (e) => {
    		// ne réagir que si la propriété transform a fini sur la bonne élément
    		if (e.target !== centerCard) return;
    		if (e.propertyName && e.propertyName !== 'transform') return;
    		if (handled) return;
    		handled = true;
    		centerCard.removeEventListener('transitionend', onTransitionEnd);
    		isAnimating = false;
    		if (pendingIndex !== null) {
    			const next = pendingIndex;
    			pendingIndex = null;
    			// petit timeout pour laisser le DOM se stabiliser (optionnel)
    			requestAnimationFrame(() => updateCarousel(next));
    		}
    	};

    	if (durationMs > 0) {
    		centerCard.addEventListener('transitionend', onTransitionEnd);

    		// fallback : si transitionend ne se déclenche pas pour une raison X,
    		// on annule au bout d'un petit délai (duration + marge).
    		setTimeout(() => {
    			if (!handled) {
    				handled = true;
    				centerCard.removeEventListener('transitionend', onTransitionEnd);
    				isAnimating = false;
    				if (pendingIndex !== null) {
    					const next = pendingIndex;
    					pendingIndex = null;
    					requestAnimationFrame(() => updateCarousel(next));
    				}
    			}
    		}, durationMs + 80);
    	} else {
    		// pas de transition : on débloque tout de suite
    		isAnimating = false;
    		if (pendingIndex !== null) {
    			const next = pendingIndex;
    			pendingIndex = null;
    			requestAnimationFrame(() => updateCarousel(next));
    		}
    	}
    }

    // listeners
    if (leftArrow) leftArrow.addEventListener("click", () => updateCarousel(currentIndex - 1));
    if (rightArrow) rightArrow.addEventListener("click", () => updateCarousel(currentIndex + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => updateCarousel(i)));
    cards.forEach((card, i) => card.addEventListener("click", () => updateCarousel(i)));

    document.addEventListener("keydown", (e) => {
    	if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
    	else if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
    });

    // swipe
    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener("touchstart", (e) => touchStartX = e.changedTouches[0].screenX);
    document.addEventListener("touchend", (e) => {
    	touchEndX = e.changedTouches[0].screenX;
    	const diff = touchStartX - touchEndX;
    	if (Math.abs(diff) > 50) {
    		if (diff > 0) updateCarousel(currentIndex + 1);
    		else updateCarousel(currentIndex - 1);
    	}
    });

    // initialisation
    updateCarousel(0);

});
