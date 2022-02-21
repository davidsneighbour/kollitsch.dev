describe('Testing Theme Switcher', () => {
  it('check default theme setup', () => {

    cy.visit('/').then(() => {

      const expected = (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) ? 'dark' : 'light';

      expect(localStorage.getItem('theme')).to.eq(expected);

    });

    cy.clearLocalStorage('theme').then((ls) => {
      expect(ls.getItem('theme')).to.be.null
    })

    // test available themeswitcher links
    cy.get('.is--themeswitcher a').each((element: HTMLElement, index, $list) => {
      cy.get(element[0]).click().should(() => {
        expect(localStorage.getItem('theme')).to.eq(element[0].id)
      })
    });
  })

  // test themes by id
  it('Check all themes by name', () => {
    const themes = ['light', 'dark'];
    cy.visit('/')
    themes.forEach(theme => {
      cy.get('#' + theme).click().should((element) => {
        expect(localStorage.getItem('theme')).to.eq(theme)
        //expect(element).get('body').should("have.attr", "class", theme)
      })
    })
  });

})
