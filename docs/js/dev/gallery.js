//#region src/components/custom/gallery/gallery.js
function initGallery(section) {
	if (section.dataset.attGalleryInit === "true") return;
	const chips = section.querySelectorAll(".filters .chip");
	if (!chips.length) return;
	section.dataset.attGalleryInit = "true";
	const tiles = section.querySelectorAll(".gallery .gtile");
	chips.forEach((chip) => {
		chip.addEventListener("click", () => {
			chips.forEach((c) => c.classList.remove("is-active"));
			chip.classList.add("is-active");
			const filter = chip.dataset.filter;
			tiles.forEach((tile) => {
				const show = filter === "all" || tile.dataset.cat === filter;
				tile.classList.toggle("is-hidden", !show);
			});
		});
	});
}
document.querySelectorAll("[data-att-gallery]").forEach(initGallery);
//#endregion
