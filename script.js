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

    // Search Button Listeners
    const searchBtn = document.getElementById('searchBtn');
    const searchBtnDatabase = document.getElementById('searchBtnDatabase');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = document.getElementById('searchInput').value.trim();
            if (query) searchArchive(query);  // Ensure searchArchive is defined
        });
    }
    if (searchBtnDatabase) {
        searchBtnDatabase.addEventListener('click', () => {
            const query = document.getElementById('searchBox').value.trim();
            if (query) searchDatabase(query);  // Ensure searchDatabase is defined
        });
    }

    // Database Search Function
    async function searchDatabase(query) {
        if (!query || query.length < 2) {
            alert('Please enter a valid search query.');
            return;
        }

        const url = `https://www.lgbtqplusproject.org/search.php?query=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url, { method: 'GET' });
            const data = await response.json();
            const resultDiv = document.getElementById('result');
            
            let resultHTML = data.length ? '<ul class="list-disc pl-5 space-y-2">' : '<p>No results found.</p>';
            data.forEach(item => {
                resultHTML += `<li><strong>Name:</strong> ${item.name}<br><strong>Contribution:</strong> ${item.contribution}<br><strong>Country:</strong> ${item.country}</li>`;
            });
            resultHTML += data.length ? '</ul>' : '';
            resultDiv.innerHTML = resultHTML;

            document.getElementById('resultPopup').style.display = 'flex';
        } catch (error) {
            console.error('Error fetching data from the database:', error);
            alert('⚠️ Error fetching data from the database. Please try again later.');
        }
    }

    // Archive Search Function
    async function searchArchive(query) {
        if (!query) {
            alert('Please enter a search query.');
            return;
        }
      
    // Log search query to server
        if (location.hostname !== "localhost") {
            fetch(`https://www.lgbtqplusproject.org/log_archive_search.php?query=${encodeURIComponent(query)}`)
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

            // Select a random subset of results
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
                    </li>
                `;
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
