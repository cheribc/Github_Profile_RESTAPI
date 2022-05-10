const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')


async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username)
        
        createUserCard(data)
        getRepos(username)
    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('Sorry! There is no user found with that username. Please try again.'
            )
        }
    }    
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')

        addReposToCard(data)
    } catch(err) {
        createErrorCard('Problem fetching repos')
    }
}

// Create user card for search results to display using html for entire card div class on index.html
function createUserCard(user) {
    const userID = user.name || user.login
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>

      <div id="repo"></div>
    </div>
  </div>
    `
    main.innerHTML = cardHTML
}
//  Create error card for invalid or not found users with the message to display
function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `
    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repo')

    repos
        .slice(0, 8)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            // href makes it point to link to repo
            repoEl.href = repo.html_url
            // set target to make it open in new window
            repoEl.target = '_blank'
            repoEl.innerText = repo.name
            // insert it into DOM
            reposEl.appendChild(repoEl)
        })
}

// addEventListener for getUser from form to search value
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)
        // Clear the search value after clicking/enter
        search.value = ''
    }
})