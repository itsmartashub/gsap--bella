gsap.registerPlugin(ScrollTrigger);

function initNavigation() {
	const mainNavLinks = gsap.utils.toArray('.main-nav a'); //? [a, a, a, a, a]  ovo ce biti array od nasih linkova, da posle mozemo da lupujemo kroz njih
	// gsap.utils.toArray() --> selector text (returns the raw elements wrapped in an Array)

	const mainNavLinksRev = gsap.utils.toArray('.main-nav a').reverse(); //! GENIJALNO

	//? zelimo da lupujemo kroz svaki link, da mu dodamo event mouseleave, i kad mouseleave-ujemo odredjeni link da mu se doda klasa .animate-out. I nakon nekog vremena da uklonimo ovu klasu, da kad sledeci put hoverujemo i mouseleavujemo mozemo opet sve isto.
	mainNavLinks.forEach(link => {
		link.addEventListener('mouseleave', e => {
			link.classList.add('animate-out');

			setTimeout(() => {
				link.classList.remove('animate-out');
			}, 300);
		});
	});

	function navAnimation(direction) {
		// console.log(direction); //! 1 ako skrolujemo dole, -1 kad skrolujemo nazad
		const scrollingDown = direction === 1; //? ako je direction === 1 onda ce vrednost scrollingDown biti true. A ako je ono true menjacemo autoAlpha da bude 0, tj linkovi da se ne vide. Isto i za y
		const links = scrollingDown ? mainNavLinks : mainNavLinksRev; //! u zavisnosti od redosleda linkova, animira se s leva na desno (ako skrolujemo dole), ili s desna na levo (ako skrolujemo na gore tj nazad)
		return gsap.to(links, {
			duration: 0.3,
			stagger: 0.05,
			autoAlpha: () => (scrollingDown ? 0 : 1),
			y: () => (scrollingDown ? 20 : 0),
			ease: 'Power4.out',
		});
	}

	ScrollTrigger.create({
		start: 100,
		end: 'bottom bottom-=20', // nikad valjda nece doci do end mogucnosti ove animacije jer se nikad nece doci do enda bodija, jer smo stavili -=20
		toggleClass: {
			targets: 'body',
			className: 'has-scrolled', // bodiju se dodaje klasa has-scrolled kad skrolujemo 100px od vrha stranice, a njome vidi u css-u sta radimo
		},
		onEnter: ({ direction }) => navAnimation(direction),
		onLeaveBack: ({ direction }) => navAnimation(direction),
		markers: true,
	});
}

function initHeaderTilt() {
	document.querySelector('header').addEventListener('mousemove', moveImages);
}

function moveImages(e) {
	//! bitan css pointer-events: none; tipa na logo, na circle, da ne blokiramo ovaj mousemove kad "hoverujemo" preko ovih elemenata
	const { offsetX, offsetY, target } = e;
	const { clientWidth, clientHeight } = target;

	//? ide 0 kada smo na sredini screena, i ide u plus 0.5 ako smo desno ili dole, ili -0.5 ako smo levo ili gore, kao u ovom slucaju
	//? get 0 0 the center
	const xPos = offsetX / clientWidth - 0.5;
	const yPos = offsetY / clientHeight - 0.5;

	// console.log(offsetX, offsetY, clientWidth, clientHeight);
	// console.log(xPos, yPos);

	const leftImages = gsap.utils.toArray('.hg__left .hg__image');
	const rightImages = gsap.utils.toArray('.hg__right .hg__image');
	const modifier = index => index * 1.2 + 0.5;
	// move left 3 images
	leftImages.forEach((image, index) => {
		gsap.to(image, {
			duration: 1.2,
			x: xPos * 20 * modifier(index), // pomnozili smo s nekim vecim brojem da bi se movement primetio
			y: yPos * 30 * modifier(index),
			rotationY: xPos * 40,
			rotationX: yPos * 10,
			ease: 'Power3.out',
		});
	});
	rightImages.forEach((image, index) => {
		gsap.to(image, {
			duration: 1.2,
			x: xPos * 20 * modifier(index), // pomnozili smo s nekim vecim brojem da bi se movement primetio
			y: -yPos * 30 * modifier(index),
			rotationY: xPos * 40,
			rotationX: yPos * 10,
			ease: 'Power3.out',
		});
	});
}

function init() {
	initNavigation();
	initHeaderTilt();
}

window.addEventListener('load', function () {
	init();
});
