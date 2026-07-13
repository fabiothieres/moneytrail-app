# MoneyTrail — Sistema de Gerenciamento Financeiro SaaS

> Stack: **React 18 + Vite 5** · **Tailwind CSS** · **Supabase (PostgreSQL + Auth)** · **GitHub Actions**

---

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd moneytrail

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🗄️ Configuração do Banco de Dados (Supabase)

1. Acesse [app.supabase.com](https://app.supabase.com) → seu projeto
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo de [`database-setup.sql`](./database-setup.sql)

O script criará automaticamente:
- ✅ Tabela `categories` com RLS
- ✅ Tabela `transactions` com RLS
- ✅ Função RPC `get_financial_summary()`
- ✅ Trigger de categorias padrão (12 categorias inseridas no primeiro login)

---

## 🔐 Arquitetura de Segurança

### Row Level Security (RLS)

Todas as tabelas possuem RLS ativo com a política:

```sql
-- Exemplo: transactions
USING (auth.uid() = user_id)
```

Isso significa que **mesmo que o front-end faça uma query sem filtro**, o PostgreSQL só retornará os registros do usuário autenticado pelo JWT. O front-end não tem autoridade — a segurança está no banco de dados.

### Proteção de Cota de Leituras

| Estratégia | Implementação |
|---|---|
| **Paginação** | Máx. 20 itens por query (`.range()` no Supabase) |
| **Filtro de mês** | Dashboard e Transações filtram por mês atual por padrão |
| **RPC agregado** | Dashboard usa `get_financial_summary()` — 1 chamada, sem `SELECT *` |
| **Sem wildcards** | Todas as queries têm colunas explícitas ou são chamadas de função |

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

> ⚠️ **Nunca commite o arquivo `.env`!** Use `.env.example` como template.
> A chave `anon` é segura para o front-end pois o RLS protege os dados no banco.

---

## ⚙️ CI/CD: Prevenção de Inatividade (GitHub Actions)

O Supabase pausa projetos gratuitos após **7 dias sem atividade**. O workflow `.github/workflows/keep-alive.yml` executa automaticamente a cada **4 dias** e faz um ping na API REST do Supabase.

### Configurar Secrets no GitHub

1. Vá em **Settings → Secrets and variables → Actions**
2. Adicione:
   - `SUPABASE_URL` → URL do seu projeto Supabase
   - `SUPABASE_ANON_KEY` → Chave anon pública

---

## 📁 Estrutura do Projeto

```
moneytrail/
├── .github/
│   └── workflows/
│       └── keep-alive.yml     # CI: previne hibernação do Supabase
├── src/
│   ├── components/
│   │   ├── Layout.jsx         # Layout wrapper com Navbar
│   │   ├── Navbar.jsx         # Navegação responsiva com glassmorphism
│   │   ├── ProtectedRoute.jsx # Guard para rotas privadas
│   │   ├── StatCard.jsx       # Card KPI com animações
│   │   ├── TransactionForm.jsx# Formulário de inserção rápida
│   │   └── TransactionList.jsx# Lista paginada com tabela
│   ├── context/
│   │   └── AuthContext.jsx    # Gerenciamento de sessão Supabase
│   ├── lib/
│   │   └── supabase.js        # Cliente Supabase singleton
│   ├── pages/
│   │   ├── Login.jsx          # Tela de login
│   │   ├── Register.jsx       # Tela de cadastro
│   │   ├── Dashboard.jsx      # KPIs via RPC
│   │   └── Transactions.jsx   # CRUD + Mock API
│   ├── App.jsx                # Rotas e providers
│   ├── main.jsx               # Entry point React
│   └── index.css              # Tailwind + fontes globais
├── database-setup.sql         # DDL completo com RLS
├── .env.example               # Template de variáveis
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 🧪 Mock API

Na página **Transações**, o botão **⚡ Mock API** importa 5 transações de demonstração diretamente para o banco via insert em lote:

```js
// src/pages/Transactions.jsx
const MOCK_TRANSACTIONS = [
  { type: 'income',  amount: 5000.00, description: 'Salário Julho',       ... },
  { type: 'expense', amount:  850.00, description: 'Aluguel',             ... },
  { type: 'expense', amount:  320.50, description: 'Supermercado',        ... },
  { type: 'income',  amount:  750.00, description: 'Freelance Design',    ... },
  { type: 'expense', amount:   99.90, description: 'Assinatura Adobe CC', ... },
]
```

---

## 📦 Dependências Principais

| Pacote | Versão | Função |
|---|---|---|
| `react` | 18 | UI library |
| `vite` | 5 | Build tool |
| `tailwindcss` | 3 | Estilização utilitária |
| `react-router-dom` | 6 | Roteamento SPA |
| `@supabase/supabase-js` | latest | Cliente Supabase |
| `lucide-react` | latest | Ícones SVG |
| `react-hot-toast` | latest | Notificações toast |
| `date-fns` | latest | Formatação de datas |

---

## 📄 Licença

MIT — livre para uso pessoal e comercial.
