# Pokédex - Consumo de API com HTML, CSS e JavaScript

Aplicação simples que consome a [PokéAPI](https://pokeapi.co/) para buscar
informações de Pokémons pelo nome ou número.

## Funcionalidades

- Busca de Pokémon por nome ou ID.
- Exibição de sprite, tipos, altura, peso, experiência base, habilidades e
  estatísticas base.
- Tratamento de erros: Pokémon não encontrado (404) e falha de conexão de rede.
- Indicador de carregamento durante a requisição.
- Visual temático (paleta amarelo/azul e fundo com padrão de pokébolas).

## Arquitetura

```
.
├── index.html   # Estrutura da página (formulário de busca + card de resultado)
├── style.css    # Estilização e layout responsivo
└── script.js    # Lógica de consumo da API e manipulação do DOM
```

### Chamadas assíncronas (`script.js`)

- `handleSearch(event)`: captura o submit do formulário, valida o campo de
  busca e dispara `searchPokemon`.
- `searchPokemon(query)`: função `async` que usa `fetch` com `await` para
  chamar `https://pokeapi.co/api/v2/pokemon/{nome-ou-id}`. Erros são tratados
  em um bloco `try/catch/finally`:
  - `response.status === 404` → mensagem de "Pokémon não encontrado".
  - `!response.ok` → erro genérico de status HTTP.
  - `TypeError` (lançado pelo próprio `fetch` quando a rede falha) → mensagem
    de falha de conexão.
- `renderPokemon(data)`: recebe o JSON da API e atualiza o DOM (imagem, nome,
  tipos, altura, peso, experiência base, habilidades e estatísticas), criando
  os elementos dinamicamente.
- `showFeedback` / `setLoading`: controlam mensagens de status e o estado do
  botão de busca durante a requisição.

## Como executar

1. Clone o repositório.
2. Abra o arquivo `index.html` diretamente no navegador (não é necessário
   servidor ou build step, pois a PokéAPI permite requisições CORS do
   navegador).

## API utilizada

- **PokéAPI** — https://pokeapi.co/
- Endpoint: `GET /api/v2/pokemon/{name-or-id}`
- Não requer chave de autenticação.

## Testando erros

- Buscar um nome inexistente (ex: `abcxyz`) para ver o tratamento de "não
  encontrado".
- Desativar a conexão de internet antes de buscar para ver o tratamento de
  falha de rede.
