import json
from rest_framework import serializers
from Recipes.models import Recipe
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Recipe, ShoppingList, example_ingredients, Review, Step
from accounts.models import User
  

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    for_recipe = serializers.CharField(source='for_recipe.id',read_only=True)

    class Meta:
        model = Review
        fields = ['user', 'for_recipe', 'review', 'rating', 'created']     
        read_only_fields = ['created', 'for_recipe']


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'step_number', 'description', 'image']


class RecipeSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source='owner.username', read_only=True)
    num_likes = serializers.ReadOnlyField() 
    #likes = serializers.PrimaryKeyRelatedField(many=True, read_only=True) 
    likes = serializers.SlugRelatedField(slug_field='username', read_only=True, many=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    avg_rating = serializers.ReadOnlyField()
    steps = StepSerializer(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'owner', 'description', 'set_of_diets', 
                  'cuisine','ingredients', 'servings', 'steps', 'likes', 'num_likes', 'reviews', 'avg_rating', 'time', 'image']

    def get_reviews(self, obj):
        reviews = obj.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data
 
    def create(self, validated_data):
        print(self.context['request'].data)
        ingredients_data = json.loads(self.context['request'].data.get('ingredients'))
        steps_data = json.loads(self.context['request'].data.get('steps'))
        print("\n")
        print(steps_data)
        print("\n\n\n")
        print(self.context['request'].FILES)
        validated_data['ingredients'] = ingredients_data
 
        recipe = Recipe.objects.create(**validated_data)

        for index, step_data in enumerate(steps_data):
            step = Step(recipe=recipe, description=step_data['value'], step_number = index)
            # Save the image for the step, if available
            image_key = f'step_image_{index}'
            if image_key in self.context['request'].FILES:
                step.image = self.context['request'].FILES[image_key]

            step.save()
        
        return recipe


class ShoppingListSerializer(serializers.ModelSerializer):
    owned_by = serializers.CharField(source='owner.username', read_only=True)
    class Meta:
        model = ShoppingList
        fields = ['id', 'owned_by', 'ingredients']


class ExampleIngredientsSerializer(serializers.ModelSerializer):        
    class Meta:
        model = example_ingredients
        fields = ['name']        


        