console.log('authors');
const ulAuthors = document.getElementById('authors-ul');
// const idOpt = document.getElementById('idOptions');

const getFetchAuthors = async () => {
  const res = await fetch('http://localhost:3200/authors');
  const result = await res.json();

  result.map((author) => {
    const li = document.createElement('li');
    li.innerHTML = `<li><a href="/author/${author.au_id}">Author id:${author.au_id}</a>
    <div>Authors name: ${author.name}</div>
    <div>Sex: ${author.sex}</div>
    <div>Age: ${author.age}</div>
    <div>Post Id: ${author.post_id}</div>
    </li>`;
    ulAuthors.append(li);
  });
};

getFetchAuthors();
