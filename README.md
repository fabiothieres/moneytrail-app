# MoneyTrail — Sistema de Gerenciamento Financeiro SaaS

<div align="center">
  <img src="./public/favicon.svg" alt="MoneyTrail Logo" width="80" height="80" />
  <p><strong>A trilha do seu dinheiro. Gestão financeira inteligente, segura e gratuita.</strong></p>
</div>

<img width="1920" height="1033" alt="image" src="https://github.com/user-attachments/assets/c892294c-6de3-4160-8744-930a5b96148c" />


**MoneyTrail** é uma aplicação web full-stack focada no controle financeiro pessoal e empresarial. Projetado para ser intuitivo e direto ao ponto, o sistema oferece desde o registro simples de receitas e despesas até a automação do cálculo de parcelamentos em meses futuros, tudo protegido por uma arquitetura serverless robusta.

🌐 **Acesse ao vivo:** [moneytrail-fabio.vercel.app](https://moneytrail-fabio.vercel.app/)

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
USING (auth.uid() = user_id)
```

Isso significa que **mesmo que o front-end faça uma query sem filtro**, o PostgreSQL só retornará os registros do usuário autenticado pelo JWT.

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

> ⚠️ **Nunca commite o arquivo `.env`!** Use `.env.example` como template.

---

## ⚙️ CI/CD: Prevenção de Inatividade (GitHub Actions)

O Supabase pausa projetos gratuitos após **7 dias sem atividade**. O workflow `.github/workflows/keep-alive.yml` executa automaticamente a cada **4 dias** e faz um ping na API REST do Supabase.

---

## 📦 Dependências Principais

| Pacote | Função |
|---|---|
| `react` | UI library |
| `vite` | Build tool |
| `tailwindcss` | Estilização utilitária |
| `react-router-dom` | Roteamento SPA |
| `@supabase/supabase-js` | Cliente Supabase |
| `lucide-react` | Ícones SVG |
| `react-hot-toast` | Notificações toast |
| `recharts` | Gráficos interativos |
| `date-fns` | Formatação de datas |

---

## 📄 Licença

MIT — livre para uso pessoal e comercial.

<div align="center">
  Desenvolvido por <a href="https://www.linkedin.com/in/fabio-thieres-00b320265/" target="_blank">Fabio Thieres</a>
</div>
