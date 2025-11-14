# 📘 MANUAL DE IMPLANTAÇÃO - RENDER (GRATUITO)

## Sistema de Calendário São Paulo Skills

---

## 📋 ÍNDICE

1. [Pré-requisitos](#pré-requisitos)
2. [Preparação do Projeto](#preparação-do-projeto)
3. [Criação do Repositório GitHub](#criação-do-repositório-github)
4. [Deploy no Render](#deploy-no-render)
5. [Configuração Pós-Deploy](#configuração-pós-deploy)
6. [Manutenção e Atualizações](#manutenção-e-atualizações)
7. [Solução de Problemas](#solução-de-problemas)

---

## 1. PRÉ-REQUISITOS

Antes de começar, você precisará ter:

### ✅ Contas Necessárias (GRATUITAS)

1. **Conta GitHub** - https://github.com/signup
   - Onde seu código será armazenado
   - Totalmente gratuito para projetos públicos

2. **Conta Render** - https://render.com/register
   - Plataforma de hospedagem gratuita
   - Suporta aplicações React/Vite
   - Não precisa de cartão de crédito

### 🔧 Software no Computador

1. **Git** - https://git-scm.com/downloads
   - Para Windows: baixe e instale o Git for Windows
   - Para Mac: geralmente já vem instalado
   - Para Linux: `sudo apt install git` ou `sudo yum install git`

2. **Node.js** (versão 16 ou superior) - https://nodejs.org/
   - Baixe a versão LTS (recomendada)
   - Inclui o npm (gerenciador de pacotes)

### 📝 Verificar Instalações

Abra o terminal/prompt de comando e execute:

```bash
git --version
# Deve mostrar algo como: git version 2.40.0

node --version
# Deve mostrar algo como: v18.17.0

npm --version
# Deve mostrar algo como: 9.6.7
```

Se algum comando não funcionar, reinstale o software correspondente.

---

## 2. PREPARAÇÃO DO PROJETO

### Passo 1: Baixar os Arquivos do Projeto

Você tem todos os arquivos necessários. Organize-os em uma pasta no seu computador.

**Estrutura de pastas esperada:**

```
calendario-sao-paulo-skills/
├── src/
│   ├── CalendarSystem.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── storage.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

### Passo 2: Criar a Pasta e Copiar os Arquivos

**No Windows:**
1. Crie uma pasta chamada `calendario-sao-paulo-skills` em um local de fácil acesso (ex: `C:\Projetos\`)
2. Copie todos os arquivos do projeto para esta pasta

**No Mac/Linux:**
1. Abra o Terminal
2. Execute:
```bash
mkdir ~/calendario-sao-paulo-skills
cd ~/calendario-sao-paulo-skills
```

### Passo 3: Instalar Dependências

Abra o terminal/prompt de comando na pasta do projeto:

**Windows:**
- Clique com botão direito na pasta
- Escolha "Abrir no Terminal" ou "Git Bash Here"

**Mac/Linux:**
- Navegue até a pasta: `cd ~/calendario-sao-paulo-skills`

Execute o comando:

```bash
npm install
```

⏳ Aguarde a instalação (pode levar 2-5 minutos).

Você verá uma pasta `node_modules` ser criada.

### Passo 4: Testar Localmente

```bash
npm run dev
```

✅ Se tudo estiver correto:
- Uma mensagem aparecerá: `Local: http://localhost:3000/`
- Abra o navegador em `http://localhost:3000`
- Você deve ver a tela de login do sistema

❌ Se houver erro:
- Verifique se todos os arquivos estão na pasta correta
- Execute `npm install` novamente
- Verifique a seção "Solução de Problemas"

Para parar o servidor: pressione `Ctrl+C` no terminal

---

## 3. CRIAÇÃO DO REPOSITÓRIO GITHUB

### Passo 1: Criar Conta no GitHub

1. Acesse https://github.com/signup
2. Preencha:
   - Email
   - Senha
   - Nome de usuário
3. Verifique seu email
4. Complete o cadastro

### Passo 2: Criar Novo Repositório

1. Faça login no GitHub
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**

**Configurações do Repositório:**
- **Repository name:** `calendario-sao-paulo-skills`
- **Description:** Sistema de Calendário São Paulo Skills - Ciclo 2026-2028
- **Visibilidade:** Public (para usar Render gratuito)
- ⚠️ **NÃO** marque "Add a README file"
- ⚠️ **NÃO** adicione .gitignore ou licença

4. Clique em **"Create repository"**

### Passo 3: Conectar Projeto Local ao GitHub

Copie os comandos que aparecem na tela do GitHub após criar o repositório.

No terminal, dentro da pasta do projeto, execute:

```bash
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Primeira versão do sistema de calendário"

# Conectar ao GitHub (SUBSTITUA SEU-USUARIO pelo seu nome de usuário)
git remote add origin https://github.com/SEU-USUARIO/calendario-sao-paulo-skills.git

# Enviar código para o GitHub
git branch -M main
git push -u origin main
```

📝 **Autenticação:**
- Você pode precisar fazer login no GitHub
- Use seu usuário e senha
- Para senha, pode ser necessário criar um "Personal Access Token":
  1. GitHub → Settings → Developer settings
  2. Personal access tokens → Tokens (classic)
  3. Generate new token
  4. Marque "repo"
  5. Copie o token e use como senha

✅ **Verificação:**
- Atualize a página do seu repositório no GitHub
- Você deve ver todos os arquivos listados

---

## 4. DEPLOY NO RENDER

### Passo 1: Criar Conta no Render

1. Acesse https://render.com/register
2. Clique em **"Get Started for Free"**
3. Escolha **"Sign up with GitHub"** (recomendado)
4. Autorize o Render a acessar sua conta GitHub
5. Complete o cadastro

### Passo 2: Criar Novo Web Service

1. No Dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**

### Passo 3: Conectar Repositório

1. Na lista de repositórios, encontre **`calendario-sao-paulo-skills`**
2. Clique em **"Connect"**

💡 **Dica:** Se não aparecer:
- Clique em "Configure account"
- Dê permissão ao Render para acessar seus repositórios

### Passo 4: Configurar o Web Service

Preencha os campos conforme abaixo:

**🔹 Name:**
```
calendario-sao-paulo-skills
```

**🔹 Region:**
```
Frankfurt (EU Central) ou Oregon (US West)
```
(Escolha a região mais próxima)

**🔹 Branch:**
```
main
```

**🔹 Root Directory:**
```
(deixe em branco)
```

**🔹 Runtime:**
```
Node
```

**🔹 Build Command:**
```
npm install && npm run build
```

**🔹 Start Command:**
```
npm run start
```

**🔹 Instance Type:**
```
Free
```
✅ Selecione o plano **FREE** (gratuito)

### Passo 5: Configurações Avançadas (Opcional)

Clique em **"Advanced"** e adicione:

**Environment Variables:**
- Não é necessário adicionar nenhuma por enquanto

**Auto-Deploy:**
- ✅ Deixe marcado "Auto-Deploy" (Yes)
  - Isso fará deploy automático quando você atualizar o GitHub

### Passo 6: Criar Web Service

1. Revise todas as configurações
2. Clique em **"Create Web Service"**

⏳ **Aguarde o Deploy (5-10 minutos):**
- O Render vai:
  1. Baixar seu código do GitHub
  2. Instalar dependências (`npm install`)
  3. Fazer o build (`npm run build`)
  4. Iniciar o servidor
  5. Disponibilizar sua URL

### Passo 7: Deploy em Progresso

Você verá logs em tempo real:

```
==> Cloning from https://github.com/SEU-USUARIO/calendario-sao-paulo-skills...
==> Running 'npm install && npm run build'
==> Build successful!
==> Starting service...
==> Service is live! 🎉
```

✅ **Status de Sucesso:**
- Verde com mensagem "Live"
- URL disponível no topo da página

---

## 5. CONFIGURAÇÃO PÓS-DEPLOY

### Passo 1: Acessar sua Aplicação

No topo da página do Render, você verá uma URL como:

```
https://calendario-sao-paulo-skills.onrender.com
```

1. Clique na URL
2. Aguarde o carregamento (primeira vez pode demorar 30-60 segundos)
3. Você deve ver a tela de login!

### Passo 2: Primeiro Acesso

**Credenciais padrão:**
- **Usuário:** `adm`
- **Senha:** `senaisp@2025`

### Passo 3: Configuração Inicial

Após fazer login como administrador:

1. **Upload da Logo:**
   - Vá para Painel Admin
   - Faça upload da logo da instituição
   - A logo aparecerá na tela de login também

2. **Criar Usuários:**
   - No Painel Admin → Usuários do Sistema
   - Clique em "Novo"
   - Crie os usuários necessários

3. **Configurar Tipos de Eventos:**
   - No Painel Admin → Tipos de Eventos
   - Customize conforme necessário

4. **Criar Eventos:**
   - Voltar ao Calendário
   - Clique em "Novo Evento"
   - Preencha as informações

### Passo 4: Domínio Personalizado (Opcional)

O Render fornece um domínio gratuito (`.onrender.com`).

Para usar seu próprio domínio:

1. No painel do Render, vá em "Settings"
2. Role até "Custom Domains"
3. Clique em "Add Custom Domain"
4. Siga as instruções para configurar DNS

📝 **Nota:** Domínio personalizado requer configuração externa (registro de domínio).

---

## 6. MANUTENÇÃO E ATUALIZAÇÕES

### Como Atualizar o Sistema

Sempre que você fizer alterações no código:

```bash
# 1. Adicionar arquivos modificados
git add .

# 2. Criar commit com descrição
git commit -m "Descrição da alteração"

# 3. Enviar para GitHub
git push origin main
```

🚀 **Deploy Automático:**
- O Render detectará a mudança automaticamente
- Fará novo deploy em 3-5 minutos
- Você receberá email de notificação

### Monitoramento

**Ver Logs:**
1. Acesse o Dashboard do Render
2. Clique no seu serviço
3. Vá em "Logs"
4. Veja logs em tempo real

**Métricas:**
- No mesmo painel, veja:
  - CPU usage
  - Memory usage
  - Request count

### Limitações do Plano Gratuito

⚠️ **Importante saber:**

1. **Sleep após inatividade:**
   - Após 15 minutos sem acesso, o serviço "dorme"
   - Primeiro acesso após dormir leva ~30 segundos
   - Solução: Usar um "pinger" (veja dicas abaixo)

2. **750 horas/mês:**
   - Plano gratuito tem limite de horas
   - Suficiente para uso contínuo

3. **Build time:**
   - Máximo 90 segundos de build
   - Nosso projeto está bem dentro desse limite

### Dica: Evitar Sleep

Use um serviço como **UptimeRobot** (gratuito):
1. Cadastre em https://uptimerobot.com
2. Adicione sua URL do Render
3. Configure ping a cada 5 minutos
4. Seu site nunca dormirá!

---

## 7. SOLUÇÃO DE PROBLEMAS

### ❌ Erro: "Build failed"

**Causa comum:** Dependências não instaladas

**Solução:**
```bash
# Local, execute:
rm -rf node_modules package-lock.json
npm install
npm run build

# Se funcionar local, faça push:
git add .
git commit -m "Fix dependencies"
git push origin main
```

### ❌ Erro: "Command not found: npm"

**Causa:** Node.js não instalado

**Solução:**
1. Instale Node.js de https://nodejs.org
2. Reinicie o terminal
3. Execute `node --version` para verificar

### ❌ Site carrega mas não salva dados

**Causa:** LocalStorage bloqueado pelo navegador

**Solução:**
- Verifique configurações de privacidade do navegador
- Habilite cookies e armazenamento local
- Teste em modo anônimo

### ❌ Erro 503: Service Unavailable

**Causa:** Serviço está "acordando" (sleep mode)

**Solução:**
- Aguarde 30-60 segundos
- Recarregue a página
- Na segunda tentativa deve funcionar

### ❌ Alterações não aparecem após push

**Solução:**
1. Verifique se o push foi feito:
   ```bash
   git status
   ```
   Deve mostrar "nothing to commit"

2. No Render, veja os logs de deploy
3. Se necessário, force novo deploy:
   - No Render: Manual Deploy → Deploy latest commit

### ❌ CSS não carrega / Página branca

**Causa:** Build com erro ou caminho incorreto

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Verifique logs do Render
3. Teste build local:
   ```bash
   npm run build
   npm run preview
   ```

### ❌ Erro de Git: "Authentication failed"

**Causa:** Senha do GitHub não funciona mais

**Solução:**
1. Crie Personal Access Token:
   - GitHub → Settings → Developer settings
   - Personal access tokens → Generate new token
   - Marque "repo"
2. Use o token como senha

### 📞 Precisa de Ajuda?

**Recursos Oficiais:**
- Render Docs: https://render.com/docs
- GitHub Docs: https://docs.github.com
- Vite Docs: https://vitejs.dev

**Logs úteis:**
- Render Logs: Dashboard → Service → Logs
- Browser Console: F12 → Console

---

## ✅ CHECKLIST FINAL

Antes de considerar concluído:

- [ ] Projeto roda local (`npm run dev`)
- [ ] Código no GitHub (visível no repositório)
- [ ] Deploy no Render com status "Live"
- [ ] Site acessível pela URL do Render
- [ ] Login funciona com credenciais padrão
- [ ] Logo carregada no sistema
- [ ] Pelo menos 1 evento criado
- [ ] Testado em dispositivo móvel

---

## 📊 RESUMO DOS CUSTOS

| Item | Custo | Observações |
|------|-------|-------------|
| GitHub | R$ 0,00 | Gratuito para projetos públicos |
| Render | R$ 0,00 | Plano Free - 750h/mês |
| Node.js | R$ 0,00 | Software gratuito |
| Git | R$ 0,00 | Software gratuito |
| **TOTAL** | **R$ 0,00** | 100% Gratuito! |

---

## 🎉 PARABÉNS!

Seu Sistema de Calendário está no ar e funcionando!

Compartilhe a URL com sua equipe e comece a usar.

---

**Desenvolvido para:** SENAI São Paulo  
**Ciclo:** 2026-2028  
**Versão do Manual:** 1.0  
**Data:** Janeiro 2025
