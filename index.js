const prompt = require('prompt-sync')();
const { scrapWebsite } = require('./src/webScrapper');
const { getCategories, getSubCategories, getProducts } = require('./src/reader');

const represent = {
  intro: () => {
    console.log('This is a web crawler built for an e-commerce website:');
    console.log('https://www.boardshop.lt/');
    console.log('Author: Justas Antanaitis');
    console.log('');
  },
  preInput: () => {
    console.log('');
    console.log('Choose an operation you want to perform:');
  },
  menu: () => {
    console.log('[1] Crawl the website');
    console.log('[2] Show categories');
    console.log('[3] Show subcategories');
    console.log('[4] Show products');
    console.log('Type /q to exit');
  },
  categories: () => {
    const categories = getCategories();

    console.log('');
    if (!categories) {
      console.log('No categories found, you probably need to crawl the website first.');
      return;
    }

    console.log('CATEGORIES:');
    console.table(categories); 
  },
  subcategories: () => {
    const subcategories = getSubCategories();

    console.log('');
    if (!subcategories) {
      console.log('No subcategories found, you probably need to crawl the website first.');
      return;
    }

    console.log('SUBCATEGORIES:');
    console.table(subcategories); 
  },
  products: () => {
    const products = getProducts();

    console.log('');
    if (!products) {
      console.log('No products found, you probably need to crawl the website first.');
      return;
    }

    console.log('PRODUCTS:');
    console.table(products); 
  }
};

(async () => {
  represent.intro();

  while (true) {
    represent.preInput();
    represent.menu();
    const input = prompt('Operation: ');
    if (input === '/q') {
      break;
    }

    switch(input) {
      case '1': {
        console.log('');
        console.log(`Scrapping https://www.boardshop.lt/`);
        console.log('...');
        const taxonomy = await scrapWebsite();

        if (taxonomy) {
          console.log('... DONE');
          console.log('');
          console.log('You can now explore the results via the application or by exploring the results directory. The results are saved in both json and csv formats.');
        }
        break;
      }
      case '2': {
        represent.categories();
        break;
      }
      case '3': {
        represent.subcategories();
        break;
      }
      case '4': {
        represent.products();
        break;
      }
      default: {
        console.log('');
        console.log('Invalid operation.');
        break;
      }
    }
  }

})();
