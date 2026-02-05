const countKey = "reviewCount";

const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");
    const rating = params.get("rating");
    const installDate = params.get("installDate");
    const features = params.getAll("features");
    const review = params.get("review");
    const username = params.get("username");

    return { product, rating, installDate, features, review, username };
};

const formatFeatures = (features) => {
    if (!features || features.length === 0) return "No features selected";
    return features.map((feature) => feature.replace(/(^|\s)\S/g, (char) => char.toUpperCase())).join(", ");
};

const updateConfirmationMessage = () => {
    const confirmationEl = document.querySelector("#confirmation-message");
    if (!confirmationEl) return;

    const { product, rating, installDate, features, review, username } = getQueryParams();
    const namePart = username ? `Thanks, ${username}!` : "Thanks!";
    const productPart = product ? ` You reviewed ${product}.` : " Your review is in.";
    const ratingPart = rating ? ` Rating: ${rating}/5.` : "";
    const datePart = installDate ? ` Installed on ${installDate}.` : "";
    const featurePart = ` Useful features: ${formatFeatures(features)}.`;
    const reviewPart = review ? ` Review notes: "${review}".` : "";

    confirmationEl.textContent = `${namePart}${productPart}${ratingPart}${datePart}${featurePart}${reviewPart}`;
};

const updateReviewCount = () => {
    const countDisplay = document.querySelector("#review-count");
    if (!countDisplay) return;

    const storedCount = Number.parseInt(localStorage.getItem(countKey), 10) || 0;
    const updatedCount = storedCount + 1;
    localStorage.setItem(countKey, String(updatedCount));
    countDisplay.textContent = updatedCount;
};

window.addEventListener("DOMContentLoaded", () => {
    updateConfirmationMessage();
    updateReviewCount();
});
