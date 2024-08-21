from django.urls import path
from Recipes.views import *

urlpatterns = [
    path('add/', CreateRecipeView.as_view()),
    path('<int:id>/delete/', DeleteRecipeView.as_view()),
    path('all/', AllRecipesView.as_view()),
    path('myrecipes/', MyRecipesView.as_view()),
    path('<int:id>/edit/', EditRecipeView.as_view()),
    path('<int:id>/', RecipeDetailsView.as_view()),
    path('<int:id>/like/', RecipeLikesView.as_view()),
    path('<int:id>/unlike/', RecipeUnlikesView.as_view()),
    path('search/', RecipeSearchView.as_view()),
    path('<int:id>/servings/', ServingsView.as_view()),
    path('shoppinglist/add/', AddToShoppingListView.as_view()),
    path('shoppinglist/view/', GetShoppingListView.as_view()),
    path('<int:id>/addreview/', CreateReview.as_view()),
    path('<int:id>/reviews/', ViewReviews.as_view()),
    path('<int:id>/editreview/', EditReview.as_view()),
    path('<int:id>/deletereview/', DeleteReview.as_view()),
    path('autocomplete/', IngredientsAutoCompleteView.as_view())
]
