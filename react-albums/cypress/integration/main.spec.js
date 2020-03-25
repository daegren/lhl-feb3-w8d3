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

    const assertBoxIsChecked = (filters, filter) => {
      cy.get(filters)
        .contains(filter)
        .parent()
        .find('input[type="checkbox"]')
        .should('be.checked')
    }

    const assertBoxIsNotChecked = (filters, filter) => {
      cy.get(filters)
        .contains(filter)
        .parent()
        .find('input[type="checkbox"]')
        .should('not.be.checked')
    }

    assertBoxIsChecked('@filters', 'Explicit')
    assertBoxIsChecked('@filters', '1900s')
    assertBoxIsChecked('@filters', '2000s')
    assertBoxIsNotChecked('@filters', 'Single')
    assertBoxIsNotChecked('@filters', 'EP')
  })

  it('fetches artists', () => {
    cy.get('.search')
      .find('input')
      .as('searchBox')

    cy.get('@searchBox').type('Daft Punk')

    cy.get('.album').should('have.length', 13)
    cy.get('.album')
      .find('.album__info--explicit')
      .should('have.length', 1)

    cy.get('#Explicit').uncheck()

    cy.get('.album').should('have.length', 12)
    cy.get('.album')
      .find('.album__info--explicit')
      .should('not.exist')
  })
})
