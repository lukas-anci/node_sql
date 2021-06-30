console.log('hello from posts');

const ulEl = document.getElementById('ul');
const idSelectEl = document.getElementById('ids');

async function getData(url) {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
}

function generateLi(data) {
  data.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = ` <a href="/post/${item.id}">${item.title}</a> `;
    ulEl.append(li);
  });
}
function generateIdSelect(data) {
  data.forEach((item) => {
    //<option value="1">1</option>
    const op = document.createElement('option');
    op.value = item.id;
    op.innerHTML = item.title;
    idSelectEl.append(op);
  });
}

// parissiusti visus postus su fetch ar axios
getData('/post').then((data) => generateLi(data));
// atvaizduoti juos saraso pavidalu su nuorodom

// kiekviena nuoroda veda i individualu posta

// sukurti nauja lentele Authors

// lenteleje turi buti stulpeliai
// au_id INT Primary key, name VARCHAR, sex VARCHAR, age INT, post_id INT

// Sukurti app.js /addAuthor endpointa i kuri nuejus sukuriam nauja autoriu(pan kaip newPost buvo)

// sukurti atskira foma skirta autoriui kur galima sukurti nauja autoriu

// sukurti 5 autorius skirtingais duomenimis

// is fronto su fetch parsisiusti autorius ir atvaizduoti saraso pavidalu

// virs saraso yra mygtukai : all authors(rodo visus ), young authors (rodo autorius kuriu amzius < 30), female authors
// paspaudus mes is db parsiunciam atitinkamus duomenis ir juos atvaizduojam

// padaryti kad lyties pasirinkimas formoje butu selectas

// padaryti kad postId pasirinkimas formoj butu selectas tu postu kurie yra siuo metu sukurti
getData('/post-ids').then((data) => generateIdSelect(data));
