function colorCountriesByPopulation(containerId, attributeType) {
  var svgContainer = document.getElementById(containerId);
  var svgElements = svgContainer.querySelectorAll(attributeType);

  var xxmhttp = new XMLHttpRequest();
  xxmhttp.open("GET", "geonames.xml", false);
  xxmhttp.send("");
  var xml = xxmhttp.responseXML;

  // Créer un seul élément div pour afficher les informations
  var infoDiv = document.createElement("div");
  svgContainer.appendChild(infoDiv);

  svgElements.forEach(function (element) {
    element.addEventListener("mouseover", function () {
      this.style.fill = "red";

      var id = this.id;

      var countries = xml.querySelectorAll("country");
      var country;
      for (var i = 0; i < countries.length; i++) {
        var cca2 = countries[i].querySelector("countryCode");
        if (cca2 && cca2.textContent === id) {
          country = countries[i];
          break;
        }
      }

      if (country) {
        var pop = country.querySelector("population").textContent;
        // Mettre à jour le contenu de infoDiv
        infoDiv.innerHTML = "<p>Population : " + pop + "</p>";
      }
    });

    element.addEventListener("mouseleave", function () {
      // Code à exécuter lorsque la souris quitte un pays

      // Changer la couleur de remplissage de l'élément SVG pour revenir à sa couleur d'origine
      this.style.fill = "";

      // Effacer le contenu de infoDiv
      infoDiv.innerHTML = "";
    });
  });
}
