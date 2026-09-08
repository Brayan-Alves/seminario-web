# Países do Mundo - Consumo de API com HTML, CSS e JavaScript

Aplicação simples que consome a [REST Countries API](https://restcountries.com/)
para buscar informações de países pelo nome.

## Funcionalidades

- Busca de países por nome (aceita nomes parciais, ex: "united" retorna vários
  resultados).
- Exibição de bandeira, nome oficial, capital, região, sub-região, população e
  idiomas.
- Tratamento de erros: país não encontrado (404) e falha de conexão de rede.
- Indicador de carregamento durante a requisição.

## Arquitetura

```
.
├── index.html   # Estrutura da página (formulário de busca + área de resultados)
├── style.css    # Estilização e layout responsivo
└── script.js    # Lógica de consumo da API e manipulação do DOM
```

### Chamadas assíncronas (`script.js`)

- `handleSearch(event)`: captura o submit do formulário, valida o campo de
  busca e dispara `searchCountries`.
- `searchCountries(query)`: função `async` que usa `fetch` com `await` para
  chamar `https://restcountries.com/v3.1/name/{nome}`. Erros são tratados em
  um bloco `try/catch/finally`:
  - `response.status === 404` → mensagem de "nenhum país encontrado".
  - `!response.ok` → erro genérico de status HTTP.
  - `TypeError` (lançado pelo próprio `fetch` quando a rede falha) → mensagem
    de falha de conexão.
- `renderCountries(countries)`: recebe o array de países retornado pela API e
  cria um card no DOM para cada resultado (a busca por nome pode retornar
  mais de um país).
- `showFeedback` / `setLoading`: controlam mensagens de status e o estado do
  botão de busca durante a requisição.

## Como executar

1. Clone o repositório.
2. Abra o arquivo `index.html` diretamente no navegador (não é necessário
   servidor ou build step, pois a REST Countries API permite requisições CORS
   do navegador e não exige chave de autenticação).

## API utilizada

- **REST Countries API** — https://restcountries.com/
- Endpoint: `GET /v3.1/name/{name}`
- Não requer chave de autenticação.

## Testando erros

- Buscar um nome inexistente (ex: `xyzland`) para ver o tratamento de "não
  encontrado".
- Desativar a conexão de internet antes de buscar para ver o tratamento de
  falha de rede.
