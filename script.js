

var map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 13,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const cardsPerPage = 10; 
const landingPage = document.getElementById('main-page'); 
const detailPage = document.getElementById('card-details'); 
const dataContainer = document.getElementById('card-container'); 
const pagination = document.getElementById('pagination'); 
const prevButton = document.getElementById('prev'); 
const nextButton = document.getElementById('next'); 
const pageNumbers = document.getElementById('page-numbers'); 
const pageLinks = document.querySelectorAll('.page-link'); 

let currentPage = 1; 
let totalPagesLimitReached =false;
// console.log("out",totalPagesLimitReached);

function fetchData(page) {
    fetch(`https://65841ac24d1ee97c6bcefd4e.mockapi.io/hotellistings?page=${page}&limit=${cardsPerPage}`)
        .then(data => data.json())
        .then(data => {
				if(data.length==0){
				stopNext();
			}else{
				 displayDataInCards(data);
            updatePagination();
			}
        });
}


function displayDataInCards(data) {
    dataContainer.innerHTML = ''; 
    data.forEach(item => {
      
        const card = createCard(item);
        dataContainer.appendChild(card);
    });
}


function createCard(item) {
	console.log(item);
var cardDiv = document.createElement("div");
cardDiv.className = "card";
cardDiv.onclick = function() {
	markOnMap(item);
};

var imgElement = document.createElement("img");
imgElement.src = item.imageURL;
imgElement.style.maxWidth = "100%";
imgElement.style.height = "auto";
imgElement.style.borderRadius = "10px";


var h3Element = document.createElement("h3");
h3Element.textContent = item.name;
h3Element.style.marginTop = "10px";
h3Element.style.fontSize = "12px";
h3Element.style.textTransform = "capitalize";


var pElement = document.createElement("p");
pElement.textContent = item.description;
pElement.style.fontSize = "10px";

var button = document.createElement("button");
// Set button text
button.innerText = "See more";

// Apply styles to the button
button.style.padding = "10px 20px";
button.style.fontSize = "16px";
button.style.backgroundColor = "#f9f9f9";
button.style.color = "#000000";
button.style.border = "1px solid #000000";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";
button.style.transition = "background-color 0.3s ease";
button.onclick = function(){
openCard(item);
}
cardDiv.appendChild(imgElement);
cardDiv.appendChild(h3Element);
cardDiv.appendChild(pElement);
cardDiv.appendChild(button);
	return cardDiv;
}

function openCard(item){
	console.log("card number : " , item.id);
	window.location.hash = item.name;
	// window.location.href = 'details.html?name=' + item.name;
	landingPage.style.display = 'none';
	detailPage.style.display = 'block';
	document.getElementById('leftHeading').innerHTML = item.name;
	document.getElementById('leftDescription').innerHTML = item.description;
	document.getElementById('leftImage').src = item.imageURL;

	document.getElementById('rightHeading').innerHTML = item.listedBy;
	document.getElementById('rightTitle').innerHTML = item.price;
	
}
function closeCardDetails() {
	window.location.hash = '';
	landingPage.style.display = 'block';
	detailPage.style.display = 'none';
}

let markers = [];

function markOnMap(item){

	let lon = item.longitude;
	let lat = item.latitude;
	removeMarkers();
	
	var marker = L.marker([lat, lon]).addTo(map);
	marker.bindPopup(item.name).openPopup();  
	map.setView([lat, lon], 15);
	markers.push(marker);
	// map.removeLayer(marker);

}

function removeMarkers() {
    
    markers.forEach(marker => {
        map.removeLayer(marker);
    });

    markers = [];
}

fetchData(currentPage);

function stopNext(){
	nextButton.style.display="none";
}

prevButton.addEventListener('click', () => { 

    if (currentPage > 1) { 
        currentPage--; 
        fetchData(currentPage);
    } 

	if (nextButton.style.display === "none") {
		nextButton.style.display = "block"; 
	  }
	  
});


nextButton.addEventListener('click', () => { 
	currentPage++; 
	fetchData(currentPage);
     
});


pageLinks.forEach((link) => { 
    link.addEventListener('click', (e) => { 
        e.preventDefault(); 
        const page = parseInt(link.getAttribute('data-page')); 
        if (page !== currentPage) { 
            currentPage = page; 
            fetchData(currentPage);
        } 
    }); 
});

function updatePagination() { 
  
    prevButton.disabled = currentPage === 1; 
 
    pageLinks.forEach((link) => { 
        const page = parseInt(link.getAttribute('data-page')); 
        link.classList.toggle('active', page === currentPage); 
    }); 
}
