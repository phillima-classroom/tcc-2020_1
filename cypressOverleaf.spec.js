// Referenciando o VS Code para entender que estamos trabalhando com Cypress
/// <reference types="cypress" />

// Link da página web do Overleaf
const url = 'https://pt.overleaf.com/'

// Declaração de váriaveis de acordo com os seus elementos na DOM
const botaoEntrar = '.nav > :nth-child(6) > a'
const campoEmail = ':nth-child(3) > .form-control'
const campoSenha = ':nth-child(4) > .form-control'
const botaoEntrarComEmail =  '.btn-primary'
const botaoNovoProjeto = '.project-list-sidebar > .dropdown > .btn'
const botaoVerTodos = ':nth-child(17) > .menu-indent'
const campoPesquisar = '#search'
const botaoPesquisar = '.btn'
const botaoMenu = '.toolbar-left > .btn'
const botaoRecompilar = '[ng-click="recompile()"] > .fa'
const paginaArtigo = ':nth-child(1) > .plv-page-view > .pdf-canvas'
const botaoPDF = '.nav-downloads > :nth-child(2) > .ng-scope'
const botaoOpenTemplate = '[href="/project/new/template/13872?id=25479527&latexEngine=pdflatex&mainFile=main.tex&templateName=Modelo+INATEL+TCC+GRADUACAO&texImage=texlive-full%3A2019.1"]'
const botaoExpandirFig = ':nth-child(3) > :nth-child(1) > [ng-controller="FileTreeFolderController"] > .entity-name.ui-droppable > .ng-isolate-scope > .toggle'
const cliqueDireito = '.selected > [ng-controller="FileTreeFolderController"] > .entity-name.ui-droppable > .ng-isolate-scope > .entity-menu-toggle > .dropdown-toggle > .fa'
const botaoUpload = '.selected > [ng-controller="FileTreeFolderController"] > .entity-name.ui-droppable > .ng-isolate-scope > .entity-menu-toggle > .dropdown-menu > :nth-child(6) > a'
const menuSecoes = ':nth-child(4) > :nth-child(1) > [ng-controller="FileTreeFolderController"] > .entity-name.ui-droppable > .ng-isolate-scope > .toggle'
const intro = '.selected > [ng-controller="FileTreeFolderController"] > .list-unstyled > :nth-child(2) > li.ng-scope > .entity > .entity-name > .ng-binding'
const campoNomeImg = '.ng-dirty.ng-valid-valid-file > :nth-child(3) > .form-control'
const botaoCreateImg = '[ng-hide="state.inflight"]'

// Link de imagem utilizada como anexo para o artigo
const linkImg = 'https://www.perfecto.io/sites/perfecto.io/files/image/2019-10/image-blog-cypress-vs-selenium.png'

// Informação de login no Overleaf
const usuario = 'usuário@email'     // Insira o email de acesso ao Overleaf
const senha = 'senha'                       // Insira a senha de acesso ao Overleaf

it ('Automatização de testes: Overleaf', () => {
        
    // Acessando a página web
    cy.visit(url)

    // Realizando login
    cy.get(botaoEntrar).click()
    cy.get(campoEmail).type(usuario)
    cy.get(campoSenha).type(senha)
    cy.get(botaoEntrarComEmail).click()

    // Visualizando Todos os Projetos
    cy.get(botaoNovoProjeto).should('exist')
    cy.get(botaoNovoProjeto).click()
    cy.get(botaoVerTodos).should('exist')
    cy.get(botaoVerTodos).click()

    // Pesquisando o Template de TCC Graduação
    cy.get(campoPesquisar).should('exist')
    cy.get(campoPesquisar).type('INATEL TCC')
    cy.get(botaoPesquisar).click()
    cy.get('body').should('contain', 'TCC GRADUACAO')
    cy.contains('TCC GRADUACAO').click()

    // Abrindo Template do artigo TCC Graduação
    cy.get(botaoOpenTemplate).click()

    // Inserindo imagem no artigo
    cy.get(botaoExpandirFig).click()
    cy.get(cliqueDireito).click()
    cy.get(botaoUpload).should('exist').click({force: true})
    cy.get('.active').next().next().click()
    
    // Inserindo o link da imagem
    cy
        .get('[for="url"]')
        .next()
        .type(linkImg)

    // Inserindo o nome da imagem
    cy.get(campoNomeImg).clear().type('figuraTeste.jpg')

    // Criando a imagem
    cy.get(botaoCreateImg).click()

    // Acessando o menu "02-introducao"
    cy.get(menuSecoes).click()
    cy.get(intro).click()

    // Desativando auto-complete para não interferir no texto que será inserido
    cy.get(botaoMenu).click()
    cy
        .get(':nth-child(5) > .ng-pristine')
        .select('Off')
        .should('have.value', 'boolean:false')
    
    cy.get('#left-menu-mask').click()

    // Inserindo texto no Overleaf
    cy
        .get('.ace_content')
        .click('bottomLeft', {force:true})
        .type(
                    '\\begin{figure}\n' +
                        '\\centering\n' +
                        '\\includegraphics[width=\\linewidth]{figuras/figuraTeste.jpg}\n' +
                        '\\caption{Rotulo Teste}\n' +
                        '\\label{fig:label_teste}\n' +
                    '\\end{figure}\n'
                    ,{parseSpecialCharSequences: false}
                )

    // Verifica se o artigo foi compilado e carregado
    cy
        .get(paginaArtigo)
        .should('exist')

    // Clicando no botão para recompilar o artigo
    cy.get(botaoRecompilar).should('be.visible').click({force: true})

    // Verifica se o artigo foi compilado e carregado
    cy
        .get(paginaArtigo)
        .should('exist')

    // Aguardando a recompilação
    cy.wait(6000)

    // Baixando o pdf
    cy.get(botaoMenu).click()
    cy.get(botaoPDF).click()

})