//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//charge le fichier XML se trouvant � l'URL relative donn� dans le param�tre et le retourne
function chargerHttpXML(xmlDocumentUrl) {
  var httpAjax;

  httpAjax = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  if (httpAjax.overrideMimeType) {
    httpAjax.overrideMimeType("text/xml");
  }

  //chargement du fichier XML � l'aide de XMLHttpRequest synchrone (le 3� param�tre est d�fini � false)
  httpAjax.open("GET", xmlDocumentUrl, false);
  httpAjax.send();

  return httpAjax.responseXML;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Charge le fichier JSON se trouvant � l'URL donn�e en param�tre et le retourne
function chargerHttpJSON(jsonDocumentUrl) {
  var httpAjax;

  httpAjax = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject("Microsoft.XMLHTTP");

  if (httpAjax.overrideMimeType) {
    httpAjax.overrideMimeType("text/xml");
  }

  // chargement du fichier JSON � l'aide de XMLHttpRequest synchrone (le 3� param�tre est d�fini � false)
  httpAjax.open("GET", jsonDocumentUrl, false);
  httpAjax.send();

  var responseData = eval("(" + httpAjax.responseText + ")");

  return responseData;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Modifie la couleur de la page en bleu et celle du bouton en blanc pour le button1
function changeColors() {
  document.body.style.backgroundColor = "blue";
  var button = document.getElementById("myButton1");
  button.style.color = "white";
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Réinitialise la couleur de la page en blanc si elle est bleue pour le button2
function resetBackgroundColor() {
  var button2 = document.getElementById("myButton2");
  var button1 = document.getElementById("myButton1");
  if (document.body.style.backgroundColor !== "white") {
    document.body.style.backgroundColor = "white";
    button1.style.color = "black";
  } else {
    var message = document.createElement("p");
    message.style.color = "red";
    message.textContent = "The background color of the page is already white";
    button2.parentNode.insertBefore(message, button2.nextSibling);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Affiche les infos sur les pays contenus dans le fichier XML countriesTP.xml pour le button3
function displayCountryInfo(xmlDocumentUrl, xslDocumentUrl) {
  var code = document.getElementById("inputField").value; //récupère le code du pays entré par l'utilisateur
  var result = document.getElementById("result");
  result.innerHTML = ""; //pour afficher qu'un à la fois

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", xmlDocumentUrl, false);
  xmlhttp.send("");
  var xml = xmlhttp.responseXML;

  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", xslDocumentUrl, false);
  xmlhttp.send("");
  var xsl = xmlhttp.responseXML;

  var xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  xsltProcessor.setParameter(null, "code", code);
  var resultDoc = xsltProcessor.transformToFragment(xml, document);

  result.appendChild(resultDoc);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Charge le fichier svg se trouvant à l'URL relative donnée dans le paramètre et l'affiche pour les buttons 4 et 6
//Prend en paramètres l'URL du fichier svg et l'id de l'élément dans lequel afficher le svg
//L'intérêt d'utiliser de tels paramètres est de pouvoir afficher plusieurs svg dans la même page
function displaySVG(xmlDocumentUrl, containerId) {
  var svg = chargerHttpXML(xmlDocumentUrl); // récupère le fichier svg sous forme de fichier XML
  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(svg); // sérialise la fichier svg en chaine de caractères
  document.getElementById(containerId).innerHTML = svgString; //remplace innerHTML de l'élément svgContainer par le contenu du fichier svg
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//rend les éléments svg cliquables et affiche le titre de l'élément cliqué pour les buttons 5 et 7
//Prend en paramètre l'id de l'élément contenant le svg, l'attribut à surveiller et le type de cet attribut
//L'intérêt d'utiliser de tels paramètres est de pouvoir rendre cliquables plusieurs svg dans la même page
function makeSvgClickable(containerId, attribute, attributeType) {
  var svgContainer = document.getElementById(containerId);
  var svgElements = svgContainer.querySelectorAll(attributeType);
  //console.log(svgElements); // Affiche les éléments SVG sélectionnés, utilisé pour débugger

  svgElements.forEach(function (element) {
    element.addEventListener("click", function () {
      //console.log(this.getAttribute(attribute)); // Affiche l'attribut de l'élément cliqué, utilisé pour débugger
      alert(this.getAttribute(attribute));
    });
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Ajoute des événements de souris pour afficher des informations sur les pays lorsqu'on passe la souris sur un pays après avoir cliqué sur le button8
function addMouseEvents(containerId, attributeType, div8) {
  var svgContainer = document.getElementById(containerId);
  var svgElements = svgContainer.querySelectorAll(attributeType);

  var xxmhttp = new XMLHttpRequest();
  xxmhttp.open("GET", "countriesTP.xml", false);
  xxmhttp.send("");
  var xml = xxmhttp.responseXML;

  // Crée un seul élément div pour afficher les informations
  var infoDiv = document.getElementById(div8);
  svgContainer.appendChild(infoDiv);

  svgElements.forEach(function (element) {
    element.addEventListener("mouseover", function () {
      // Changer la couleur de remplissage de l'élément SVG
      this.style.fill = "red";

      // Récupère l'élément SVG
      var id = this.id;

      // Cherche le pays qui a cet identifiant comme code cca2 dans countriesTP.xml
      var countries = xml.querySelectorAll("country");
      var country;
      for (var i = 0; i < countries.length; i++) {
        var cca2 = countries[i].querySelector("country_codes > cca2");
        if (cca2 && cca2.textContent === id) {
          country = countries[i];
          break;
        }
      }

      if (country) {
        // Affiche common_name, capital et language de ce pays a partir de countriesTP.xml
        var commonName = country.querySelector("common_name").textContent;
        var capital = country.querySelector("capital").textContent;
        var languages = Array.from(country.querySelectorAll("languages > *"))
          .map((el) => el.textContent)
          .join(", ");

        // Génère l'URL du drapeau
        var flagUrl =
          "http://www.geonames.org/flags/x/" + id.toLowerCase() + ".gif";

        // Mets à jour le contenu de infoDiv
        infoDiv.innerHTML =
          '<img src="' +
          flagUrl +
          '" alt="" height="40" width="60"><h2>' +
          commonName +
          "</h2><p>Capital : " +
          capital +
          "</p><p>Languages : " +
          languages +
          "</p>";
      }
    });

    element.addEventListener("mouseleave", function () {
      //Code exécuté lorsque la souris quitte un pays

      //Change la couleur de remplissage de l'élément SVG pour revenir à sa couleur d'origine
      this.style.fill = "";

      //Efface le contenu de infoDiv
      infoDiv.innerHTML = "";
    });
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Fonction pour activer l'autocomplétion en remplissant la datalist avec les codes de pays pour le button9
function activateAutocomplete() {
  // Crée un nouvel objet XMLHttpRequest
  var xhttp = new XMLHttpRequest();
  // Définit ce qui doit être fait une fois que la réponse est reçue
  xhttp.onreadystatechange = function () {
    // Vérifie si la requête a été traitée avec succès
    if (this.readyState == 4 && this.status == 200) {
      // Appelle la fonction updateCountryDatalist en passant le XML reçu
      updateCountryDatalist(this.responseXML);
    }
  };
  //Initialise la requête pour récupérer le fichier XML des pays
  xhttp.open("GET", "countriesTP.xml", true);
  // Envoie la requête
  xhttp.send();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Fonction pour remplir la datalist avec les codes de pays pour le button9
function updateCountryDatalist(xmlDoc) {
  // Obtient tous les éléments "country" du document XML
  var countries = xmlDoc.getElementsByTagName("country");
  // Trouve l'élément datalist dans le document HTML par son ID
  var datalist = document.getElementById("countriesList");
  // Efface les options précédentes de la datalist
  datalist.innerHTML = "";

  //Boucle à travers chaque élément "country" trouvé
  for (var i = 0; i < countries.length; i++) {
    // Crée un nouvel élément <option>
    var option = document.createElement("option");
    // Obtient le texte de l'élément "cca3" (code du pays) du pays actuel
    var code = countries[i].getElementsByTagName("cca3")[0].textContent;
    // Définit la valeur de l'option avec le code du pays
    option.value = code;
    // Ajoute l'option à la datalist
    datalist.appendChild(option);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Fonction pour ajouter des informations sur la devise lorsqu'on passe la souris sur un pays pour le button10
//Les données sur les devises sont récupérées à partir de l'API REST Countries qui est un fichier json

function addCurrencyInfo(containerId, attributeType) {
  // Accède au conteneur SVG via son identifiant pour pouvoir manipuler ses éléments enfants
  var svgContainer = document.getElementById(containerId);
  // Sélectionne tous les éléments dans ce conteneur qui correspondent au critère spécifié (dans le cas du button8, tous les 'path' pour les pays)
  var svgElements = svgContainer.querySelectorAll(attributeType);
  // Crée un nouvel élément <div> qui servira à afficher les informations sur la devise
  var infoDiv = document.createElement("div");
  // Ajoute ce <div> au conteneur SVG pour qu'il soit prêt à afficher les données
  svgContainer.appendChild(infoDiv);

  // Itère sur chaque élément SVG correspondant à un pays
  svgElements.forEach(function (element) {
    // Ajoute un écouteur d'événements pour réagir au passage de la souris sur l'élément
    element.addEventListener("mouseover", function () {
      // Récupère l'ID de l'élément, correspondant au code du pays, et l'adapte au format attendu par l'API
      var id = this.id;

      //Utilise la fonction chargerHttpJSON pour récupérer les données de devise à partir de l'URL formée avec le code du pays.
      var currencyData = chargerHttpJSON(
        `https://restcountries.com/v2/alpha/${id}`
      );
      //Formate les informations de devise(s) pour affichage, en combinant nom et code de chaque devise
      var currency = currencyData.currencies
        .map((c) => `${c.name} (${c.code})`)
        .join(", ");
      //Mets à jour le contenu du <div> d'informations avec les devises du pays
      infoDiv.innerHTML = `<div style='color: Goldenrod; font-weight: bold;'>
      Currency : ${currency}</div>`;
    });

    // Ajoute également un écouteur d'événements pour effacer les informations lorsque la souris quitte l'élément
    element.addEventListener("mouseleave", function () {
      this.style.fill = ""; // Réinitialise l'apparence de l'élément
      infoDiv.innerHTML = ""; // Efface le contenu du <div> d'information
    });
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Fonction pour colorier les pays parlant au moins une des langues du pays sélectionné en vert pour le button11
function colorLanguagesGreen(inputField, svgContainerId, xmlDocumentUrl) {
  // Réinitialise la couleur de tous les pays à leur couleur d'origine
  var svgContainer = document.getElementById(svgContainerId);
  var countryElements = svgContainer.querySelectorAll("[id]");
  countryElements.forEach(function (element) {
    element.style.fill = ""; // Réinitialiser la couleur à la couleur d'origine (ou toute autre couleur par défaut)
  });

  var inputElement = document.getElementById(inputField); // L'élément input entré par l'utilisateur
  var countryCodeCca3 = inputElement.value; // Le code cca3 de l'élément entré par l'utilisateur
  //console.log("Code cca3 du pays sélectionné:", countryCodeCca3); //Commande de débogage

  var xmlData = chargerHttpXML(xmlDocumentUrl);

  // Recherche des langues parlées par le pays sélectionné en utilisant cca3
  var selectedCountryLangs = []; // Stocke les langues parlées par le pays sélectionné
  var selectedCountryCca2; // Stocke le code cca2 du pays sélectionné
  var countries = xmlData.getElementsByTagName("country"); // Recherche tous les éléments "country" dans le fichier XML

  for (var i = 0; i < countries.length; i++) {
    var cca3 = countries[i].querySelector("country_codes > cca3").textContent; // Extrait le code cca3 de chaque pays
    if (cca3 === countryCodeCca3) {
      // Vérifie si le code cca3 correspond au pays sélectionné
      //console.log(`Pays sélectionné trouvé: ${cca3}`);
      selectedCountryCca2 = countries[i].querySelector(
        "country_codes > cca2"
      ).textContent; // Extrait le code cca2 du pays sélectionné
      var languages =
        countries[i].getElementsByTagName("languages")[0].children; // Extrait les langues parlées par le pays sélectionné
      for (var lang of languages) {
        selectedCountryLangs.push(lang.textContent); // Stocke chaque langue parlée par le pays
        //console.log(`Langues trouvées: ${lang.textContent}`);
      }
      break;
    }
  }

  countryElements.forEach(function (element) {
    // Parcours de tous les pays pour les comparer avec le pays sélectionné
    var countryCCA2 = element.id; // L'ID de l'élément SVG est le cca2 du pays
    //console.log(`Traitement du pays (cca2): ${countryCCA2}`); // Affiche le code cca2 du pays
    if (
      countryCCA2 === selectedCountryCca2 ||
      selectedCountryLangs.length > 0
    ) {
      // Vérifie si le pays SVG correspond au pays sélectionné
      var countryLangs = []; // Stocke les langues parlées par le pays SVG courant
      for (var i = 0; i < countries.length; i++) {
        // Itère sur chaque pays dans le fichier XML
        var cca2 = countries[i].querySelector(
          "country_codes > cca2"
        ).textContent; // Extrait le code cca2 de chaque pays
        if (cca2 === countryCCA2) {
          // Vérifie si le code cca2 correspond au pays SVG courant
          //console.log(`Langues trouvées pour ${cca2}:`); // Affiche le code cca2 du pays
          var languages =
            countries[i].getElementsByTagName("languages")[0].children; // Extrait les langues parlées par le pays
          for (var lang of languages) {
            // Itère sur chaque langue parlée par le pays
            countryLangs.push(lang.textContent); // Stocke chaque langue parlée par le pays
            //console.log(lang.textContent); // Affiche chaque langue trouvée pour le pays
          }
          break;
        }
      }

      var commonLanguages = selectedCountryLangs.some((lang) =>
        countryLangs.includes(lang)
      ); // Vérifie si le pays SVG partage des langues communes avec le pays sélectionné
      //console.log(`Langues communes trouvées avec ${countryCCA2}:`, commonLanguages); // Affiche si des langues communes ont été trouvées

      if (commonLanguages) {
        // Si des langues communes ont été trouvées, colorie le pays en vert
        //console.log(`${countryCCA2} sera coloré en vert.`); // Affiche le code cca2 du pays qui sera coloré en vert
        element.style.fill = "green";
      }
    }
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Fonctions liées au Button12 pour le "quiz"
var selectedCountryCode = ""; // Stocke le code du pays sélectionné

// Fonction pour afficher un nom de pays aléatoire et préparer l'interaction
function showRandomCountryName(div8) {
  document.getElementById(div8).innerHTML = "";
  var paths = document.querySelectorAll(".land"); // Sélectionne tous les pays présents dans worldHigh.svg qui doit avoir été préalablement chargé
  var randomIndex = Math.floor(Math.random() * paths.length); // Sélectionne un index aléatoire
  var randomCountryPath = paths[randomIndex]; // Obtient le chemin SVG du pays aléatoire
  selectedCountryCode = randomCountryPath.id; // Stocke le code du pays sélectionné pour une vérification ultérieure
  var countryName = randomCountryPath.getAttribute("countryname"); // Obtient le nom du pays
  document.getElementById("countryQuizQuestion").innerHTML =
    "<br><span style='color: darkblue; font-weight:bold;'>Find the country : </span>" +
    "<span style='color: darkblue;'>" +
    countryName +
    "</span>"; // Affiche la question
  document.getElementById("quizResult").innerHTML = ""; // Réinitialise le résultat

  //Ajout d'un événement de clic pour vérifier la réponse de l'utilisateur
  paths.forEach((path) => {
    path.addEventListener("click", checkCountryAnswer);
  });
}

//Fonction pour vérifier la réponse de l'utilisateur
function checkCountryAnswer(event) {
  var clickedCountryCode = event.target.id; // Obtient le code du pays sur lequel l'utilisateur a cliqué

  if (clickedCountryCode === selectedCountryCode) {
    document.getElementById("quizResult").innerHTML =
      "<div style='color: green; font-size: 18px; font-family: Arial, sans-serif;font-weight: bold;'>Correct!</div>";
  } else {
    document.getElementById("quizResult").innerHTML =
      "<div style='color: red; font-size: 18px; font-family: Arial, sans-serif; font-weight: bold;'>Incorrect! Try again.</div>";
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Fonctions liées au Button13
function interestingVisualization(div8, div121, div122) {
  document.getElementById(div8).innerHTML = "";
  document.getElementById(div121).innerHTML = "";
  document.getElementById(div122).innerHTML = "";

  //création de 2 boutons pour afficher les populations ou les fuseaux horaires
  document.getElementById(
    "question13"
  ).innerHTML = `<div style='color: darkred; font-weight: bold;'>
  You can choose to display the different populations or to display the countries sharing the same time zone as the country selected in the field of button 3.</div><input
      name="button131"
      id="myButton131"
      onclick="colorCountriesByPopulation('svgContainer2', 'path');;"
      value="Populations"
      type="button"
    /> <input
    name="button132"
    id="myButton132"
    onclick="colorTimeZonesPink('inputField', 'svgContainer2', 'countriesTP.xml');;"
    value="Time zones"
    type="button"
  />`;
}
// Fonction pour colorier les pays en fonction de leur population
function getColorByPopulation(population) {
  if (population < 10000000) {
    return "lightgreen";
  } else if (population < 50000000) {
    return "green";
  } else if (population < 100000000) {
    return "darkgreen";
  } else {
    return "darkblue";
  }
}

function colorCountriesByPopulation(containerId, attributeType) {
  var svgContainer = document.getElementById(containerId);
  var svgElements = svgContainer.querySelectorAll(attributeType);

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "geonames.xml", false);
  //xhttp.open("GET", "http://api.geonames.org/countryInfo?username=demo", false); ne fonctionne pas car tous les crédits ont été utilisés.

  xhttp.send("");
  var xml = xhttp.responseXML;

  // Crée un élément div pour afficher les informations
  var infoDiv = document.createElement("div");
  svgContainer.appendChild(infoDiv);

  svgElements.forEach(function (element) {
    element.addEventListener("mouseover", function () {
      var id = this.id;

      var pop = parseInt(country.querySelector("population").textContent);
      infoDiv.innerHTML = "<p>Population : " + pop + "</p>";
    });

    element.addEventListener("mouseleave", function () {
      infoDiv.innerHTML = "";
    });
    //affichage de la légende
    document.getElementById(
      "quizResult"
    ).innerHTML = `<div style='color: lightgreen; font-weight: bold;'>
    Population < 10000000</div>
    <div style='color: green; font-weight: bold;'>
    Population < 50000000</div>
    <div style='color: darkgreen; font-weight: bold;'>
    Population < 100000000</div>
    <div style='color: darkblue; font-weight: bold;'>
    Population > 50000000</div>`;

    var id = element.id;
    var countries = xml.querySelectorAll("country");
    var country;
    for (var i = 0; i < countries.length; i++) {
      var cca2 = countries[i].querySelector("countryCode").textContent; // Extrait le code cca2 de chaque pays
      if (cca2 && cca2 === id) {
        country = countries[i];
        break;
      }
    }

    if (country) {
      var pop = parseInt(country.querySelector("population").textContent); // Extrait la population du pays
      element.style.fill = getColorByPopulation(pop);
    }
  });
}
// Fonction pour colorier les pays parlant au moins une des langues du pays sélectionné dans le champ de texte du button3
function colorTimeZonesPink(inputField, svgContainerId, xmlDocumentUrl) {
  // Réinitialiser la couleur de tous les pays
  var svgContainer = document.getElementById(svgContainerId);
  var countryElements = svgContainer.querySelectorAll("[id]");
  countryElements.forEach(function (element) {
    element.style.fill = ""; // Réinitialiser la couleur à la couleur d'origine
  });

  var inputElement = document.getElementById(inputField); // L'élément input entré par l'utilisateur
  var countryCodeCca3 = inputElement.value.toUpperCase(); // Le code CCA3 entré par l'utilisateur

  var xmlData = chargerHttpXML(xmlDocumentUrl);

  // Trouver le code CCA2 correspondant au code CCA3 entré
  var selectedCountryCca2 = findCca2FromCca3(xmlData, countryCodeCca3);

  if (selectedCountryCca2) {
    // Charger toutes les zones de fuseau horaire et traiter
    var timeZoneData = chargerHttpXML(
      "http://api.timezonedb.com/v2.1/list-time-zone?key=SYT8VUYAJ665&format=xml"
    );
    processTimeZones(timeZoneData, selectedCountryCca2, svgContainerId);
  } else {
    console.log("Code pays non trouvé.");
  }
}

// Fonction pour trouver le code CCA2 à partir du code CCA3
function findCca2FromCca3(xmlData, countryCodeCca3) {
  var countries = xmlData.getElementsByTagName("country");
  for (var i = 0; i < countries.length; i++) {
    var cca3 = countries[i].getElementsByTagName("cca3")[0].textContent;
    if (cca3 === countryCodeCca3) {
      return countries[i].getElementsByTagName("cca2")[0].textContent;
    }
  }
  return null; // Si le pays n'est pas trouvé
}

// Fonction pour traiter les données de fuseau horaire et colorier les pays correspondants
function processTimeZones(timeZoneData, selectedCountryCca2, svgContainerId) {
  var zones = timeZoneData.getElementsByTagName("zone");
  var gmtOffsets = [];
  var countriesWithSameOffset = new Set();

  // Crée ou récupérer l'élément de message
  var messageElement = document.getElementById("timeZoneMessage");
  if (!messageElement) {
    messageElement = document.createElement("div");
    messageElement.id = "timeZoneMessage";
    document.getElementById(svgContainerId).appendChild(messageElement);
  }

  // Réinitialise le message
  messageElement.innerHTML = "";

  // Recueille tous les GMT Offsets pour le pays sélectionné
  for (var i = 0; i < zones.length; i++) {
    if (
      zones[i].getElementsByTagName("countryCode")[0].textContent ===
      selectedCountryCca2
    ) {
      gmtOffsets.push(
        zones[i].getElementsByTagName("gmtOffset")[0].textContent
      );
    }
  }

  // Vérifie si le pays sélectionné a plusieurs fuseaux horaires
  if (gmtOffsets.length > 1) {
    // Afficher un message pour indiquer que plusieurs fuseaux horaires ont été trouvés
    messageElement.innerHTML =
      "<div style='color: red; font-size: 18px; font-family: Arial, sans-serif; font-weight: bold;'>Country selected has several TimeZones: Arbitrary Time zone has been chosen to colour the map</div>";
    // Utilise le premier GMT Offset trouvé par mesure de simplicité
    selectedZoneGmtOffset = gmtOffsets[0];
  } else {
    selectedZoneGmtOffset = gmtOffsets.length ? gmtOffsets[0] : null;
  }

  if (!selectedZoneGmtOffset) {
    console.log("GMT Offset not found for selected country.");
    return;
  }

  // Trouve tous les pays avec le même GMT Offset et les colorier
  for (var i = 0; i < zones.length; i++) {
    if (
      zones[i].getElementsByTagName("gmtOffset")[0].textContent ===
      selectedZoneGmtOffset
    ) {
      countriesWithSameOffset.add(
        zones[i].getElementsByTagName("countryCode")[0].textContent
      );
    }
  }

  // Colorie les pays correspondants en rose
  countriesWithSameOffset.forEach(function (countryCode) {
    var countryElement = document.getElementById(countryCode);
    if (countryElement) {
      countryElement.style.fill = "pink";
    }
  });
}
