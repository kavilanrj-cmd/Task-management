from django.db import models

class Todo(models.Model):

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    title = models.CharField(max_length=120)
    description = models.CharField(max_length=500)
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default="medium"
    )
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title