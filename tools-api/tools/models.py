from django.db import models


class Tool(models.Model):
    label = models.CharField(max_length=80)
    description = models.TextField()
    image_url = models.ImageField(upload_to='tools', blank=True, null=True)
    in_stock = models.IntegerField()
    price = models.DecimalField(decimal_places=2, max_digits=6, default=0)

    @property
    def available(self):
        return self.in_stock - self.booking_set.count()

    def __str__(self) -> str:
        return self.label
