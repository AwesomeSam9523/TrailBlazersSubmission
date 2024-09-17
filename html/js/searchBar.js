const locations = {
  "services": "file:///D:/TrailBlazer/TrailBlazer/html/services.html",
  "video": "file:///D:/TrailBlazer/TrailBlazer/html/blog.html",
  "about": "file:///D:/TrailBlazer/TrailBlazer/html/about.html",
  "contact": "file:///D:/TrailBlazer/TrailBlazer/html/contact.html",
  "blog": "file:///D:/TrailBlazer/TrailBlazer/html/blog.html",
}

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('searchBar')
  search.addEventListener('focusout', () => {
    setTimeout(() => {
      const resultsDiv = document.getElementById('searchResults');
      resultsDiv.style.display = "none";
    }, 500);
  })
})

function searchInput() {
  const value = document.getElementById('searchBar').value;
  console.log(value);
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = '';
  const filteredSuggestions = Object.keys(locations).filter(item => item.toLowerCase().startsWith(value));
  console.log(filteredSuggestions);
  if (filteredSuggestions.length > 0) {
    resultsDiv.style.display = "block";
    filteredSuggestions.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item;
      div.onclick = function() {
        console.log(locations[item]);
        document.location.href = locations[item];
        resultsDiv.style.display = "none";
      };
      resultsDiv.appendChild(div);
    });
  } else {
    resultsDiv.style.display = "none";
  }
}
