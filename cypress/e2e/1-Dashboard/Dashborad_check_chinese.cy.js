import { login } from '../../support/founctions';

describe('Darwynn Inventory Navigation Test', () => {
    const baseURL= 'https://test-csr.darwynnfulfillment.com/app/dashboard'
    const chineseCharRegex = /[\u4e00-\u9fa5]/;
    let foundChinese = false;
  beforeEach(() => {
  cy.fixture('menu_dir.json').as('subdirs');
  
  const username = Cypress.env('TEST_USERNAME');
  const password = Cypress.env('TEST_PASSWORD');
  const verificationCode = Cypress.env('VERIFICATION_CODE');

  // Login if required
  login(username, password, verificationCode);

  // Ensure login redirected to dashboard
  cy.url().should('include', 'dashboard');
  
  // Take a screenshot of what we see after login
  cy.screenshot('after-login-success');
  
});

  it('访问页面中的所有链接并检查是否包含中文字符', () => {

    cy.visit(baseURL);  // 访问主页面

    // 获取页面上的所有 <a> 标签（假设它们是进入子网站的链接）
    cy.get('a').each(($el) => {
      const href = $el.prop('href'); // 获取 href 属性，即目标网址

      // 如果 href 属性存在且是有效的链接
      if (href) {
        cy.visit(href);  // 访问目标链接

        // 获取新页面的文本内容并检查是否包含中文字符
        cy.get('body').invoke('text').then((bodyText) => {
          if (chineseCharRegex.test(bodyText)) {
            foundChinese = true;  // 如果包含中文字符，标记为 true
          }
        });

        // 返回到主页面以继续点击其他按钮
        cy.go('back');
      }
    });
  });

  after(() => {
    // 在所有测试完成后，输出是否找到了中文字符
    if (foundChinese) {
      cy.log('页面中包含中文字符');
    } else {
      cy.log('页面中未找到中文字符');
    }
  });
});
