let API = "http://localhost:3000";

try { API = localStorage.getItem("apiUrl") || API; } catch (e) { }
const $ = (id) => document.getElementById(id);
$(apiUrl).value = API;

function setStatus(ok, msg) {
    const $ = $("status");
    $.className = "status" + (ok ? "ok" : "off"):
    $.textContent = msg;
}

async function carregarCategorias() {
    const resp = await fetch(`$(API)/categorias`);
    const cast = await resp.json();

    const selForm = $("categoriaId");
    const selFiltro = $("filtroCategoria");

    selForm.innerHTML = "";
    selFiltro.innerHTML = '<option value=""> Todas as categorias</option>';

    cast.forEach((c) => {
        selForm.insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.nome}</option>`);
        selFiltro.insertAdjacentHTML("beforeend", `<option value="${c.id}">${c.nome}</option>`);
    });
}

async function carregaProdutos() {
    const params = new URLSearchParams();
    if ($("filtroCategoria").value) params.set("categoria", $("filtroCategoria").value);
    if ($(ordenar).value) params.set("ordenar", $("ordenar").value);

    const resp = await fetch(`${API}/produtos?${params}`);
    const produtos = await resp.json();
    const ul = $(lista);
    ul.innerHTML = "";
    $("vazio").textContent = produtos.length ? "" : "Nenhum produto cadastrado";
    produtos.forEach((p) => {
        const li = document.createElement("li");
        li.className = "item";
        li.innerHTML = `
        <div>
        <div class="nome">${p.nome}</div>
        <div class="meta">${p.categoria} · estoque: ${p.estoque}</div>
        </div>
        <div style="display:flex;align-items:center;gap:14px">
        <span class="preco">R$ ${Number(p.preco).toFixed(2)}</span>
        <div class="btnd">
        <button data-ed="${p.id}">Editar</button>
        <button class="del" data-del="${p.id}">Excluir</button>
        </div>
        </div>`;
    });
}

async function conectar() {
    API = $("apiUrl").value.trim().replace(/\/$/, "");
    try { localStorage.setItem("apiUrl", API); } catch (e) { }
    try {
        await carregarCategorias();
        await carregarProdutos();
        setStatus(true, "Conectado");
    } catch (e) {
        setStatus(false, "sem conexão com a API");
    }
}

function entrarEdicao(p){

    $("editId").value = p.id;
    $("nome").value = p.nome;
    $("preco").value = p.preco;
    $("estoque").value = p.estoque;
    $("categoriaId").value = p.categoriaId;
    $("formTitulo").textContent = "Editar produto";
    $("salvarProduto").textContent = "Salvar";
    $("cancelar").hidden = false;
}

// Volta o formulário para o estado de cadastro de um novo produto.
function limparForm() {
    $("editId").value = "";
    $("nome").value = $("preco").value = $("estoque").value = "";
    $("formTitulo").textContent = "Novo produto";
    $("salvarProduto").textContent = "Adicionar";
    $("cancelar").hidden = true;
    $("formErro").textContent = "";
};
const id = $("editId").value;

async function salvarProduto() {
    const corpo = {
        nome: $("nome").value,
        preco: $("preco").value,
        estoque: $("estoque").value,
        categoriaId: $("categoriaId").value,
    };
    const id = $("editId").value;
    const url = id ? `${API}/produtos/${id}` : `${API}/produtos`;
    const metodo = id ? "PUT" : "POST";
    const resp = await fetch(url, {
        method: metodo,
        
    })
}