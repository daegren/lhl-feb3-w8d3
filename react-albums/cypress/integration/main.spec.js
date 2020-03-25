/* eslint-env mocha */
/* global cy */
/// <reference types="cypress" />

context('Album Search', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000')
  })

  it('loads', () => {
    cy.get('.logo img')
      .invoke('attr', 'src')
      .should('eq', 'images/brand.png')

    cy.get('.search')
      .find('input')
      .invoke('attr', 'placeholder')
      .should('eq', 'Search Artists')

    cy.get('.filters').as('filters')

    const assertBox = (filters, filter, checked = true) => {
      const assertion = checked ? 'be.checked' : 'not.be.checked'

      cy.get(filters)
        .contains(filter)
        .parent()
        .find('input[type="checkbox"]')
        .should(assertion)
    }

    assertBox('@filters', 'Explicit')
    assertBox('@filters', '1900s')
    assertBox('@filters', '2000s')
    assertBox('@filters', 'Single', false)
    assertBox('@filters', 'EP', false)
  })

  it('fetches artists', () => {
    cy.server()
    cy.fixture('itunes.json').as('itunesResponse')
    cy.route({
      method: 'GET',
      url: 'search*',
      delay: 250,
      response: '@itunesResponse'
    }).as('getSearch')

    cy.get('.search')
      .find('input')
      .as('searchBox')

    cy.get('@searchBox')
      .type('Daft Punk')
      .should('have.value', 'Daft Punk')
      .get('.spinner')
      .as('spinner')
      .should('be.visible')

    cy.wait('@getSearch')
      .get('main')
      .find('.album')
      .should('have.length', 13)

    cy.get('@spinner').should('not.be.visible')

    cy.get('.album')
      .find('.album__info--explicit')
      .should('have.length', 1)

    cy.get('#Explicit').uncheck()

    cy.wait(200)
      .get('main')
      .find('.album')
      .should('have.length', 12)

    cy.get('.album')
      .find('.album__info--explicit')
      .should('not.exist')
  })
})
