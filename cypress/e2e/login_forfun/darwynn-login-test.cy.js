it('should debug all form inputs', () => {
  cy.visit('/authentication/sign-in')
  
  // See what inputs actually exist
  cy.get('input').each(($el, index) => {
    cy.wrap($el).then($input => {
      console.log(`Input ${index}:`, {
        placeholder: $input.attr('placeholder'),
        name: $input.attr('name'),
        type: $input.attr('type'),
        id: $input.attr('id'),
        classes: $input.attr('class')
      })
    })
  })
})
