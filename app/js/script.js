// Questão 10
function retornaApenasNumerosPares(array) {
  const numerosPares = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] % 2 === 0) {
      numerosPares.push(array[i]);
    }
  }
  return numerosPares;
}

const resultado = retornaApenasNumerosPares([1, 2, 3, 4, 5, 6]);

const form = document.querySelector('.form');
const inputNome = document.getElementById('nome');
const inputIdade = document.getElementById('idade');
const btnSalvar = document.getElementById('btn-save');
const tableBody = document.getElementById('table-body');
const btnDeletar = document.querySelectorAll('.btn-delete');
const listaUsuario = [];

//Renderiza os elementos da tabela
function criaRegisto(data, sort = false) {
  let unsortedData = data;

  if (!sort) {
    unsortedData = data.sort(
      (userAnterior, userSeguinte) => userSeguinte.idade - userAnterior.idade
    );
  }
  tableBody.innerHTML = unsortedData
    .map((usuario) => {
      const { id, nome, idade } = usuario;

      return `<tr>
      <td>
      <span class="span-nome-${id}">${nome}</span>
      <input id="nome-${id}" value="${nome}" hidden />
      </td>
      <td>
      <span class="span-idade-${id}">${idade}</span>
      <input id="idade-${id}" value="${idade}" type="number" hidden />
      </td>
      <td>
      <button class="btn-delete" data-id="${id}">Deletar</button>
      <button class="btn-edit" data-id="${id}">Editar</button>
      <button class="btn-save-${id}"  style="display:none;">Salvar</button>
      <button class="btn-cancel-${id}"  style="display:none;">Cancelar</button>
      </td>
    </tr>`;
    })
    .join('');
}

//Cria um id único para cada registo
function criaIdUnico(valor) {
  return valor.replace(/\s+/g, '').replace('.', '').toLowerCase();
}

//Salva o registo
btnSalvar.addEventListener('click', (e) => {
  e.preventDefault();

  const user = {
    nome: inputNome.value,
    idade: inputIdade.value,
    id: criaIdUnico(inputNome.value),
  };

  //Não permite campos vazios
  if (user.nome === '' || user.idade === '') {
    return;
  }

  //Verifica se o usuário já existe na lista
  if (listaUsuario.find((usuario) => usuario.nome === user.nome)) {
    alert('O nome já está cadastrado');
    return;
  }

  //Adiciona o usuário na lista
  listaUsuario.push(user);

  //Cria a tabela de registo com os dados
  criaRegisto(listaUsuario);
  form.reset();
});

tableBody.addEventListener('click', (e) => {
  //Apaga o registo da tabela
  if (e.target.className === 'btn-delete') {
    const result = window.confirm(' Deseja apagar esta linha?');

    if (result) {
      const index = listaUsuario.findIndex(
        (user) => user.id === e.target.dataset.id
      );

      listaUsuario.splice(index, 1);

      criaRegisto(listaUsuario);
    } else {
      return;
    }
  }

  //Edita registo da tabela
  if (e.target.className === 'btn-edit') {
    const userId = e.target.dataset.id;

    const spanNome = document.querySelector(`.span-nome-${userId}`);
    const spanIdade = document.querySelector(`.span-idade-${userId}`);
    spanNome.style.display = 'none';
    spanIdade.style.display = 'none';
    e.target.style.display = 'none';

    const inputNome = document.getElementById(`nome-${userId}`);
    const inputIdade = document.getElementById(`idade-${userId}`);
    inputNome.removeAttribute('hidden');
    inputIdade.removeAttribute('hidden');

    const btnEditSave = document.querySelector(`.btn-save-${userId}`);
    const btnCancel = document.querySelector(`.btn-cancel-${userId}`);

    btnCancel.style.display = 'inline';
    btnEditSave.style.display = 'inline';

    btnEditSave.addEventListener('click', () => {
      const index = listaUsuario.findIndex((usuario) => usuario.id === userId);

      const updatedUser = {
        id: criaIdUnico(inputNome.value),
        nome: inputNome.value,
        idade: inputIdade.value,
      };

      // Atualiza o registo no array
      listaUsuario.splice(index, 1, updatedUser);

      criaRegisto(listaUsuario);
    });

    btnCancel.addEventListener('click', () => {
      inputNome.setAttribute('hidden', '');
      inputIdade.setAttribute('hidden', '');
      btnCancel.style.display = 'none';
      btnEditSave.style.display = 'none';
      spanNome.style.display = 'inline';
      spanIdade.style.display = 'inline';
      e.target.style.display = 'inline';
    });
  }
});

let isOrdered = true;

document.querySelector('.table-header--idade').addEventListener('click', () => {
  isOrdered = !isOrdered;

  document
    .querySelector('.header-indicator')
    .classList.toggle('header-indicator--click');

  if (isOrdered) {
    //Decrescente
    const listaDecrescente = listaUsuario.sort(
      (userAnterior, userSeguinte) => userSeguinte.idade - userAnterior.idade
    );
    criaRegisto(listaDecrescente, true);
  }

  if (!isOrdered) {
    //Crestente
    const listaCrescente = listaUsuario.sort(
      (userAnterior, userSeguinte) => userAnterior.idade - userSeguinte.idade
    );
    criaRegisto(listaCrescente, true);
  }
});
