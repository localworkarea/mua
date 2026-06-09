import "./main.min.js";
import "./faq2.min.js";
/* empty css              */
/* empty css        */
/* empty css           */
//#region src/components/custom/enquiry-form/enquiry-form.js
function initEnquiryForm(section) {
	if (section.dataset.attEnquiryFormInit === "true") return;
	section.dataset.attEnquiryFormInit = "true";
	const form = section.querySelector(".form");
	if (!form) return;
	const reset = section.querySelector("[data-att-enquiry-form-reset]");
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const name = form.querySelector("#f-name");
		if (name && !name.value.trim()) {
			name.focus();
			return;
		}
		form.classList.add("is-sent");
	});
	if (reset) reset.addEventListener("click", () => {
		form.reset();
		form.classList.remove("is-sent");
	});
}
document.querySelectorAll("[data-att-enquiry-form]").forEach(initEnquiryForm);
//#endregion
