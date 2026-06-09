//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/common/functions.js
var slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore && target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore && target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
		}, duration);
	}
};
var slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.hidden = target.hidden ? false : null;
		showmore && target.style.removeProperty("height");
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideDownDone", { detail: { target } }));
		}, duration);
	}
};
var slideToggle = (target, duration = 500) => {
	if (target.hidden) return slideDown(target, duration);
	else return slideUp(target, duration);
};
function uniqArray(array) {
	return array.filter((item, index, self) => self.indexOf(item) === index);
}
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).map((item) => {
		const value = item.dataset?.[dataSetValue];
		if (!value) return null;
		return {
			value,
			item
		};
	}).filter(Boolean).map((item) => {
		const [value, type = "max"] = item.value.split(",");
		return {
			value,
			type,
			item
		};
	});
	if (media.length === 0) return [];
	const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
	return [...new Set(breakpointsArray)].map((query) => {
		const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
		const matchMedia = window.matchMedia(mediaQuery);
		return {
			itemsArray: media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType),
			matchMedia
		};
	});
}
//#endregion
//#region src/components/layout/header/header.js
function initHeader(header) {
	if (header.dataset.attHeaderInit === "true") return;
	header.dataset.attHeaderInit = "true";
	const nav = header.querySelector(".nav");
	const menu = header.querySelector(".menu");
	const actions = header.querySelector(".nav__actions");
	if (!nav || !actions) return;
	const active = header.dataset.active;
	if (active && menu) {
		const current = menu.querySelector(`a[data-nav="${active}"]`);
		if (current) current.setAttribute("aria-current", "page");
	}
	const burger = document.createElement("button");
	burger.type = "button";
	burger.className = "nav__burger";
	burger.setAttribute("aria-expanded", "false");
	burger.setAttribute("aria-controls", "mobileMenu");
	burger.setAttribute("aria-label", "Toggle menu");
	burger.innerHTML = "<span class=\"nav__burger-x\" aria-hidden=\"true\"></span><span class=\"nav__burger-label\">Menu</span>";
	actions.appendChild(burger);
	const panel = document.createElement("div");
	panel.className = "mobile-menu";
	panel.id = "mobileMenu";
	const inner = document.createElement("div");
	inner.className = "mobile-menu__inner";
	const links = document.createElement("nav");
	links.className = "mobile-menu__links";
	links.setAttribute("aria-label", "Mobile");
	if (menu) menu.querySelectorAll("a").forEach((a) => {
		const c = a.cloneNode(true);
		c.className = "m-link";
		if (a.getAttribute("aria-current")) c.setAttribute("aria-current", "page");
		links.appendChild(c);
	});
	const acts = document.createElement("div");
	acts.className = "mobile-menu__actions";
	actions.querySelectorAll("a.btn").forEach((a) => {
		const c = a.cloneNode(true);
		c.classList.add("btn--lg");
		acts.appendChild(c);
	});
	inner.appendChild(links);
	inner.appendChild(acts);
	panel.appendChild(inner);
	header.appendChild(panel);
	function setOpen(open) {
		panel.classList.toggle("is-open", open);
		burger.classList.toggle("is-open", open);
		burger.setAttribute("aria-expanded", String(open));
		burger.querySelector(".nav__burger-label").textContent = open ? "Close" : "Menu";
	}
	burger.addEventListener("click", () => setOpen(!panel.classList.contains("is-open")));
	panel.addEventListener("click", (e) => {
		if (e.target.closest("a")) setOpen(false);
	});
	window.addEventListener("resize", () => {
		if (window.innerWidth > 1080) setOpen(false);
	});
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") setOpen(false);
	});
}
document.querySelectorAll("[data-att-header]").forEach(initHeader);
//#endregion
//#region src/components/effects/watcher/watcher.js
var ScrollWatcher = class {
	constructor(props) {
		let defaultConfig = { logging: true };
		this.config = Object.assign(defaultConfig, props);
		this.observer;
		!document.documentElement.hasAttribute("data-att-watch") && this.scrollWatcherRun();
	}
	scrollWatcherUpdate() {
		this.scrollWatcherRun();
	}
	scrollWatcherRun() {
		document.documentElement.setAttribute("data-att-watch", "");
		this.scrollWatcherConstructor(document.querySelectorAll("[data-att-watcher]"));
	}
	scrollWatcherConstructor(items) {
		if (items.length) uniqArray(Array.from(items).map(function(item) {
			if (item.dataset.attWatcher === "navigator" && !item.dataset.attWatcherThreshold) {
				let valueOfThreshold;
				if (item.clientHeight > 2) {
					valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
					if (valueOfThreshold > 1) valueOfThreshold = 1;
				} else valueOfThreshold = 1;
				item.setAttribute("data-att-watcher-threshold", valueOfThreshold.toFixed(2));
			}
			return `${item.dataset.attWatcherRoot ? item.dataset.attWatcherRoot : null}|${item.dataset.attWatcherMargin ? item.dataset.attWatcherMargin : "0px"}|${item.dataset.attWatcherThreshold ? item.dataset.attWatcherThreshold : 0}`;
		})).forEach((uniqParam) => {
			let uniqParamArray = uniqParam.split("|");
			let paramsWatch = {
				root: uniqParamArray[0],
				margin: uniqParamArray[1],
				threshold: uniqParamArray[2]
			};
			let groupItems = Array.from(items).filter(function(item) {
				let watchRoot = item.dataset.attWatcherRoot ? item.dataset.attWatcherRoot : null;
				let watchMargin = item.dataset.attWatcherMargin ? item.dataset.attWatcherMargin : "0px";
				let watchThreshold = item.dataset.attWatcherThreshold ? item.dataset.attWatcherThreshold : 0;
				if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
			});
			let configWatcher = this.getScrollWatcherConfig(paramsWatch);
			this.scrollWatcherInit(groupItems, configWatcher);
		});
	}
	getScrollWatcherConfig(paramsWatch) {
		let configWatcher = {};
		if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root);
		else if (paramsWatch.root !== "null") {}
		configWatcher.rootMargin = paramsWatch.margin;
		if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) return;
		if (paramsWatch.threshold === "prx") {
			paramsWatch.threshold = [];
			for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
		} else paramsWatch.threshold = paramsWatch.threshold.split(",");
		configWatcher.threshold = paramsWatch.threshold;
		return configWatcher;
	}
	scrollWatcherCreate(configWatcher) {
		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				this.scrollWatcherCallback(entry, observer);
			});
		}, configWatcher);
	}
	scrollWatcherInit(items, configWatcher) {
		this.scrollWatcherCreate(configWatcher);
		items.forEach((item) => this.observer.observe(item));
	}
	scrollWatcherIntersecting(entry, targetElement) {
		if (entry.isIntersecting) !targetElement.classList.contains("--watcher-view") && targetElement.classList.add("--watcher-view");
		else targetElement.classList.contains("--watcher-view") && targetElement.classList.remove("--watcher-view");
	}
	scrollWatcherOff(targetElement, observer) {
		observer.unobserve(targetElement);
	}
	scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;
		this.scrollWatcherIntersecting(entry, targetElement);
		targetElement.hasAttribute("data-att-watcher-once") && entry.isIntersecting && this.scrollWatcherOff(targetElement, observer);
		document.dispatchEvent(new CustomEvent("watcherCallback", { detail: { entry } }));
	}
};
document.querySelector("[data-att-watcher]") && window.addEventListener("load", () => new ScrollWatcher({}));
//#endregion
export { slideToggle as n, slideUp as r, dataMediaQueries as t };
