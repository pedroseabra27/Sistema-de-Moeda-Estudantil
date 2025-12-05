[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo) [![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999)

---

# BNP Coin ✨

> [!NOTE]
> Sistema para incentivar o reconhecimento do mérito estudantil através de uma moeda virtual, permitindo distribuição por professores e troca por vantagens em empresas parceiras.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>Sistema de Moeda Estudantil</b> é uma aplicação desenvolvida para a disciplina de Laboratório de Desenvolvimento de Software. O projeto visa fomentar o engajamento acadêmico através de gamificação, onde professores distribuem moedas virtuais aos alunos como recompensa por bom desempenho. Os alunos, por sua vez, podem acumular essas moedas e trocá-las por benefícios reais (descontos, produtos) oferecidos por empresas parceiras cadastradas na plataforma. O sistema garante segurança nas transações e notificação via e-mail com códigos de validação de cupons.
      </div>
    </td>
    <td>
      <div align="center">
        <img src="https://cdn-icons-png.flaticon.com/512/2845/2845667.png" alt="Logo Moeda Estudantil" width="120px"/>
      </div>
    </td>
  </tr> 
</table>

---

## 🚧 Apresentação do Projeto

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/brenin35/presentation-bnp-coin/main.yml?branch=main)](https://github.com/brenin35/presentation-bnp-coin)
[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue)](https://github.com/pedroseabra27/Sistema-de-Moeda-Estudantil)
[![Licença](https://img.shields.io/github/license/brenin35/presentation-bnp-coin)](#licença)

### Tech Stack:

![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)
![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=Svelte&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

---

## 📚 Índice

- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Regras de Negócio](#-regras-de-negócio)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
  - [Como Executar a Aplicação](#como-executar-a-aplicação)
- [Estrutura de Pastas](#-estrutura-de-pastas)

---

## 🔗 Links Úteis

- 🌐 **Demo Online:** [Acesse a Aplicação (Railway)](https://sistema-de-moeda-estudantil-production.up.railway.app/login)
  > 💻 **Descrição:** Link para a aplicação rodando em ambiente de produção na Railway.
- 📂 **Repositório:** [GitHub Repo](https://github.com/pedroseabra27/Sistema-de-Moeda-Estudantil)
  > 📦 **Descrição:** Código fonte completo do projeto.

---

## 📝 Sobre o Projeto

Este projeto foi desenvolvido para atender aos requisitos dos Laboratórios 03, 04 e 05 da disciplina. O objetivo é criar um ecossistema econômico fechado dentro da universidade.

**Contexto:**
Professores recebem uma verba semestral em moedas virtuais para distribuir aos alunos. Alunos acumulam essas moedas e as trocam por vantagens (descontos em mensalidade, refeições, materiais) cadastradas por empresas parceiras.

**Principais Atores:**

- **Aluno:** Realiza cadastro, recebe moedas, consulta extrato e resgata vantagens.
- **Professor:** Já pré-cadastrado no sistema; recebe dotação de moedas e premia alunos.
- **Empresa Parceira:** Cadastra vantagens e valida os cupons apresentados pelos alunos.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação e Cadastro:** Login e senha para todos os tipos de usuários (Alunos, Professores, Empresas).
- 💰 **Distribuição de Moedas:** Professores podem enviar moedas para alunos com uma mensagem de reconhecimento obrigatória.
- 🛍️ **Marketplace de Vantagens:** Empresas parceiras cadastram itens com foto, descrição e preço em moedas.
- 🎟️ **Resgate de Cupons:** Alunos trocam saldo por vantagens. O sistema gera um cupom único.
- 📧 **Notificações por E-mail:**
  - Aluno recebe e-mail ao ganhar moedas.
  - Aluno e Empresa recebem e-mail com código do cupom ao realizar uma troca.
- 📜 **Extrato e Histórico:** Visualização completa das transações (entradas e saídas) para todos os usuários.

---

## 📋 Regras de Negócio

1. **Dotação Semestral:** Cada professor recebe 1.000 moedas por semestre.
2. **Acúmulo de Saldo:** O saldo do professor é acumulável; se não distribuir tudo, o restante soma-se ao próximo semestre.
3. **Validação de Envio:** O professor deve ter saldo suficiente para realizar a transação. A justificativa do envio é obrigatória.
4. **Troca e Segurança:** Ao resgatar uma vantagem, o saldo do aluno é debitado imediatamente e um código de conferência é gerado e enviado para ambas as partes (aluno e parceiro) para validar a troca presencial.

---

## 🛠 Tecnologias Utilizadas

### 💻 Full-stack (SvelteKit)

- **Framework:** [SvelteKit](https://kit.svelte.dev/)
- **Estilização:** [TailwindCSS](https://tailwindcss.com/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Deploy:** [Railway](https://railway.app/)

---

## 🏗 Arquitetura

O sistema segue o padrão **MVC (Model-View-Controller)** adaptado para a arquitetura moderna do SvelteKit.

- **Model (Dados):** Definidos pelos schemas do Drizzle ORM e tabelas do PostgreSQL.
- **View (Interface):** Componentes Svelte (`.svelte`) estilizados com Tailwind.
- **Controller (Lógica):** `+page.server.ts` e API endpoints do SvelteKit que gerenciam as requisições, validações e comunicação com o banco.

### Diagramas (Exemplos)

> [!TIP] > [Diagramas](https://github.com/pedroseabra27/Sistema-de-Moeda-Estudantil/tree/main/diagramas/)

|                                                                  Modelagem de Dados                                                                  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                    **Modelo ER**                                                                     |
|    <img width="1800" height="1140" alt="diagramaER (1)" src="https://github.com/user-attachments/assets/697b74f8-bb3e-4da5-9256-6d8f64864dd1" />     |
|                                                               Diagrama de Componentes                                                                |
|                                                                   **Visão Geral**                                                                    |
| <img width="2560" height="4160" alt="diagramaDeComponentes" src="https://github.com/user-attachments/assets/0b6cc273-7926-45d9-a478-6e343d30f6d6" /> |

---

## 🔧 Instalação e Execução

### Pré-requisitos

- **Node.js:** Versão LTS (v18.x ou superior).
- **Gerenciador de Pacotes:** npm, yarn ou pnpm.
- **Banco de Dados:** PostgreSQL rodando localmente ou via Docker.

### 🔑 Variáveis de Ambiente

Crie um arquivo **`.env`** dentro da pasta codigo com as seguintes configurações (exemplo):

```env
# Conexão com o Banco de Dados (PostgreSQL)
DATABASE_URL="postgresql://postgres:senha@localhost:5432/moeda_estudantil"

# Configurações para autenticação
BETTER_AUTH_SECRET=Dtnj1ZVjviJ76mmvraQhD3jk2IMYIQuP
BETTER_AUTH_URL=http://localhost:5173

# Configurações de E-mail (Exemplo para envio de notificações)
GMAIL_USER="seuemail@gmail.com"
GMAIL_PASSWORD="aaaa bbbb cccc dddd"
```

### Como Executar a Aplicação

1. Clonar o repositório
2. Instalar dependências
   - `cd codigo`
   - `npm install`
3. Configurar variaves de ambiente (Criar postgres local ou já hospedado, e criar senha de app no gmail)
4. - `npm run db:generate` para gerar alterações ao banco de dados
5. - `npm run db:migrate` para aplicar migrações
6. Ambiente de desenvolvimento
   - `npm run dev`
7. Abrir http://localhost:5173 e está pronto para o uso!

## Como fazer deploy na Railway

### De acordo com nosso projeto:

1. Criar conta na plataforma https://railway.com
2. Vincular uma conta do github
3. Criar um projeto
4. Clicar no botão "Create"
5. Selecionar Database e criar um banco de dados postgres
6. Clicar no botão "Create", selecionar um repositorio no github
7. Utilizar um docker ou template da propria plataforma
8. Na aba de "Variables" colocar todas variaveis de ambiente
9. Gerar um link publico
10. Clicar no botão "Deploy" e está pronto!

### Estrutura de Pastas

```
src/
app.html
app.css
routes/
 /(auth)
   /login ← Realizar login
   /signup ← Realizar cadastro
   /admin
      /alunos ← Rota pra administrador gerenciar os alunos
      /empresas ← Rota pra administrador gerenciar as empresas
      /professor ← Rota pra administrador gerenciar os professores
lib/

```
