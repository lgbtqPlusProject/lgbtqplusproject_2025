document.addEventListener('DOMContentLoaded', function () {

    // Show Announcement after delay
    setTimeout(() => {
        const announcement = document.getElementById("announcement");
        if (announcement) {
            console.log('Announcement shown');
            announcement.classList.add("show");
        }
    }, 1000);

    // Close Announcement
    window.closeAnnouncement = function() {
        const announcement = document.getElementById("announcement");
        if (announcement) {
            console.log('Closing announcement');
            announcement.classList.remove("show");
        }
    };

    // Close Search Box
    window.closeSearchBox = function() {
        const searchResultsBox = document.getElementById('searchResultsBox');
        if (searchResultsBox) {
            console.log('Closing search box');
            searchResultsBox.style.display = 'none';
        }
    };
    
    //Close API Pop Search Results
    window.closeSearchPopup = function () {
        const searchPopup = document.getElementById('resultPopup');
        if (searchPopup) {
            searchPopup.style.display = 'none';
            console.log("Search popup closed");
        }
    };

    // Landing Scroll
    const landing = document.getElementById('landing');
    if (landing) {
        landing.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
    
    
    // Search Button Listener for Database
    const searchBtnDatabase = document.getElementById('searchBtnDatabase');

    if (searchBtnDatabase) {
        searchBtnDatabase.addEventListener('click', () => {
            const query = document.getElementById('searchBox').value.trim();
            if (query) {
                searchHistoricalFiguresEvents(query);
            } else {
                alert('Please enter a search term.');
            }
        });
    }

    // Function to search the 'historical_figures_events' table in the database
    async function searchHistoricalFiguresEvents(query) {
        if (!query) {
            alert("Please enter a search term.");
            return;
        }

        // ✅ Log the search query
        try {
            const logResponse = await fetch(`http://localhost:8000/log_search.php?query=${encodeURIComponent(query)}`);
            const logData = await logResponse.json();

            if (logData.success) {
                console.log('✅ Search query logged successfully.');
            } else {
                console.warn('⚠️ Logging returned error:', logData.error);
            }
        } catch (logError) {
            console.error('❌ Logging request failed:', logError);
        }

        // ✅ Fetch the search results
        const url = `http://localhost:8000/search.php?query=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const resultBox = document.getElementById('searchResultsContainer');
            if (!data.length) {
                resultBox.innerHTML = '<p class="text-red-600">No results found.</p>';
            } else {
                resultBox.innerHTML = data.map(event =>
                    `<div class="mb-6 p-6 border border-purple-300 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-purple-100 via-pink-200 to-teal-100">
                        <h3 class="text-3xl font-bold text-purple-800 mb-4 hover:text-purple-600 transition-all duration-300 ease-in-out">${event.name || 'No name available'}</h3>
                        <p class="text-lg text-gray-700"><strong>Years:</strong> ${event.years_relevant || 'No years available'}</p>
                        <p class="text-lg text-gray-700 mb-4"><strong>Location:</strong> ${event.location || 'No location available'}</p>
                        <p class="text-md text-gray-800 leading-relaxed">${event.description || 'No description available'}</p>
                    </div>`
                ).join('');

                // Adjust container style
                const searchBox = document.getElementById('searchResultsBox');
                searchBox.style.maxWidth = '30vw';
                searchBox.style.maxHeight = '150vh';
                searchBox.style.overflowY = 'auto';
                searchBox.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('⚠️ Unable to fetch results. Please try again.');
        }
    }
    
    
    // Event Results Popup Close
    function closeEventPopup() {
        document.getElementById('eventResultPopup').style.display = 'none';
    }
    
    //Search Button Archive
    const searchBtnArchive = document.getElementById('searchBtnArchive');
    if (searchBtnArchive) {
        searchBtnArchive.addEventListener('click', () => {
            const query = document.getElementById('searchBox').value.trim();
            if (query) {
                searchArchive(query);
            } else {
                alert('Please enter a search term.');
            }
        });
    }

    // Archive Search Function
    async function searchArchive(query) {
        if (!query) {
            alert('Please enter a search query.');
            return;
        }

        // Log search query
        if (location.hostname !== "localhost") {
            fetch(`http://localhost:8000/log_archive_search.php?query=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => console.log('Search logged:', data))
                .catch(err => console.error('Logging failed:', err));
        } else {
            console.log('Local testing mode: skipping server logging.');
        }

        const apiUrl = `https://archive.org/advancedsearch.php?q=title:${encodeURIComponent(query)}&fl[]=title&fl[]=creator&rows=50&start=0&output=json`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const items = data.response.docs;

            if (items.length === 0) {
                alert('No results found.');
                return;
            }

            const randomResults = getRandomItems(items, 5);
            const resultDiv = document.getElementById('result');
            let resultHTML = randomResults.length ? '<ul>' : '<p>No random results found.</p>';

            randomResults.forEach(item => {
                const title = item.title || 'No title available';
                const creator = Array.isArray(item.creator)
                    ? item.creator.join(', ')
                    : (typeof item.creator === 'string' ? item.creator : 'N/A');

                resultHTML += `
                    <li class="mb-4">
                        <a href="https://archive.org/search.php?query=title%3A${encodeURIComponent(title)}"
                           target="_blank"
                           class="block text-lg font-semibold text-pink-600 hover:text-teal-500 underline decoration-2 transition-all duration-200 ease-in-out">
                            ${title}
                        </a>
                        <p class="text-sm text-gray-700"><strong>Creator:</strong> ${creator}</p>
                    </li>`;
            });

            resultHTML += '</ul>';
            resultDiv.innerHTML = resultHTML;
            document.getElementById('resultPopup').style.display = 'block';
        } catch (error) {
            console.error('Error fetching data from Archive.org:', error);
            alert('⚠️ Error fetching data. Please try again later.');
        }
    }

    // Random Item Selector
    function getRandomItems(arr, num) {
        const shuffled = arr.slice(0);
        let i = arr.length, temp, randomIndex;

        while (i !== 0) {
            randomIndex = Math.floor(Math.random() * i);
            i -= 1;
            temp = shuffled[i];
            shuffled[i] = shuffled[randomIndex];
            shuffled[randomIndex] = temp;
        }

        return shuffled.slice(0, num);
    }

    // Modal functionality
    function openModal(index) {
        const story = stories[index];
        if (!story) return;

        console.log('Opening modal for story:', story);
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.remove('fade-in');
        void modalContent.offsetWidth;
        modalContent.classList.add('fade-in');

        document.getElementById('modalName').textContent = story.name;
        document.getElementById('modalLocation').textContent = "From: " + story.location;
        document.getElementById('modalStory').textContent = story.story;
        document.getElementById('storyModal').style.display = "block";
    }

    // Modal Close Button
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.onclick = function() {
            console.log('Modal close button clicked');
            document.getElementById('storyModal').style.display = "none";
        };
    }

    // Lightbox close button
    const closeBtn = document.getElementById('lightbox-close');
    const overlay = document.getElementById('lightbox-overlay');
    const lightbox = document.getElementById('lightbox');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            console.log('Lightbox close button clicked');
            if (lightbox) {
                lightbox.style.display = 'none'; // Close lightbox
            }
        });
    }

    // Close the lightbox if the overlay is clicked
    if (overlay) {
        overlay.addEventListener('click', () => {
            console.log('Overlay clicked to close lightbox');
            if (lightbox) {
                lightbox.style.display = 'none'; // Close lightbox when clicking on the overlay
            }
        });
    }
});


//Coming Out Showcase
let stories = [];
let currentIndex = 0;

function displayStory(index) {
    const story = stories[index];
    document.getElementById('story-name').textContent = story.name;
    document.getElementById('story-text').textContent = story.story;
    document.getElementById('story-location').textContent = story.location;
}

document.addEventListener("DOMContentLoaded", function () {
    fetch('fetch_stories.php')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                stories = data;
                displayStory(0);
            } else {
                document.getElementById('story-container').innerHTML = '<p>No stories found.</p>';
            }
        })
        .catch(error => console.error('Error:', error));

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (stories.length > 0) {
            currentIndex = (currentIndex - 1 + stories.length) % stories.length;
            displayStory(currentIndex);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (stories.length > 0) {
            currentIndex = (currentIndex + 1) % stories.length;
            displayStory(currentIndex);
        }
    });
});

//Coming Out Story Countdown
const countdown = () => {
    const endDate = new Date("June 1, 2025 00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = endDate - now;

    if (timeLeft < 0) {
      document.getElementById("countdown").innerHTML = "🎉 The Coming Out Stories are LIVE!";
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, '0');
    document.getElementById("hours").textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
  };

  setInterval(countdown, 1000);
  countdown(); // initial call

document.getElementById("notify-button").addEventListener("click", async () => {
  const email = prompt("Enter your email to be notified when the Coming Out Story Section goes live:");

  if (email && email.includes("@")) {
    try {
      const response = await fetch("http://localhost:8000/notify.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("✅ You’re on the list! We’ll notify you.");
        document.getElementById("notify-button").textContent = "✅ You'll Be Notified!";
        document.getElementById("notify-button").disabled = true;
        document.getElementById("notify-button").style.backgroundColor = "#4caf50";
      } else {
        alert("⚠️ " + result.message);
      }
    } catch (err) {
      alert("An error occurred while submitting your email.");
    }
  } else if (email !== null) {
    alert("Please enter a valid email address.");
  }
});
