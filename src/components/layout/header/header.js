import './header.scss'

// Header behaviour, initialised independently for each header root:
//  1. marks the active nav link from the header's data-active value
//  2. builds the mobile dropdown menu (burger + panel) from the nav
// Idempotent — safe to run again after HMR without duplicating nodes
// or event listeners.

function initHeader(header) {
	if (header.dataset.attHeaderInit === 'true') return
	header.dataset.attHeaderInit = 'true'

	const nav = header.querySelector('.nav')
	const menu = header.querySelector('.menu')
	const actions = header.querySelector('.nav__actions')
	if (!nav || !actions) return

	// 1. Active nav link
	const active = header.dataset.active
	if (active && menu) {
		const current = menu.querySelector(`a[data-nav="${active}"]`)
		if (current) current.setAttribute('aria-current', 'page')
	}

	// 2. Mobile menu
	const burger = document.createElement('button')
	burger.type = 'button'
	burger.className = 'nav__burger'
	burger.setAttribute('aria-expanded', 'false')
	burger.setAttribute('aria-controls', 'mobileMenu')
	burger.setAttribute('aria-label', 'Toggle menu')
	burger.innerHTML =
		'<span class="nav__burger-x" aria-hidden="true"></span>' +
		'<span class="nav__burger-label">Menu</span>'
	actions.appendChild(burger)

	const panel = document.createElement('div')
	panel.className = 'mobile-menu'
	panel.id = 'mobileMenu'
	const inner = document.createElement('div')
	inner.className = 'mobile-menu__inner'

	const links = document.createElement('nav')
	links.className = 'mobile-menu__links'
	links.setAttribute('aria-label', 'Mobile')
	if (menu) {
		menu.querySelectorAll('a').forEach((a) => {
			const c = a.cloneNode(true)
			c.className = 'm-link'
			if (a.getAttribute('aria-current')) c.setAttribute('aria-current', 'page')
			links.appendChild(c)
		})
	}

	const acts = document.createElement('div')
	acts.className = 'mobile-menu__actions'
	actions.querySelectorAll('a.btn').forEach((a) => {
		const c = a.cloneNode(true)
		c.classList.add('btn--lg')
		acts.appendChild(c)
	})

	inner.appendChild(links)
	inner.appendChild(acts)
	panel.appendChild(inner)
	header.appendChild(panel)

	function setOpen(open) {
		panel.classList.toggle('is-open', open)
		burger.classList.toggle('is-open', open)
		burger.setAttribute('aria-expanded', String(open))
		burger.querySelector('.nav__burger-label').textContent = open ? 'Close' : 'Menu'
	}

	burger.addEventListener('click', () => setOpen(!panel.classList.contains('is-open')))
	panel.addEventListener('click', (e) => {
		if (e.target.closest('a')) setOpen(false)
	})
	window.addEventListener('resize', () => {
		if (window.innerWidth > 1080) setOpen(false)
	})
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') setOpen(false)
	})
}

document.querySelectorAll('[data-att-header]').forEach(initHeader)
