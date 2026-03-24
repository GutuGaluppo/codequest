```markdown
# CodeQuest — Contexto do projeto

## Stack

React 18 + TypeScript + Vite + TanStack Router + TanStack Query + Firebase + Zustand + TailwindCSS + Motion

## Regras de arquitetura

- Rotas: file-based em src/routes/ via TanStack Router
- Data fetching: TanStack Query com query options em src/queries/
- Firebase Auth: contexto React separado (nunca no Query)
- Firebase Firestore reads/writes: dentro de useQuery / useMutation
- Firestore onSnapshot: hook customizado que chama invalidateQueries
- Estado de UI local: Zustand em src/stores/
- Serviços de IA: em src/services/, desacoplados dos componentes

## Convenções

- Query keys: arrays descritivos ['entidade', 'id', ...params]
- Arquivos de rota: kebab-case com $ para params dinâmicos
- Componentes: PascalCase, um por arquivo
- Hooks: camelCase com prefixo use
- Services: camelCase com sufixo Service

## Variáveis de ambiente

Todas com prefixo VITE\_. Chaves de IA dos usuários nunca em .env — apenas Firestore.
```

---

## Primeira tarefa

Após ler todo este documento, execute:

1. Inicialize o projeto com Vite + React + TypeScript
2. Instale todas as dependências listadas
3. Configure TailwindCSS, Firebase, TanStack Router (com geração de routeTree) e TanStack Query
4. Crie o `__root.tsx` com QueryClientProvider, AuthProvider e Outlet
5. Implemente o hook `useAuth` com Firebase Google Login
6. Confirme que `vite dev` roda sem erros antes de prosseguir

Pergunte antes de tomar decisões que não estejam cobertas por este documento.
