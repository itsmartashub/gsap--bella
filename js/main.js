gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let bodyScrollBar;

const select = e => document.querySelector(e);
const selectAll = e => document.querySelectorAll(e);

const sections = selectAll('.rg__column');
const allLinks = gsap.utils.toArray('.portfolio__categories a');
const pageBackground = select('.fill-background');
const largeImage = select('.portfolio__image--l');
const smallImage = select('.portfolio__image--s');
const lInside = select('.portfolio__image--l .image_inside');
const sInside = select('.portfolio__image--s .image_inside');

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
		// markers: true,
	});
}

function initHeaderTilt() {
	select('header').addEventListener('mousemove', moveImages);
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
function initHoverReveal() {
	sections.forEach(section => {
		// console.log(typeof section); //!!!! posto je ovo object, zato mozemo da mu attached neke propertije poput imageBlock i mask koji ce biti selektori, i posle ih pozovemo tj koristimo u onoj createHoverReaveal f-ji

		// get components for animations
		section.imageBlock = section.querySelector('.rg__image');
		section.image = section.querySelector('.rg__image img');
		section.mask = section.querySelector('.rg__image--mask');
		section.text = section.querySelector('.rg__text');
		section.textCopy = section.querySelector('.rg__text--copy');
		section.textMask = section.querySelector('.rg__text--mask');
		section.textP = section.querySelector('.rg__text--copy p');

		// reset the initial position
		gsap.set([section.imageBlock, section.textMask], { yPercent: -101 });
		gsap.set([section.mask, section.textP], { yPercent: 100 });
		gsap.set(section.image, { scale: 1.2 });

		//add event listeners to each section
		section.addEventListener('mouseenter', createHoverReveal);
		section.addEventListener('mouseleave', createHoverReveal);
	});
}
function getTextHeight(textCopy) {
	return textCopy.clientHeight;
}
function createHoverReveal(e) {
	// console.log(e.type);

	const { imageBlock, mask, text, textCopy, textMask, textP, image } =
		e.target; //! ovo. WOW

	// console.log(imageBlock, mask);
	// console.log(e.target.dataset.color);

	let tl = gsap.timeline({
		defaults: {
			duration: 0.7,
			ease: 'Power4.out',
		},
	});

	if (e.type === 'mouseenter') {
		tl.to([mask, imageBlock, textMask, textP], { yPercent: 0 })
			.to(text, { y: -getTextHeight(textCopy) / 2 }, 0)
			.to(image, { duration: 1.1, scale: 1 }, 0)
			.to(
				e.target.closest('.reveal-gallery'),
				{ backgroundColor: e.target.dataset.color },
				0
			);
	} else if (e.type === 'mouseleave') {
		tl.to([mask, textP], { yPercent: 100 })
			.to([imageBlock, textMask], { yPercent: -101 }, 0) //! ova nula je bitna, da bi se ove dve animacije istovremeno odigrale, inace je jako cudno, pogledaj.
			.to(text, { y: 0 }, 0)
			.to(image, { scale: 1.2 }, 0);
	}

	return tl;
}

function initPortfolioHover() {
	allLinks.forEach(link => {
		link.addEventListener('mouseenter', createPortfolioHover);
		link.addEventListener('mouseleave', createPortfolioHover);
		link.addEventListener('mousemove', createPortfolioMove);
	});
}
function createPortfolioHover(e) {
	if (e.type === 'mouseenter') {
		// change images to the right urls
		// fade in images
		// all siblings to white and fade out
		// active link to white
		// update page background color

		const { color, imagelarge, imagesmall } = e.target.dataset; //! ovo su imena data-color, data-imagelarge, data-imagesmall
		const allSiblings = allLinks.filter(link => link !== e.target); //! dohvatamo sve linkove osim ovog koji je aktivan tj koji smo hoverovali/mouseenterovali
		const tl = gsap.timeline();

		tl.set(lInside, { backgroundImage: `url(${imagelarge})` }) // setujemo bg vecu sliku na osnovu data-atributa
			.set(sInside, { backgroundImage: `url(${imagesmall})` }) // setujemo bg ma nju sliku na osnovu data-atributa
			.to([largeImage, smallImage], { autoAlpha: 1 }) // fejdujemo slike IN
			.to(allSiblings, { color: '#fff', autoAlpha: 0.2 }, 0) // fejdujemo OUT sve siblings, sve linkove koje nisu trenutno mouseenter
			.to(e.target, { color: '#fff', autoAlpha: 1 }, 0) // aktivan hoverovan link stavljamo mu fejd 1
			.to(pageBackground, { backgroundColor: color, ease: 'none' }, 0); // menjamo bg color of stranice u zavisnosti od onog linka koji smo hoverovali pa koju boju ima u data-color

		// tl.set(lInside, { backgroundImage: `url(${imagelarge})` })
		// 	.set(sInside, { backgroundImage: `url(${imagesmall})` })
		// 	.to([largeImage, smallImage], { autoAlpha: 1 })
		// 	.to(allSiblings, { color: '#fff', autoAlpha: 0.2 }, 0)
		// 	.to(e.target, { color: '#fff', autoAlpha: 1 }, 0)
		// 	.to(pageBackground, { backgroundColor: color, ease: 'none' }, 0);
	} else if (e.type === 'mouseleave') {
		// fade out images
		// all links back to black
		// change page background color back to default #ACB7AB

		const tl = gsap.timeline();
		tl.to([largeImage, smallImage], { autoAlpha: 0 }) // fade out all the images
			.to(allLinks, { color: '#000', autoAlpha: 1 }, 0) // all links back to black
			.to(
				pageBackground,
				{ backgroundColor: '#ACB7AB', ease: 'none' },
				0
			); // change page background color back to default #ACB7AB
	}
}

function createPortfolioMove(e) {
	const { clientY } = e;

	// console.log(
	// 	clientY,
	// 	select('.portfolio__categories').clientHeight
	// );

	// move large image
	gsap.to(largeImage, {
		duration: 1.2,
		y: getPortfolioOffset(clientY) / 6, //? select('.portfolio__categories').clientHeight je visina tj height .portfolio__categories diva, clientY je distanca u pixelima od vrha windowa do mesta gde se trenutno cursor nalazi
		// x: -getPortfolioOffset(clientY) / 10,
		ease: 'Power3.out',
	});
	// move small image
	gsap.to(smallImage, {
		duration: 1.5,
		y: getPortfolioOffset(clientY) / 3,
		// y: -getPortfolioOffset(clientY) / 3,
		// x: getPortfolioOffset(clientY) / 10,
		ease: 'Power3.out',
	});
}

function getPortfolioOffset(clientY) {
	return -(select('.portfolio__categories').clientHeight / clientY);
}

function initImageParallax() {
	// select all sections .with-parallax
	const parallaxElements = gsap.utils.toArray('.with-parallax');
	if (!parallaxElements[0]) return;

	parallaxElements.forEach(laxEl => {
		// get the image
		const image = laxEl.querySelector('img');

		// console.log(image);

		//create tween for the image
		gsap.to(image, {
			yPercent: 40, // jer je img po defaultu top: -40%
			ease: 'none',
			scrollTrigger: {
				trigger: laxEl,
				start: 'top bottom',
				scrub: true,
				// scrub: 1, //! kada user skroluje nesto se desava, kada ne skroluje nista se ne desava. OVo je najbitniji properti za ovo
				// markers: true,
			},
		});
	});
}

function initPinSteps() {
	ScrollTrigger.create({
		trigger: '.fixed-nav',
		start: 'top center',
		endTrigger: '#stage4',
		end: 'center center',
		pin: true,
		pinReparent: true, // ! i dalje je pinovano, ali je premesteno u kodu izvan tog gde je u body direkt, ne unutar nekog elementa. Nije unutar #scroll-containera pa unutar tu nekog el jer se on skroluje, vec posto je fixed izbacili smo ga izvan. Probaj bez ovoga, pa vidi razliku. Mada kod mene ne radi bas kad se klikne, hm
		// markers: true,
	});

	const getVh = () => {
		const vh = Math.max(
			document.documentElement.clientHeight || 0,
			window.innerHeight || 0
		);
		return vh;
	};

	const updateBodyColor = color => {
		// gsap way of changing color
		// gsap.to('.fill-background', { backgroundColor: color, ease: 'none' });

		// css way of changing color
		document.documentElement.style.setProperty('--bcg-fill-color', color);
	};

	gsap.utils.toArray('.stage').forEach((stage, index) => {
		const navLinks = gsap.utils.toArray('.fixed-nav li');

		// console.log(stage.clientHeight + getVh() / 10);

		ScrollTrigger.create({
			trigger: stage,
			start: 'top center',
			end: () => `+=${stage.clientHeight + getVh() / 10}`, // podelejno za 10 (vh) jer nas ovaj stage element ima padding tih 10vh u kojima trigger nije okinut. Tj nema tog free space iliti delaya izmedju toggles, tj manjanja aktivnih klasa
			toggleClass: {
				targets: navLinks[index],
				className: 'is-active',
			},
			// markers: true,
			onEnter: () => updateBodyColor(stage.dataset.color), // dakle kada ovaj stage enter, kada skrol triger postane aktivan, tada dohvatamo dataset sa stage u kom storagujemo boju, i menjamo boju onog diva .fill-background
			onEnterBack: () => updateBodyColor(stage.dataset.color), // da i kad se vracamo da se menja boja
		});
	});
}

function initScrollTo() {
	// fin all links and animate to the right position
	gsap.utils.toArray('.fixed-nav a').forEach(link => {
		const target = link.getAttribute('href');

		link.addEventListener('click', e => {
			e.preventDefault();

			bodyScrollBar.scrollIntoView(document.select(target), {
				damping: 0.07,
				offsetTop: 100,
			});

			// gsap.to(window, {
			// 	duration: 1.5,
			// 	scrollTo: target,
			// 	ease: 'Power2.out',
			// });
		});
	});
}

function initSmoothScrollbar() {
	bodyScrollBar = Scrollbar.init(select('#viewport'), { damping: 0.07 });

	// remove horizontal scrollbar
	bodyScrollBar.track.xAxis.element.remove();

	// keep ScrollTrigger in sync with Smooth Scrollbar
	ScrollTrigger.scrollerProxy(document.body, {
		scrollTop(value) {
			if (arguments.length) {
				bodyScrollBar.scrollTop = value; // setter
			}
			return bodyScrollBar.scrollTop; // getter
		},
	});

	// when the smooth scroller updates, tell ScrollTrigger to update() too:
	bodyScrollBar.addListener(ScrollTrigger.update);
}

function initLoader() {
	const tlLoaderIn = gsap.timeline({
		id: 'tlLoaderIn', // Ovo je sa GSDevTools koji kod mene jbg ne radi jer je to za premium
		defaults: {
			duration: 1.1,
			ease: 'power2.out',
		},
		onComplete: () => select('body').classList.remove('is-loading'),
	});

	const loaderInner = select('.loader .inner');
	const image = select('.loader__image img');
	const mask = select('.loader__image--mask');
	const line1 = select('.loader__title--mask:nth-child(1) span');
	const line2 = select('.loader__title--mask:nth-child(2) span');
	const lines = selectAll('.loader__title--mask');
	const loader = select('.loader');
	const loaderContent = select('.loader__content');

	tlLoaderIn
		.set([loader, loaderContent], { autoAlpha: 1 })
		.from(loaderInner, { scaleY: 0, transformOrigin: 'bottom' }, 0.2)
		.addLabel('revealImage')
		.from(mask, { yPercent: 100 }, 'revealImage-=0.6') // koliko god da prethodni deo timeline-a traje zelimo da ovaj krene 0.6s ranije, overlapuje ga
		.from(image, { yPercent: -80 }, 'revealImage-=0.6') // krece se usuprotnom pravcu od svog containera tj mask-a, i onda deluje kao parallax. Mask ide gore, slika na dole
		.from(
			[line1, line2],
			{ yPercent: 100, stagger: 0.1 },
			'revealImage-=0.4'
		);

	const tlLoaderOut = gsap.timeline({
		id: 'tlLoaderOut',
		defaults: {
			duration: 1.1,
			ease: 'power2.inOut',
		},
		delay: 1,
	});

	tlLoaderOut
		.to(lines, { yPercent: -300, stagger: 0.2 }, 0)
		.to([loader, loaderContent], { yPercent: -100 }, 0.2)
		.from('#main', { y: 150 }, 0.2);

	// treba nam time gap izmedju ova dva timeline-a, izmedju tlLoaderIn i tlLoaderOut:
	const tlLoader = gsap.timeline();
	tlLoader.add(tlLoaderIn).add(tlLoaderOut);

	// GSDevTools.create({ paused: true });
}

function init() {
	initLoader();
	initSmoothScrollbar();
	initNavigation();
	initHeaderTilt();
	initHoverReveal();
	initPortfolioHover();
	initImageParallax();
	initPinSteps();
	initScrollTo();
}

window.addEventListener('load', function () {
	init();
});

// * ======================= GSAP SMOOTHSCROLLING
/*
let container = select('#scroll-container');
let height;
function setHeight() {
	height = container.clientHeight;
	document.body.style.height = `${height}px`;
}

console.log(ScrollTrigger);

ScrollTrigger.addEventListener('refreshInit', setHeight); //! ScrollTrigger i njegov refreshInit event se okine na prvom page loadu i svaki put kada se resizuje browser

gsap.to(container, {
	y: () => -(height - document.documentElement.clientHeight),
	// ease: 'Power2.out', //! mnogo bolje kad je ease: 'none', scrub se pobrine za smooth, kasne bre efekti nad itd. Ali i kad je scrub: 3 je lose zapravo. Bolje koristiti neku lib za ovo.
	ease: 'none',
	scrollTrigger: {
		trigger: document.body,
		start: 'top top', // top of the body tj top of the #viewport,
		end: 'bottom bottom',
		scrub: 1, // take one second for the animation tj this tween to catch up
		invalidateOnRefresh: true, // da se rifreuje kada user rifresuje ili rizajzuje window
		markers: true,
	},

	//! kako popraviti parallax skrol i smooth? Pa dati im isti scrub da se syncuje ista brzina kao, i za pin staviti pinReparent: true
});
*/
// * ======================= GSAP SMOOTHSCROLLING

// !============================= UKLONITI GSAP PROPS I EFEKTE ZA MOBILE ZA REVEALT GALLERY
/*
//define a breakpoint
const mq = window.matchMedia('(min-width: 768px)'); // kopiramo css media-query fazon

// add change listener to this breakpoint
mq.addListener(handleWidthChange);
// mq.addEventListener('change', handleWidthChange);

// first page load
handleWidthChange(mq);

// reset all props
function resetProps(elements) {
	console.log(elements);

	// 	stop all tweens
	gsap.killTweensOf('*');

	if (elements.length) {
		elements.forEach(el => {
			el && gsap.set(el, { clearProps: 'all' }); //? el && prvo se pitamo da li je el undefined, ako nije clearujemo props, tj brisemo inline style
		});
	}
}

// mediaquery change
function handleWidthChange(mq) {
	console.log(mq);

	// check if we are on the right breakpoint
	if (mq.matches) {
		// setup hover animation
		initHoverReveal();
		return;
	}
	// width is less then 768px
	console.log('we are on mobile');

	// remove even listeners from all sections
	sections.forEach(section => {
		console.log(section.imageBlock);
		section.removeEventListener('mouseenter', createHoverReveal);
		section.removeEventListener('mouseleave', createHoverReveal);

		const { imageBlock, image, mask, text, textCopy, textMask, textP } =
			section;

		console.log(image); // undefined, i svi su undefined, msm wtf

		resetProps([imageBlock, image, mask, text, textCopy, textMask, textP]);
	});
}
*/
// !============================= UKLONITI GSAP PROPS I EFEKTE ZA MOBILE ZA REVEALT GALLERY
