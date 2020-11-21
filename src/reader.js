
const getTaxonomy = () => {
  const taxonomy = require('../results/taxonomy.json');
  return taxonomy;
};

const getTopLevelTaxonomies = () => {
  return getTaxonomy().map((cat) => {
    const { children, ...rest } = cat;
    return rest;
  }, []);
};


const getLowestLevelTaxonomies = () => {
  // since the taxonomy is only 2-level, were not doing a recursive algorythm for this
  return getTaxonomy().reduce((acc, value) => {
    return [...acc, ...value.children];
  }, []);
};

const getCategories = () => {
  try {
    const categories = require('../results/categories.json');
    return categories;
  } catch (e) {
    return undefined;
  }
};

const getSubCategories = () => {
  const categories = getCategories();

  if (!categories) return undefined;

  try {
    const subcategories = require('../results/subcategories.json');
    return subcategories.map((subcat) => ({
      id: subcat.id,
      title: subcat.title,
      categoryId: subcat.parentId,
      categoryTitle: categories.find(cat => cat.id === subcat.parentId).title,
      url: subcat.url
    }));
  } catch (e) {
    return undefined;
  }
};

const getProducts = () => {
  const categories = getCategories();
  const subcategories = getSubCategories();

  if (!categories || !subcategories) return undefined;

  try {
    const products = require('../results/products.json');
    return products.map((product) => {
      const subcategory = subcategories.find(subcat => subcat.id === product.subcategoryId);
      const category = categories.find(cat => cat.id === subcategory.categoryId);

      return {
        title: product.title,
        subcategoryId: subcategory.id,
        subcategoryTitle: subcategory.title,
        categoryTitle: category.title,
        url: product.url
      };
    });
  } catch (e) {
    return undefined;
  }
}

module.exports = {
  getTaxonomy,
  getTopLevelTaxonomies,
  getLowestLevelTaxonomies,
  getCategories,
  getSubCategories,
  getProducts
};