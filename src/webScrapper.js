const $ = require('cheerio');
const { getPage } = require('./utils');
const { saveToJSON, saveToCSV } = require('./fileSaver');
const { getTopLevelTaxonomies, getLowestLevelTaxonomies } = require('./reader');

const rootUrl = 'https://www.boardshop.lt/';
const topCategorySelector = 'li.category > a'; // must be an 'a' tag, otherwise, the algorythm needs to be modified
const getSubCategorySelector = (catId) => `.sub-categories.category-${catId} > ul > li > a`; // must be an 'a' tag, otherwise, the algorythm needs to be modified
const productTitleSelector = 'div.product-thumb div.caption > h4 > a';


const scrapTaxonomy = async () => {
  const pageResult = await getPage(rootUrl);
  const { data } = pageResult;

  const categories = [];
  const categoryLinks = $(topCategorySelector, data);

  for (let i = 0; i < categoryLinks.length; i++) {
    const cat = categoryLinks[i];
    const catId = i + 1;

    const subCategories = [];
    const subCategoryLinks = $(getSubCategorySelector(catId), data);

    for (let i = 0; i < subCategoryLinks.length; i++) {
      const subCat = subCategoryLinks[i];
      subCategories.push({
        id: categories.reduce((acc, value) => acc + value.children.length, 0) + subCategories.length + 1,
        parentId: catId,
        title: subCat.children[2].data,
        url: subCat.attribs.href
      });
    };

    categories.push({
      id: catId,
      title: cat.children[0].data,
      url: cat.attribs.href,
      children: subCategories
    });
  };

  return categories;
};

const scrapSubcategoryProducts = async (subcategory) => {
  const limit = 100;

  
  const products = [];
  let lastPageReached = false;
  let page = 1;


  while (!lastPageReached) {
    const pageResult = await getPage(subcategory.url, { limit, page });
    const { data } = pageResult;

    const productLinks = $(productTitleSelector, data);

    for (let i = 0; i < productLinks.length; i++) {
      const productLink = productLinks[i];

      products.push({
        subcategoryId: subcategory.id,
        title: productLink.children[0].data,
        url: productLink.attribs.href
      });
    };

    page += 1;
    lastPageReached = productLinks.length === 0;
  }

  return products;
};

const scrapProducts = async (subcategories) => {
  const products = await Promise.all(subcategories.map(subcategory => {
    return scrapSubcategoryProducts(subcategory);
  }));
  return products.reduce((acc, value) => [...acc, ...value], []);
};

const scrapWebsite = async () => {
  const taxonomy = await scrapTaxonomy();
  saveToJSON('taxonomy', taxonomy);

  const categories = await getTopLevelTaxonomies();
  const subcategories = await getLowestLevelTaxonomies();
  const products = await scrapProducts(subcategories);

  saveToJSON('categories', categories);
  saveToJSON('subcategories', subcategories);
  saveToJSON('products', products);
  await saveToCSV('categories', categories);
  await saveToCSV('subcategories', subcategories);
  await saveToCSV('products', products);
  return taxonomy;
};

module.exports = {
  scrapWebsite
};
