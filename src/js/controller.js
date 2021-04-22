import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

//support by old browsers
import 'core-js/stable'; // for polyfilling everything else
import 'regenerator-runtime/runtime'; // for polyfilling async/await

// for parcel
/* if (module.hot) {
	module.hot.accept();
}
 */
const controlRecipes = async function(){
	try {
		const id = window.location.hash.slice(1);
		
		if (!id) return;
		recipeView.renderSpinner();

		// 1) Loading recipe
		await model.loadRecipe(id);

		// 2) Rendering recipe
		recipeView.render(model.state.recipe);

		// Test 
		//controlServings();

	} catch(err) {
		recipeView.renderError();
	}
};

const conrolSearchResult = async function() {
	try {
		resultsView.renderSpinner();

		// 1) Get search query
		const query = searchView.getQuery();
		if (!query) return;

		// 2) Load search results
		await model.loadSearchResult(query);

		// 3) Render results
		//resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultPage());

		// 4) Render initial pagination buttons
		paginationView.render(model.state.search);

	} catch(err) {
		//recipeView.renderError();
		console.log(err);
	}
};

const controlPagination = function(goToPage) {
	// 1) Render NEW results
	resultsView.render(model.getSearchResultPage(goToPage));

	// 2) Render NEW pagination buttons
	paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
	//update the recipe servings (in state)
	model.updateServings(newServings);

	// update the recipe view
	//recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const init = function(){
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.addHandlerSearch(conrolSearchResult);
	paginationView.addHandlerClick(controlPagination);	
};
init();


