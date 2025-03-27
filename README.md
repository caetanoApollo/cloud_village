# Documentação do Projeto Cloud Village

## Visão Geral
O **Cloud Village** é um sistema de gerenciamento de condomínio que permite administrar moradores e veículos de forma eficiente. O projeto inclui:
- Autenticação de administradores
- Cadastro de moradores
- Gestão de veículos
- Visualização de dados através de gráficos

## Tecnologias Utilizadas
- **Frontend:** HTML, CSS, JavaScript (com Chart.js para gráficos)
- **Backend:** Node.js com Express
- **Banco de Dados:** MySQL
- **Bibliotecas:** Bootstrap Icons

## Estrutura do Projeto
```
src/
├── css/            # Arquivos de estilo
│   ├── admin.css
│   ├── dashboard.css
│   ├── index.css
│   └── sobre.css
├── html/           # Páginas HTML
│   ├── admin.html
│   ├── dashboard.html
│   ├── index.html
│   └── sobre.html
├── images/         # Imagens
├── js/             # Scripts JavaScript
│   ├── admin.js
│   ├── dashboard.js
│   ├── index.js
│   └── sobre.js
db.js           # Configuração do banco de dados
server.js       # Servidor principal
cloud_village.sql
package-lock.json
package.json
```

## Páginas HTML Principais
### `admin.html`
Página de autenticação com formulários de login e registro.
**Características:**
- Alternância entre formulários de login e cadastro
- Validação de email (@cloudvillage.com.br)
- Visualização de senha com ícone de olho

### `dashboard.html`
Painel administrativo com:
- Tabelas de moradores e veículos
- Gráfico de distribuição por bloco
- Formulários de cadastro
- Modais para edição
- Barra de busca integrada

### `index.html`
Página inicial com:
- Apresentação do condomínio
- Imagem ilustrativa
- Navegação para outras páginas

### `sobre.html`
Página institucional com:
- Missão, visão e valores
- Descrição do condomínio

## Estilos CSS
### `admin.css`
Estilos específicos para a página de autenticação:
- Layout responsivo
- Efeitos de hover nos botões
- Transições suaves entre formulários
- Design limpo e moderno

### `dashboard.css`
Estilos para o painel administrativo:
- Grid de tabelas e formulários
- Modais estilizados
- Gráfico responsivo
- Design de tabelas interativas

### `index.css`
Estilos da página inicial:
- Layout flexível
- Imagem destacada
- Tipografia elegante

### `sobre.css`
Estilos da página institucional:
- Seções bem espaçadas
- Texto centralizado
- Hierarquia visual clara

## Funcionalidades Principais
### Página de Login/Registro
- Alternância entre formulários
- Validação de email (@cloudvillage.com.br)
- Visualização de senha
- Armazenamento de sessão no localStorage

### Painel de Controle (Dashboard)
- CRUD completo para moradores e veículos
- Gráfico de distribuição de moradores por bloco
- Busca integrada
- Modais para edição
- Layout responsivo
- Alertas visuais

## Como Executar o Projeto
### Pré-requisitos:
- Node.js instalado
- Servidor MySQL rodando

### Configuração do banco de dados:
1. Execute o script SQL em `cloud_village.sql`
2. Configure as credenciais no arquivo `db.js`

### Instalação de dependências:
```bash
npm install
```

### Iniciar o servidor:
```bash
node server.js
```

### Acessar a aplicação:
Abra no navegador: [http://localhost:3000](http://localhost:3000)

## Licença
Este projeto está licenciado sob a licença **MIT**.
