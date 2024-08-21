from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from Recipes.serializers import RecipeSerializer, ShoppingListSerializer, ExampleIngredientsSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.generics import UpdateAPIView, RetrieveAPIView, ListAPIView, CreateAPIView, DestroyAPIView, GenericAPIView
from .models import Recipe, ShoppingList, example_ingredients, Review
from accounts.models import User
import json
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, JSONParser

class RecipeDetailsView(RetrieveAPIView):
    """
    Returns details of recipe with id <id>
    Method : GET
    Args : None
    """
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return get_object_or_404(Recipe, id=self.kwargs['id'])


class AllRecipesView(ListAPIView):
    """
    Returns All recipes that has been made as a list
    Method : GET
    Args : None
    """
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Recipe.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class MyRecipesView(ListAPIView):
    """
    Returns all recipes that has the user as it's owner
    Method : GET
    Args : None
    """
    
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.all().filter(owner=self.request.user)  
    
    
    """
    def get(self,request):
        user = get_object_or_404(User, id=request.user.id)
        refresh_token = request.data.get('refresh')
        
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.check_blacklist() 
             
            data = list(Recipe.objects.all())
            return Jso
        
        else:
            return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
    """
    


class EditRecipeView(UpdateAPIView):
    """
    Returns an edited recipe with the edited fields
    Method : POST
    Args : "name", "description", "set_of_diets", "cuisine", "ingredients", "servings", "steps", "time" (ALL OPTIONAL)
    Note : set of diets are a choice field and below are the choices, user must input either "ND", "DF", "GF", "LC" or "V"
        no_diet = "ND", ("No diet")
        dairy_free = "DF", ("Dairy Free")
        gluten_free = "GF", ("Gluten Free")
        low_carb = "LC", ("Low Carb")
        vegan = "V", ("Vegan")

           cuisine is also a choice field and below are the choices, user must input either "C", "MC", "J", "I", "INDO", "G", "AM", or "AF"
        chinese = "C", ("Chinese")
        middle_eastern = "MC", ("Middle Eastern")
        japanese = "J", ("Japanese")
        indian = "I", ("Indian")
        indonesian = "INDO", ("Indonesian")
        german = "G", ("German")
        american = "AM", ("American")
        african = "AF", ("African")
        
           ingredients is a JSON field and it will be a list of dictionaries
        format : [{"ingredient_name" : quantity}, {"ingredient_name" : quantity}]
        example : [{"flour" : 1}, {"green onion" : 2}, {"red onion" : 3}]
        
           steps is also a JSON field and it will be a list of strings
        format : ["step 1", "step 2"]
        example : ["put green onion in a plate", "cut them into small pieces"]
        
           name, description is just a charfield and servings, time is an integerfield. Time will always be in minutes so if a recipe cooking time is 1 hour,
           the user should enter 60 in the time field.
    """
    
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.all()
    permission_classes = [IsAuthenticated]
    
    
    def get_object(self):
        print("here")
        
        return get_object_or_404(Recipe, id=self.kwargs['id'])
    
    def update(self,request, *args, **kwargs):
        print("here")
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.check_blacklist() 
            serializer = self.get_serializer(self.get_object(), data=request.data, partial=True)
            if serializer.is_valid():
                self.perform_update(serializer)
                return Response(serializer.data)
        else:
            return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
        

class CreateRecipeView(CreateAPIView):
    """
    Returns a newly created recipe data
    Method : POST
    Args : "name", "description", "set_of_diets", "cuisine", "ingredients", "servings", "steps", "time" (set of diets and time is optional)
    Note : set of diets are a choice field and below are the choices, user must input either "ND", "DF", "GF", "LC" or "V"
        no_diet = "ND", ("No diet")
        dairy_free = "DF", ("Dairy Free")
        gluten_free = "GF", ("Gluten Free")
        low_carb = "LC", ("Low Carb")
        vegan = "V", ("Vegan")

           cuisine is also a choice field and below are the choices, user must input either "C", "MC", "J", "I", "INDO", "G", "AM", or "AF"
        chinese = "C", ("Chinese")
        middle_eastern = "MC", ("Middle Eastern")
        japanese = "J", ("Japanese")
        indian = "I", ("Indian")
        indonesian = "INDO", ("Indonesian")
        german = "G", ("German")
        american = "AM", ("American")
        african = "AF", ("African")
        
           ingredients is a JSON field and it will be a list of dictionaries
        format : [{"ingredient_name" : quantity}, {"ingredient_name" : quantity}]
        example : [{"flour" : 1}, {"green onion" : 2}, {"red onion" : 3}]
        
           steps is also a JSON field and it will be a list of strings
        format : ["step 1", "step 2"]
        example : ["put green onion in a plate", "cut them into small pieces"]
        
           name, description is just a charfield and servings, time is an integerfield. Time will always be in minutes so if a recipe cooking time is 1 hour,
           the user should enter 60 in the time field.
    
    """
    
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser] 


    def create(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner = self.request.user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
        
    
    
class CreateBasedRecipeView(GenericAPIView):
    """
    Returns the data of the newly created recipe by using another recipe as a base
    Method : POST
    Args : "recipe_name"
    Note : recipe name is the name of the recipe you would want to use as a base, it has to be the EXACT same name
    """
    
    
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        count = 0
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.check_blacklist() 
            
            recipe_name = request.data.get('recipe_name')
            
            if not recipe_name:
                return Response({'error': 'Recipe name is required.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                recipe_object = Recipe.objects.get(name__iexact=recipe_name)
            except Recipe.DoesNotExist:
                return Response({'error': f"No recipe found with name '{recipe_name}'."}, status=status.HTTP_404_NOT_FOUND)
            
            queryset = Recipe.objects.filter(name=recipe_name)
            
            data = {
                'name' : queryset.get().name,
                'description': queryset.get().description,
                'set_of_diets': queryset.get().set_of_diets,
                'cuisine': queryset.get().cuisine,
                'ingredients' : queryset.get().ingredients,
                'servings': queryset.get().servings,
                'steps': queryset.get().steps,
                'time': queryset.get().time
            }
            
            serializer = self.serializer_class(data=data)
            
            
            if serializer.is_valid():
                self.perform_create(serializer)
                recipe_object = serializer.save()
                
                data = {
                    'recipe_id': recipe_object.id,
                    'name': recipe_object.name,
                    'owner': recipe_object.owner.username,
                    'description': recipe_object.description,
                    'set_of_diets': recipe_object.set_of_diets,
                    'cuisine': recipe_object.cuisine,
                    'ingredients' : recipe_object.ingredients,
                    'servings': recipe_object.servings,
                    'steps': recipe_object.steps,
                    'time': recipe_object.time
                }
                return Response(data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        return serializer.save(owner=self.request.user)
        

class DeleteRecipeView(DestroyAPIView):
    """
    Delete a recipe based on its id
    Method : DELETE
    Args : Just the recipe id on the URL
    
    """
    
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.all()
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
        """
        token = RefreshToken(refresh_token)
        token.check_blacklist()
        
        refresh_token = request.data.get('refresh')
        if refresh_token:
        else:
            return Response({'error': 'User Not Authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        """

class RecipeLikesView(UpdateAPIView):
    serializer_class = RecipeSerializer
    """
    Like the recipe with id <id>
    Method: PUT
    Args: The recipe id in the url
    """



    def update(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.check_blacklist() 
            recipe = Recipe.objects.get(id=self.kwargs['id'])
            recipe.likes.add(self.request.user)
            recipe.save()
            return Response("Recipe Liked", status=status.HTTP_200_OK)
        else :
            return Response({'error': 'User Not Authenticated'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        return Recipe.objects.all()


class RecipeUnlikesView(UpdateAPIView):
    serializer_class = RecipeSerializer
    """
    Unlike a liked recipe with id <id>
    Method: PUT
    Args: The recipe id in the url
    """
    
    
    def update(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            print(self.kwargs['id'])
            print("here")
            token = RefreshToken(refresh_token)
            token.check_blacklist() 
            recipe = Recipe.objects.get(id=self.kwargs['id'])
            if recipe.likes.filter(username=self.request.user.username).exists():
                recipe.likes.remove(self.request.user)
                recipe.save()
            else:
                return Response({'error': 'recipe not liked yet'}, status=status.HTTP_400_BAD_REQUEST)
            return Response("Recipe Unliked", status=status.HTTP_200_OK)
        else :
            return Response({'error': 'User Not Authenticated'}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return Recipe.objects.all() 


class CreateReview(CreateAPIView):
    """
    Create a review for the recipe with id <id>
    Method: POST
    Arguments:
    - review: a text review of the recipe (optional)
    - rating: an integer rating from 1 to 5
    - the recipe id provided in the url
    """

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if Review.objects.filter(for_recipe=self.kwargs['id'], user=self.request.user).exists():
            return Response({'result': 'already added a review'}, status=status.HTTP_400_BAD_REQUEST)
        review = serializer.validated_data.get('review')
        rating = serializer.validated_data.get('rating')
        recipe = Recipe.objects.get(id = self.kwargs['id'])
        return serializer.save(user=self.request.user, review=review,
                               for_recipe = recipe, rating = rating) 


class EditReview(UpdateAPIView):
    """
    Edit an already written review for the recipe with id <id>
    Method: PUT
    Arguments: review, rating, id
    Note: The only mandantory argument is the recipe id in the url
    """

    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Review, for_recipe=self.kwargs['id'], user=self.request.user)


    def update(self, request, *args, **kwargs):
        #if not Review.objects.filter(user = self.request.user).exists():
            #return Response({'error': 'User has not yet created a review for this recipe.'})
        serializer = self.get_serializer(self.get_object(), data=request.data, partial = True)
        print("here")
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)


class DeleteReview(DestroyAPIView):
    """
    Delete the current user's review for recipe with id <id>
    Method: DELETE
    Arguments: The recipe id in the url
    """
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        get_object_or_404(Review, user=self.request.user).delete()
        return Response({'result': 'The review has been deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)



class ViewReviews(ListAPIView):
    """
    View all the reviews for the recipe with id <id>
    Method: GET
    Arguments: The recipe id in the url
    """

    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Review.objects.all().filter(for_recipe=self.kwargs['id'])
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ServingsView(UpdateAPIView):
    """
    Returns a list of ingredients with updated quantity based on the new servings
    Method : PATCH
    Args : "servings"
    Note : servings is an integer and cannot be negative
    
    """
    
    
    serializer_class = RecipeSerializer
    
    def update(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.check_blacklist() 
            recipe = Recipe.objects.get(id=self.kwargs['id'])
            
            
            new_servings = request.data.get('servings')
            
            if new_servings is None:
                return Response({'error': 'The "servings" parameter is missing.'})
            try:
                new_servings = int(new_servings)
            except ValueError:
                return Response({'error': 'The "servings" parameter is not a valid integer.'})
            
            ingredients_copy = recipe.ingredients
            
            if not ingredients_copy:
                return Response({'error': 'The recipe has no ingredients.'})
            
            modified_data = []
            
            for obj in ingredients_copy:
                if isinstance(obj, dict):
                    obj = json.dumps(obj)
                data = json.loads(obj)
                data["quantity"] = data["quantity"] * new_servings / recipe.servings 
                modified_data.append(data)
                
            return Response(modified_data)
        else:
            return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    def get_queryset(self):
        return Recipe.objects.all() 
        
class AddToShoppingListView(APIView):
    
    """
    Returns a list of ingredients with the total amount of quantity
    Method : POST
    Args : "recipe_name"
    
    """
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ShoppingListSerializer

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.check_blacklist()
            except Exception:
                return Response({'error': 'User Not Authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'User Not Authenticated'}, status=status.HTTP_400_BAD_REQUEST)

        recipe_name = request.data.get('recipe_name')
        recipe = get_object_or_404(Recipe, name=recipe_name)
        recipe_ingredients = recipe.ingredients

        try:
            shopping_list = ShoppingList.objects.get(owned_by=request.user)
            for recipe_ingredient in recipe_ingredients:
                found = False
                for shopping_list_ingredient in shopping_list.ingredients:
                    if recipe_ingredient['name'] == shopping_list_ingredient['name']:
                        shopping_list_ingredient['quantity'] += recipe_ingredient['quantity']
                        found = True
                        break
                if not found:
                    shopping_list.ingredients.append(recipe_ingredient)
            shopping_list.save()
        except ShoppingList.DoesNotExist:
            shopping_list = ShoppingList(owned_by=request.user, ingredients=recipe_ingredients)
            shopping_list.save()

        serializer = self.serializer_class(shopping_list)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetShoppingListView(APIView):
    
    """
    Returns a list of ingredients with the total amount of quantity
    Method : GET
    Args : None, just refresh token
    
    """
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ShoppingListSerializer

    def get(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.check_blacklist()
            except Exception:
                return Response({'error': 'User Not Authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'User Not Authenticated'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shopping_list = ShoppingList.objects.get(owned_by=request.user)
            serializer = self.serializer_class(shopping_list)
            return Response(serializer.data, status.HTTP_200_OK)
        except ShoppingList.DoesNotExist:
            return Response({'error': 'Shopping list not found.'}, status=status.HTTP_404_NOT_FOUND)

class RecipeSearchView(ListAPIView):
    
    """
    Returns a list of recipes according to the search attributes
    Method : GET
    Args : Any field from a recipe such as "name", "ingredients_name", "owner_username"
    
    """
    
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'ingredients__name', 'owner__username']
    ordering_fields = ['rating', "likes"]
    ordering = ['-rating', "-likes"]

    def get_queryset(self):
        queryset = Recipe.objects.all()
        name = self.request.data.get('name')
        cuisine = self.request.data.get('cuisine')
        diets = self.request.data.get('diets')
        time = self.request.data.get('time')
        
        if name:
            queryset = queryset.filter(name__icontains=name)
        if cuisine:
            queryset = queryset.filter(cuisine__icontains=cuisine)
        if diets:
            queryset = queryset.filter(set_of_diets__icontains=diets)
        if time:
            queryset = queryset.filter(time__lte=time)
        
        queryset = self.filter_queryset(queryset)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class IngredientsAutoCompleteView(ListAPIView):
    
    """
    Returns a list of ingredients that contains the user input
    Method : GET
    Args : "input"
    Note : input can be any name of incomplete ingredients, but for the sake of the DEMO, the choices are only
           ('green onion', 'Green Onion'),
           ('red onion', 'Red Onion'),
           ('butter', 'Butter'),
           ('garlic', 'Garlic')
           
    Example : "input" : "on" , output will return red onion and green onion
    
    """
    
    serializer_class = ExampleIngredientsSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        refresh_token = self.request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.check_blacklist() 
            
            Ingredient_choices = [
                ('green onion', 'Green Onion'),
                ('red onion', 'Red Onion'),
                ('butter', 'Butter'),
                ('garlic', 'Garlic'),
                ('hot water', 'Hot Water'),
                ('sugar', 'Sugar'),
                ('instant coffee powder', 'Instant Coffee Powder'),
                ('milk', 'Milk'),
                ('ice', 'Ice'),
                ('salt', 'Salt'),
                ('olive oil', 'Olive Oil'),
                ('unsalted butter', 'Unsalted Butter'),
                ('black pepper', 'Black Pepper'),
                ('grated parmesan cheese', 'Grated Parmesan Cheese'),
                ('garam masala', 'Garam Masala'),
                ('lemon juice','Lemon Juice'),
                ('plain yogurt', 'Plain Yogurt'),
                ('turkey drumsticks', 'Turkey Drumsticks'),
                ('turkey thighs', 'Turkey Thighs'),
                ('garlic salt', 'Garlic Salt'),
                ('bunch kale about 6 cups, loosely packed', 'Bunch Kale About 6 Cups, Loosely Packed'),
                ('hot dogs', 'Hot Dogs'),
                ('hot dog buns', 'Hot Dog Buns'),
                ('chocolate chip chunks','Chocolate Chip Chunks'),
                ('walnuts','Walnuts'),
                ('brown sugar','Brown Sugar'),
                ('vanilla','Vanilla'),
                ('bananas', 'Bananas')
            ]
            
            if example_ingredients.objects.count() == 0:
                for choice in Ingredient_choices:
                    obj = example_ingredients(name=choice[0])
                    obj.save()
        
            uncomplete_input = self.request.data.get("input")
            
            if not uncomplete_input:
                return example_ingredients.objects.none()
            
            ingredients = example_ingredients.objects.filter(name__icontains=uncomplete_input.lower())
            return (ingredients)
        
        else :
            return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)










    