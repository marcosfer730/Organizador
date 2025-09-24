# Organizador - Painel Web

## Descrição

O **Organizador** é um painel web desenvolvido para gerenciar compromissos, tarefas, finanças e dúvidas. O sistema possui uma interface intuitiva, responsiva e modular, permitindo acesso rápido às principais funcionalidades do usuário.

Principais funcionalidades:

* Painel de **tarefas** com criação, edição e exclusão.
* **Controle de finanças** com registro de receitas e despesas.
* **Central de dúvidas (FAQ)** com perguntas e respostas armazenadas localmente.
* Layout responsivo para desktop e dispositivos móveis.
* Interface moderna baseada em **HTML, CSS e JavaScript**.

---

## Estrutura do Projeto

```
project-root/
│
├─ templates/            # Arquivos HTML
│   ├─ main.html
│   ├─ org.html
│   ├─ fin.html
│   └─ duv.html
│
├─ static/
│   ├─ css/
│   │   └─ css
│   └─ js/
│      └─ js
│      
│               
│
├─ index.html            # Página inicial
└─ README.md             # Este arquivo
```

---

## Tecnologias Utilizadas

* **HTML5**: Estrutura das páginas.
* **CSS3**: Estilização, layout flexível e responsivo.
* **JavaScript (ES6)**: Manipulação de DOM, CRUD de tarefas e FAQ.
* **LocalStorage**: Armazenamento local de dados do usuário.
* **Live Server** (VS Code) para desenvolvimento local.

---

## Como Executar Localmente

1. **Clonar o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/organizador.git
   cd organizador
   ```

2. **Abrir com VS Code**:

   * Abra a pasta do projeto no VS Code.
   * Instale a extensão **Live Server** (se ainda não tiver).
   * Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

3. **Acessar pelo navegador**:

   * No mesmo computador: `http://127.0.0.1:5500/`
   * Na mesma rede (outros dispositivos): `http://<IP_DO_PC>:5500/`

     > ⚠️ Certifique-se de que o firewall permite conexões na porta 5500.

---

## Estrutura de Navegação

* **Início** → Página principal com visão geral.
* **Organizador** → Gerenciamento de tarefas.
* **Finanças** → Controle de receitas e despesas.
* **Central de Dúvidas** → Perguntas e respostas.

---

## Boas práticas e recomendações

* Sempre executar o projeto em um **servidor local** (Live Server) para evitar problemas de caminhos e restrições do navegador.
* Garantir que a pasta `static` esteja no mesmo nível que os arquivos HTML para que CSS e JS sejam carregados corretamente.
* Limpar o LocalStorage periodicamente durante testes de FAQ e tarefas.

---

## Contato

Desenvolvido por **Marcos Vinícius**
Email: [viniciosm730@email.com](mailto:viniciosm730@email.com)
GitHub: [https://github.com/marcosfer730](https://github.com/marcosfer730)
