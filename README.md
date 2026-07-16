# 💵 MoneyTrail

<div align="center">
  <img src="./public/favicon.svg" alt="MoneyTrail Logo" width="80" height="80" />
  <p><strong>A trilha do seu dinheiro. Gestão financeira inteligente, segura e gratuita.</strong></p>
</div>

![MoneyTrail Preview](https://moneytrail-fabio.vercel.app/favicon.svg) <!-- Você pode depois trocar esse link por um print real do sistema -->

**MoneyTrail** é uma aplicação web full-stack focada no controle financeiro pessoal e empresarial. Projetado para ser intuitivo e direto ao ponto, o sistema oferece desde o registro simples de receitas e despesas até a automação do cálculo de parcelamentos em meses futuros, tudo protegido por uma arquitetura serverless robusta.

🌐 **Acesse ao vivo:** [moneytrail-fabio.vercel.app](https://moneytrail-fabio.vercel.app/)

---

## ✨ Principais Funcionalidades

- **Dashboard Analítico:** 6 KPIs processados via RPC no banco de dados, mostrando saldos totais e do mês selecionado.
- **Gráficos Interativos:** Visualização de despesas e receitas usando gráficos de pizza e barras, facilitando a identificação de padrões de consumo.
- **Gestão de Parcelamentos:** Algoritmo que gera automaticamente as parcelas futuras para transações divididas no cartão de crédito, distribuindo os gastos nos meses corretos.
- **Navegação Temporal:** Filtre e navegue de forma global entre meses passados e futuros para visualizar fluxos de caixa isolados.
- **Categorização Personalizada:** Crie categorias próprias para organizar melhor seus gastos.
- **Autenticação Segura:** Login, registro e proteção de rotas implementados no Front-end e no Back-end.

## 🛠️ Tecnologias Utilizadas

### Front-end
- **React.js** (via Vite)
- **Tailwind CSS** (Estilização responsiva e UI moderna)
- **React Router v6** (Navegação SPA)
- **Lucide React** (Ícones)
- **Recharts** (Gráficos)
- **React Hot Toast** (Notificações visuais)

### Back-end & Infraestrutura
- **Supabase** (BaaS)
- **PostgreSQL** (Banco de dados relacional)
- **Row Level Security (RLS)** (Políticas rigorosas garantindo que usuários acessem apenas seus próprios dados)
- **Postgres RPC (Remote Procedure Calls)** (Cálculo de totalizadores direto no banco de dados para ganho extremo de performance)
- **Vercel** (Hospedagem e CI/CD)

---

## 🚀 Como rodar o projeto localmente

### 1. Clone o repositório
```bash
git clone https://github.com/fabiothieres/finflow-app.git
cd finflow-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configuração do Ambiente (Supabase)
Crie um projeto no [Supabase](https://supabase.com/) e rode os arquivos SQL da pasta raiz (`database-setup.sql`, `migration-installments.sql`, etc.) no SQL Editor para criar as tabelas e funções.

Crie um arquivo `.env` na raiz do projeto com suas credenciais:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_anon_key_do_supabase
```

### 4. Rode a aplicação
```bash
npm run dev
```
Acesse `http://localhost:5173`.

---

## 🔒 Segurança em Destaque

Neste projeto, a segurança dos dados é garantida através do **Row Level Security (RLS)** do PostgreSQL. Políticas (`Policies`) foram escritas diretamente nas tabelas (`transactions` e `categories`), exigindo o `auth.uid()` correspondente em todas as ações de CRUD. Dessa forma, mesmo que as chaves de API públicas sejam expostas, os dados continuam impenetráveis.

---

<div align="center">
  Desenvolvido por Fábio Santana.
</div>
