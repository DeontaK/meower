console.log('Hello Deonta');

// variables for all neccessary dom elements
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const API_URL = 'http://localhost:5000/mews';
// end of variables

// all executed cmds except adding the event listener
loadingElement.style.display = '';
listAllMews();
// end of cmds

// begin form event listener
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');

  const mew = {
    name,
    content
  };
  console.log(mew);
  form.style.display = 'none';
  loadingElement.style.display = '';

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(mew),
    headers: {
      'content-type': 'appliction/json'
    }
  }).then(response => response.json())
    .then(createdMew => {
      form.reset();
      setTimeout(() => {
        form.style.display = '';
      }, 30000);
      listAllMews();
    });
});
// end of form event listener

function listAllMews() {
  mewsElement.innerHTML = '';
  fetch(API_URL).then(response => response.json())
    .then(mewz => {
      mewz.reverse();
      mewz.forEach(mew => {
        const div = document.createElement('div');

        const header = document.createElement('h3');
        header.textContent = mew.name;

        const contents = document.createElement('p');
        contents.textContent = mew.content;

        const date = document.createElement('small');
        date.textContent = new Date(mew.created);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        mewsElement.appendChild(div);
      });
      loadingElement.style.display = 'none';
    });
}