let tarefas = []

const syncStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

const adicionarItem = (a) => {
    a.preventDefault()
    const input = document.getElementById('addTarefa')
    const texto = input.value
    if(texto.trim() !== ""){
        tarefas.push({ texto, concluido: false })
    }
    syncStorage()
    atualizaLista()
    input.value = ""
}

const atualizaLista = (temFiltro = false, filtro) => {
    let tarefasFiltradas = []
    if(!temFiltro){
        tarefasFiltradas = tarefas
    } else{
        tarefasFiltradas = tarefas.filter(t => t.concluido === filtro)
    }

    if(tarefasFiltradas.length === 0){
        const divMensagem = document.createElement('div')
        divMensagem.setAttribute('id', 'msgVazia')
        divMensagem.innerHTML = 'Sem tarefas no momento.'
        document.body.appendChild(divMensagem)
        syncStorage()
    } else{
        const divMensagem = document.getElementById('msgVazia')
        if(divMensagem){
            divMensagem.remove()
            syncStorage()
        }
    }

    const ul = document.getElementById('lista')
    ul.innerHTML = ""

    let numeracao = 1

    tarefasFiltradas.forEach((item, index) => {
        const li = document.createElement('li')
        const span = document.createElement("span")
        const num = document.createElement("span")

        span.innerHTML = item.texto

        span.setAttribute('class', 'tarefa')
        li.setAttribute('class', 'liTarefa')
        num.setAttribute('class', 'num')

        num.innerHTML = '<b>' + numeracao++ + '.</b>'

        li.appendChild(num)

        if(item.concluido){
            span.style.textDecoration = "line-through"
            span.style.background = "#98FB98"

            span.style.transition = "background-color 0.3s ease"
            span.addEventListener('mouseenter', function(){
                this.style.background = "#64a564"
                this.style.textDecoration = 'none'
            })

            span.addEventListener('mouseleave', function(){
                this.style.background = "#98FB98"
                this.style.textDecoration = 'line-through'
            })
        }

        li.appendChild(span)

        const btn = document.createElement("button")
        btn.setAttribute('class', 'remover')
        btn.innerHTML = '<i class="aumentarIcon fa-solid fa-trash-can"></i>'
        btn.title = 'Excluir'

        btn.addEventListener('click', () => removerItem(index))

        const btn2 = document.createElement("button")
        btn2.setAttribute('class', 'alterar')
        btn2.innerHTML = '<i class="aumentarIcon fa-solid fa-pen-to-square"></i>'
        btn2.title = 'Editar'

        if(item.concluido){
            btn2.disabled = true
            btn2.setAttribute('class', 'disabled')
            btn2.title = ""
            syncStorage()
        } else{
            btn2.addEventListener('click', () => {
                const isEditable = span.getAttribute('contenteditable')

                if(isEditable){
                    span.removeAttribute('contenteditable')
                    span.style.border = 'solid 2px #555'
                    btn2.title = 'Editar'
                    btn2.innerHTML = '<i class="aumentarIcon fa-solid fa-pen-to-square"></i>'

                    if(span.innerHTML.trim() !== tarefas[index].texto){
                        tarefas[index].texto = span.innerHTML.trim()
                        tarefas[index].editada = true
                        syncStorage()
                        atualizaLista()
                    }
                } else{
                    span.setAttribute('contenteditable', true)
                    span.style.border = '2px solid rgb(66, 160, 248)'
                    btn2.innerHTML = '<i class="aumentarIcon fa-solid fa-floppy-disk"></i>'
                    btn2.title = 'Salvar'
                }
            })
        }

        const btn3 = document.createElement("button")
        btn3.setAttribute('class', 'concluida')
        btn3.innerHTML = item.concluido ? '<i class="fa-solid fa-ban"></i>' : '<i class="fa-regular fa-circle-check"></i>'
        btn3.title = item.concluido ? 'Desfazer conclusão' : 'Concluir'

        btn3.addEventListener('click', () => {
            item.concluido = !item.concluido
            syncStorage()
            atualizaLista()
        })

        li.appendChild(btn2)
        li.appendChild(btn3)
        li.appendChild(btn)
        ul.appendChild(li)
    })
}

function pesquisar(){
    let input = document.getElementById('pesquisa').value.toLowerCase()
    let tarefas = document.getElementsByClassName('liTarefa')

    for(let i = 0; i < tarefas.length; i++){
        let textoTarefa = tarefas[i].getElementsByClassName('tarefa')[0].innerText.toLowerCase()
        if(!textoTarefa.includes(input)){
            tarefas[i].style.display = "none"
        } else{
            tarefas[i].style.display = ""
        }
    }
}

const removerItem = (index) => {
    const confirmacao = confirm("Você tem certeza de que deseja excluir esta tarefa? \nClique em 'OK' para confirmar ou 'Cancelar' para desistir.")

    if(confirmacao){
        tarefas = tarefas.filter((_, idx) => idx !== index)
        atualizaLista()
        syncStorage()
    }
}

const filtrarTarefas = (conc) => {
    atualizaLista(conc.value !== "-1", conc.value === "concluidos")
}

function atualizarTitulo(){
    var titulo = document.getElementById('titulo')
    if (window.innerWidth <= 480) {
        titulo.innerHTML = 'Lista'
    } else {
        titulo.innerHTML = 'Lista de Tarefas'
    }
}
window.addEventListener('resize', atualizarTitulo)
atualizarTitulo()

const form = document.getElementById('form')
form.addEventListener('submit', adicionarItem)

onload = () => {
    tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
    atualizaLista()
}