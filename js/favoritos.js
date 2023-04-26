import {UsuarioGithub} from './usuariogithub.js'

// 'constructor' recebe de 'super' de 'FavoritosView' o argumento '#app'
// 'this' referencia o argumento '#app' e por DOM busca '#app' no HTML
// Pode ser considerado o 'back-end' da aplicação
export class Favoritos {
    constructor(raiz) {
        this.raiz = document.querySelector(raiz)

        console.log(this.raiz)

        // executa a função para carregar usuário para a lista de favoritos
        this.carregarUsuario()

        // classe 'UsuarioGithub' utiliza o método 'static'
        // portanto não precisa da palavra 'new'
        // utilizando de assincronismo e promisses, busco pelo usuário do Github chamado
        // diego3g e me retorna a promisse com os dados formatados em JSON
        UsuarioGithub.pesquisa('diego3g').then(usuario => console.log(usuario))
    }

    // 'carregarUsuario' será a função que receberá os dados do usuário
    carregarUsuario(){
        // com 'JSON.parse' transformamos strings em objeto
        // 'localStorage' utilizamos para armazenar dados do site no navegador
        // assim, cada alteração que fizermos na nossa tabela, será gravada no navegador
        // 'JSON.parse' só pode ser utilizado, caso deseja transformar string em objeto,
        // 'JSON.stringify' deve ser utilizado, caso deseja transformar qualquer outro tipo
        // de dado em objeto
        // Se o 'localStorage' não tiver dados do '@github-favoritos', crie um array
        this.entradas = JSON.parse(localStorage.getItem('@github-favoritos:')) || []

        // this.entradas = [{
        //     login: 'victorcavassana',
        //     name: 'Victor Cavassana',
        //     public_repos: '100',
        //     followers: '852'
        // },
        // {
        //     login: 'marcuscaiado',
        //     name: 'Marcus Caiado',
        //     public_repos: '100',
        //     followers: '852'
        // }]

        // exibe cada usuário do array de objetos 'entradas'
        // this.entradas.forEach(usuario => {console.log(usuario)})
    }

    // 'salvar' será a função que guardará no 'localStorage' do navegador
    // os dados adicionados, atualizados e/ou removidos da aplicação
    // como os dados estão dentro de um array e dentro dele há objetos
    // utilizamos o método 'stringify' do JSON para transformar qualquer
    // outro tipo de dado em string e dentro desse métodos colocamos
    // o dado que queremos converter
    salvar(){
        localStorage.setItem('@github-favoritos:', JSON.stringify(this.entradas))
    }

    // 'adicionar' será a função que recebe de 'adicionarUsuario'
    // o valor de 'value' como um argumento, para adicioná-lo na tabela
    // 'async' e 'await' DEVEM SER USADOS JUNTOS!
    // é a mesma ideia de 'fetch e .then', mas de outra forma de escrever
    // ou seja, essa função é ASSINCRONA
    async adicionar(username){
        try{
            // variável para armazenar o boolean da função anônima
            // dentro do array de objetos, utilizamos o método 'find'
            // se o que for digitado como 'username' for estritamente igual ao
            // login de algum objeto que já está no array, então o usuário já está inserido
            const userExiste = this.entradas.find(entrada => entrada.login === username)
            console.log(userExiste)

            if(userExiste){
                throw new Error('Usuário já cadastrado!')
            }

            const user = await UsuarioGithub.pesquisa(username)
            console.log(user)

            if(user.login === undefined){
                throw new Error('Usuário não encontrado!')
            }

            // em caso de username encontrado, é criado um novo array de objetos
            // nesse novo array, colocamos os dados do 'user' encontrado e depois
            // o restante (...) dos objetos que já estavam no array
            this.entradas = [user, ...this.entradas]
            this.atualiza()
            this.salvar()

        } catch(error){
            alert(error.message)
        }
        // console.log(username)
    }

    // 'deletarUsuario' será a função para remover um usuário
    // do array de objetos 'entradas'
    deletarUsuario(usuario){
        // 'filter' -> busca pelo array, todos os dados
        // EXCETO dado que está contido no filter
        // o que retornar 'True' de 'filter' É MANTIDO
        // o que retornar 'False' de 'filter' É REMOVIDO
        const entradaFiltrada = this.entradas.filter(entrada => entrada.login !== usuario.login)
        this.entradas = entradaFiltrada
        this.atualiza()
        this.salvar()

        // exibe os dados do array
        // const entradaFiltrada = this.entradas.filter((entrada) => {console.log(entrada)})
    }
}

// 'FavoritesView' é uma nova classe que COPIA (extends) a classe 'Favoritos'
// 'constructor' recebe o '#app' e passa ao 'super' o mesmo '#app'
// já que está COPIANDO (extends) de 'Favoritos', o 'constructor' de ambos são iguais
// ambos recebem '#app'
// Pode ser considerado o 'front-end' da aplicação
export class FavoritosView extends Favoritos {
    constructor(raiz){
        super(raiz)

        console.log(this.raiz)

        // 'tableBody' é uma variável que localiza dentro do '#app'
        // a tag 'tbody'
        this.tableBody = this.raiz.querySelector('tbody')

        this.atualiza()
        this.adicionarUsuario()
    }

    adicionarUsuario(){
        const botaoAdd = this.raiz.querySelector('.pesquisa button')
        // como só teremos 1 ação pro 'botaoAdd', usamos 'onclick'
        botaoAdd.onclick = () => {
            // com a DESTRUTURAÇÃO (com {}), podemos utilizar o método
            // '.value' para receber o valor que é digitado no input, pelo DOM
            const {value} = this.raiz.querySelector('.pesquisa input')

            // exibe o valor armazenado na variável
            // console.log(value)

            // chama a função 'adicionar', passando como argumento o usuário
            // que queremos adicionar na tabela
            this.adicionar(value)

            // sem a DESTRUTURAÇÃO (sem {}), podemos utilizar o 'console.dir'
            // pois assim mostra o valor da variável como objeto, assim podemos
            // saber quais métodos utilizar na variável
            // console.dir(value)
        }
    }

    // 'atualiza' será uma função que sempre será chamada, caso haja modificação na table
    atualiza(){
        this.removeTodasTableLinhas()

        // para cada novo objeto dentro do array de objetos 'entradas'
        // será criada um 'tr' com os dados do objeto do array de objetos 'entradas'
        this.entradas.forEach(usuario => {
            const linhas = this.criaLinha()
            console.log(linhas)

            // quando for criada a linha com o objeto do array 'entradas', irá modificar a imagem
            // buscando no 'linha.innerHTML' a classe 'usuario', tag img e mudará o conteúdo de forma dinâmica
            // utilizando o parametro 'usuario' com a propriedade 'login' de 'entradas'
            linhas.querySelector('.usuario img').src = `https://github.com/${usuario.login}.png`
            linhas.querySelector('.usuario img').alt = `Imagem de ${usuario.login}`
            linhas.querySelector('.usuario a').href = `https://github.com/${usuario.login}`
            linhas.querySelector('.usuario p').textContent = usuario.name
            linhas.querySelector('.usuario span').textContent = usuario.login
            linhas.querySelector('.repositorios').textContent = usuario.public_repos
            linhas.querySelector('.seguidores').textContent = usuario.followers

            // funcionalidade do botão de excluir
            // 'onclick' é utilizado já que o botão terá APENAS 1 função, que é remover a linha
            // caso tenha mais de 1 função, devemos utilizar 'addEventListener'
            linhas.querySelector('.remover').onclick = () => {
                const confirmaOpcao = confirm('Tem certeza que deseja deletar essa linha?')
                if(confirmaOpcao){
                    this.deletarUsuario(usuario)
                }
            }

            // 'append' faz com que popule a 'tableBody' com os dados obtidos
            // pelo 'criaLinha', já que qualquer DOM aceita 'append' para adicionar elementos
            this.tableBody.append(linhas)
        })
    }

    criaLinha(){
        // 'tr' (linha da tabela) será criada via DOM
        const linha = document.createElement('tr')

        // conteúdo será passado como HTML
        // por isso utilizamos o método 'innerHTML'
        linha.innerHTML = `
                    <td class="usuario">
                        <img src="https://github.com/victorcavassana.png" alt="Imagem de victorcavassana">
                        <a href="https://github.com/victorcavassana">
                            <p>Victor Cavassana</p>
                            <span>victorcavassana</span>
                        </a>
                    </td>
                    <td class="repositorios">
                        100
                    </td>
                    <td class="seguidores">
                        852
                    </td>
                    <td>
                        <button class="remover">&timesbar;</button>
                    </td>
        `

        return linha
    }

    removeTodasTableLinhas(){
        // 'tableBody' é uma variável que localiza dentro do '#app'
        // a tag 'tbody'
        // const tableBody = this.raiz.querySelector('tbody')

        // exibe um array com a quantidade de 'tr' (linhas) que temos na variável 'tableBody'
        // console.log(tableBody.querySelectorAll('tr'))

        // 'forEach' é utilizado para buscar em cada 'tr' (linha) do 'tableBody'
        // usamos uma função anônima que irá pegar 'tableLinha' (cada linha) e removê-la
        // podemos utilizar esses métodos, já que pelo 'querySelectorAll' está tratando
        // cada 'tr' como um array
        // tableBody.querySelectorAll('tr').forEach((tableLinha) => {tableLinha.remove()})

        // 'forEach' é utilizado para buscar em cada 'tr' (linha) do 'tableBody'
        // usamos uma função anônima que irá pegar 'tableLinha' (cada linha) e removê-la
        // podemos utilizar esses métodos, já que pelo 'querySelectorAll' está tratando
        // cada 'tr' como um array
        this.tableBody.querySelectorAll('tr').forEach((tableLinha) => {tableLinha.remove()})
    }
}