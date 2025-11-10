console.log("JS connected successfully!");
document.addEventListener("DOMContentLoaded", function () {
  const url = "./starter/data/aboutMeData.json";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      const container = document.querySelector("#aboutMe");
      if (!container) {
        console.error("#aboutMe not found");
        return;
      }
      const aboutText =
        data.about && data.about.trim() ? data.about : "No bio provided.";
      const rawHeadshot =
        data.headshot && data.headshot.trim() ? data.headshot : "";
      let headshotSrc = rawHeadshot;
      if (!headshotSrc) {
        headshotSrc = "./starter/images/card_placeholder_bg.webp";
      } else if (headshotSrc.startsWith("../")) {
        headshotSrc = "./starter/" + headshotSrc.slice(3);
      }
      const p = document.createElement("p");
      p.textContent = aboutText;
      const img = document.createElement("img");
      img.setAttribute("src", headshotSrc);
      img.setAttribute("alt", "headshot");
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      const headshotBox = document.createElement("div");
      headshotBox.className = "headshotContainer";
      headshotBox.appendChild(img);

      const frag = document.createDocumentFragment();
      frag.appendChild(p);
      frag.appendChild(headshotBox);
      container.replaceChildren(frag);
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
});
