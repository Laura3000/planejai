# Planej.ai

Aplicacao web para ajudar o usuario a organizar informacoes financeiras e
avaliar uma meta. Ao final do formulario, o projeto calcula a economia mensal
disponivel e apresenta um diagnostico personalizado com a API Gemini.

## Como executar

Pre-requisitos: Node.js e pnpm instalados.

```bash
pnpm install
pnpm dev
```

Depois, abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

Para validar o projeto:

```bash
pnpm lint
pnpm build
```

Para usar a Gemini, crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_GEMINI_API_KEY=sua-chave-aqui
```

## Tecnologias usadas

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- API Gemini
- LocalStorage do navegador
- ESLint e Prettier

## Melhoria implementada

Foi implementado um fluxo de resultados com persistencia no `localStorage`.
Cada simulacao recebe um identificador unico, fica salva no navegador e pode ser
consultada na pagina de resultados. A aplicacao tambem envia os dados da
simulacao para a Gemini e exibe um diagnostico financeiro personalizado.

## Como testar o fluxo principal

1. Execute `pnpm dev`.
2. Acesse a pagina inicial.
3. Preencha as seis etapas da simulacao.
4. Clique em **Gerar simulacao**.
5. Confira os valores na pagina de resultados.
6. No DevTools, abra **Application > Local Storage** e verifique a chave
   `simulation-data`.
7. Na aba **Network**, confira a requisicao para
   `generativelanguage.googleapis.com`.

## O que aprendi

Durante o desafio, aprendi a organizar um projeto React por componentes e
responsabilidades, configurar aliases de importacao, persistir dados no
`localStorage`, criar rotas com parametros e integrar uma API externa. Tambem
pratiquei validacao de tipos com TypeScript, organizacao de imports com ESLint
e formatacao automatica com Prettier.
