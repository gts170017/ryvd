function isValidDownloadLocation(location) {
  // Check if the location starts with a valid protocol (http, https, file)
  if (location.startsWith('http://') || location.startsWith('https://') || location.startsWith('file://')) {
    return true;
  }

  // Check if the location is a valid file path with backslashes or forward slashes
  return location.includes('\\') || location.includes('/');
}

document.addEventListener('DOMContentLoaded', function() {
  // Login functionality
  const loginForm = document.querySelector('#login-form');
  const loginError = document.querySelector('#login-error');
  const loginScreen = document.querySelector('#login-screen');
  const mainScreen = document.querySelector('#main-screen');

  if (loginForm && loginError && loginScreen && mainScreen) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username');
      const password = document.getElementById('password');

      if (username && password) {
        if (username.value.toLowerCase() === 'a' && password.value.toLowerCase() === 'a') {
          loginScreen.style.display = 'none';
          mainScreen.style.display = 'block';
          loadState();
        } else {
          loginError.textContent = 'Invalid username or password. Please try again.';
        }
      } else {
        console.error('Username or password input not found on the page');
      }
    });
  } else {
    console.error('Required login elements not found on the page');
  }

  // Download functionality
  const videoLinkInput = document.getElementById('video-link');
  const downloadBtn = document.querySelector('#download-btn');
  const progressBar = document.getElementById('progress-bar');
  const statusLabel = document.getElementById('status-label');

  if (videoLinkInput && downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      const videoUrl = videoLinkInput.value.trim();

      if (videoUrl) {
        // Make an AJAX request to the server-side API to initiate the download
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/download', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              // Handle the response from the server
              if (data.success) {
                // Update the UI based on the server's response (progress, status, etc.)
                if (progressBar) {
                  progressBar.style.width = '0%';
                  // Simulating progress update
                  setTimeout(function() {
                    progressBar.style.width = '50%';
                  }, 1000);
                  setTimeout(function() {
                    progressBar.style.width = '100%';
                    if (statusLabel) {
                      statusLabel.textContent = 'Download completed successfully!';
                    }
                    addThumbnail(videoUrl);
                  }, 2000);
                } else {
                  console.error('Progress bar element not found on the page');
                }
              } else {
                if (statusLabel) {
                  statusLabel.textContent = data.error;
                } else {
                  console.error('Status label element not found on the page');
                }
              }
            } else {
              console.error('Error:', xhr.status);
              if (statusLabel) {
                statusLabel.textContent = 'An error occurred. Please try again.';
              } else {
                console.error('Status label element not found on the page');
              }
            }
          }
        };
        xhr.send(JSON.stringify({ videoUrl }));
      } else {
        if (statusLabel) {
          statusLabel.textContent = 'Please enter a valid video URL.';
        } else {
          console.error('Status label element not found on the page');
        }
      }
    });
  } else {
    console.error('Video link input or download button not found on the page');
  }

  // Thumbnail functionality
  function removeThumbnail(event) {
    const thumbnailElement = event.target.closest('.thumbnail');
    if (thumbnailElement) {
      thumbnailElement.remove();
      // Remove the corresponding video info from the storage or database
      const videoUrl = thumbnailElement.dataset.videoUrl;
      // Remove the video URL from the storage or database
      // Example placeholder code:
      console.log('Removing thumbnail for video:', videoUrl);
    }
  }

  function openVideo(event) {
    const thumbnailElement = event.target.closest('.thumbnail');
    if (thumbnailElement) {
      const videoUrl = thumbnailElement.dataset.videoUrl;
      // Open the video using the appropriate method (e.g., embed video player, provide download link)
      // Example placeholder code:
      console.log('Opening video:', videoUrl);
    }
  }

  function addThumbnail(videoUrl) {
    const thumbnailGrid = document.getElementById('thumbnail-grid');
    if (thumbnailGrid) {
      const thumbnailElement = document.createElement('div');
      thumbnailElement.classList.add('thumbnail');
      thumbnailElement.dataset.videoUrl = videoUrl;
      thumbnailElement.innerHTML = `
        <img src="thumbnail.jpg" alt="Video Thumbnail">
        <div class="overlay">
          <button onclick="openVideo(event)">Play</button>
          <button onclick="removeThumbnail(event)">Remove</button>
        </div>
      `;
      thumbnailGrid.appendChild(thumbnailElement);
    } else {
      console.error('Thumbnail grid element not found on the page');
    }
  }

  // State management
  function loadState() {
    // Retrieve the saved state from the server-side storage or database
    // Update the UI based on the retrieved state
    // Example placeholder code:
    console.log('Loading application state');
  }

  // Initialize the application
  loadState();
}); 