// index.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const usersList = document.getElementById('users-list');
    const reposList = document.getElementById('repos-list');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') return;

        // Clear previous search results
        usersList.innerHTML = '';
        reposList.innerHTML = '';

        // Fetch users matching the search term
        fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            data.items.forEach(user => renderUser(user));
        })
        .catch(error => console.error('Error fetching users:', error));
    });

    function renderUser(user) {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
            <div>
                <img src="${user.avatar_url}" alt="${user.login}" />
                <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
                <button class="repos-btn" data-username="${user.login}">Show Repositories</button>
            </div>
        `;
        usersList.appendChild(userItem);

        const reposBtn = userItem.querySelector('.repos-btn');
        reposBtn.addEventListener('click', () => fetchRepos(user.login));
    }

    function fetchRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(repos => {
            renderRepos(repos);
        })
        .catch(error => console.error(`Error fetching ${username}'s repos:`, error));
    }

    function renderRepos(repos) {
        reposList.innerHTML = '';
        repos.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.innerHTML = `
                <div>
                    <p><strong>${repo.name}</strong>: ${repo.description ? repo.description : 'No description'}</p>
                    <p>Language: ${repo.language ? repo.language : 'Unknown'}</p>
                    <p>Stars: ${repo.stargazers_count}</p>
                    <p>Forks: ${repo.forks_count}</p>
                </div>
            `;
            reposList.appendChild(repoItem);
        });
    }
});
