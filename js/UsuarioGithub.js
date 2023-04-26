export class UsuarioGithub{
    static pesquisa(usuario){
        const endpoint = `https://api.github.com/users/${usuario}`

        // faz um 'fetch' no link da variável 'endpoint', então retorna os dados
        // em formato .json e desses dados busca as seguintes informações para
        // criar o objeto do array de objetos 'entradas'
        return fetch(endpoint).then(dados => dados.json()).then(dados => ({
            login: dados.login,
            name: dados.name,
            public_repos: dados.public_repos,
            followers: dados.followers
        }))
    }
}