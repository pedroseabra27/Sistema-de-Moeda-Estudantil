# Sistema de Moeda Estudantil 

- Apresentação: [presentation-bnp-coin-production.up.railway.app](https://presentation-bnp-coin-production.up.railway.app)
- GitHub apresentação [![GitHub Repo](https://img.shields.io/badge/github-repo-blue.svg)](https://github.com/brenin35/presentation-bnp-coin)


## Descrição

Esse projeto consiste no desenvolvimento de um sistema para incentivar o reconhecimento do mérito estudantil por meio de uma moeda virtual. 

## Alunos

- Breno de Oliveira Brandão
- Nicolas Almeida Prado da Silva
-  Pedro Augusto Santos Seabra

## Professor

- João Paulo Carneiro Aramuni

## Principais atores

- Aluno: realiza cadastro, recebe moedas, consulta extrato e resgata vantagens.
- Professor: já pré-cadastrado; recebe 1.000 moedas por semestre (saldo acumulável) e envia moedas aos alunos com justificativa (mensagem obrigatória).
- Empresa parceira: cadastra vantagens (descrição, foto e custo em moedas) e recebe notificações quando um cupom é resgatado.

## Funcionalidades principais

- Cadastro e autenticação para alunos, professores e empresas (login + senha).
- Professores: saldo semestral acumulável e envio de moedas com mensagem obrigatória.
- Alunos: notificação por e-mail ao receber moedas; extrato de transações; resgate de vantagens com geração de cupom e código.
- Empresas: CRUD de vantagens (nome, descrição, foto, custo em moedas); recebimento de notificação por e-mail quando um cupom é resgatado.
- Transações: histórico (extrato) para professores e alunos; geração de códigos de conferência enviados por e-mail tanto ao aluno quanto ao parceiro.

## Regras de negócio (resumo)

- Cada professor recebe 1.000 moedas por semestre. Saldo não utilizado é acumulado.
- Para enviar moedas, o professor deve ter saldo suficiente e informar o aluno e a justificativa.
- Ao resgatar uma vantagem, o saldo do aluno é debitado e um cupom (com código) é enviado por e-mail para o aluno e para a empresa parceira.

## Arquitetura e modelagem

- Arquitetura: MVC (separação entre Model, View e Controller).
- Persistência: Drizzle ORM (PostgreSQL)

## Tecnologias escolhidas

<img width="60px" height="60px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg" /> <img width="60px" height="60px" src="https://cdn.simpleicons.org/drizzle" /> <img width="60px" height="60px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" /> <img width="60px" height="60px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" />
<img width="60px" height="60px" src="https://railway.app/brand/logo-dark.svg" />

- Frontend: Svelte
- Backend: SvelteKit
- ORM: Drizzle ORM
- Banco de Dados: PostgreSQL
- Estilização: TailwindCSS
- Deploy: Railway 

## Deploy

## Estrutura de diretórios do projeto

## Instalação e execução local




