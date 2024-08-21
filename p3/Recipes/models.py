import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from accounts.models import User
from django import forms
from django.core.validators import MinValueValidator, MaxValueValidator
from django.apps import apps
# Create your models here.



class Recipe(models.Model):
    class Diets(models.TextChoices):
        no_diet = "ND", ("No diet")
        dairy_free = "DF", ("Dairy Free")
        gluten_free = "GF", ("Gluten Free")
        low_carb = "LC", ("Low Carb")
        vegan = "V", ("Vegan")
    
    class Cuisine(models.TextChoices):
        chinese = "C", ("Chinese")
        middle_eastern = "MC", ("Middle Eastern")
        japanese = "J", ("Japanese")
        indian = "I", ("Indian")
        indonesian = "INDO", ("Indonesian")
        german = "G", ("German")
        american = "AM", ("American")
        african = "AF", ("African")


    owner = models.ForeignKey(to=User, on_delete=models.CASCADE, null=True, related_name='accounts' )   
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to='recipe_images/', null=True, blank=True)
    description = models.CharField(max_length=99999)
    set_of_diets = models.CharField(max_length= 30, choices = Diets.choices, default = Diets.no_diet)
    cuisine = models.CharField(choices=Cuisine.choices, max_length=100)
    ingredients = models.JSONField()
    servings = models.IntegerField()
    
    likes = models.ManyToManyField(User)   
    rating = models.IntegerField(null=True, blank=True)
    time = models.IntegerField(null=True, blank=True)
    
    @property
    def avg_rating(self):
        Review = apps.get_model('Recipes', 'Review')
        ratings = Review.objects.all().filter(for_recipe=self.id)
        num = ratings.count()
        total = 0
        for r in ratings:
            total += r.rating
        
        return total / num if num > 0 else 0

    @property
    def reviews(self):
        Review = apps.get_model('Recipes', 'Review')
        a = Review.objects.all().filter(for_recipe=self.id)
        return a

    @property
    def num_likes(self):
        return self.likes.count()


def step_image_upload_path(instance, filename):
   
    recipe_id = instance.recipe.id
    folder = f'recipe_{recipe_id}/step_images/'
    _, ext = os.path.splitext(filename)
    filename = f'step_{instance.step_number}{ext}'
    return os.path.join(folder, filename)


class Step(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    description = models.TextField()
    image = models.ImageField(upload_to=step_image_upload_path, null=True, blank=True)
    step_number = models.IntegerField()

    class Meta:
        ordering = ['step_number']



def default_ingredients():
        return ["green onion", "red onion", "butter", "garlic"]


class example_ingredients(models.Model):
        
    name = models.JSONField(default=default_ingredients)
    
    def __str__(self):
        return self.name


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    for_recipe = models.ForeignKey(Recipe, on_delete=models.DO_NOTHING)
    review = models.CharField(null=True, max_length=100)
    rating = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    created = models.DateTimeField(auto_now_add=True)


class ShoppingList(models.Model):
    owned_by = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    ingredients = models.JSONField()
