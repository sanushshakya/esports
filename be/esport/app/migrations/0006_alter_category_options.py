# Generated by Django 5.1.4 on 2024-12-16 09:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0005_category_product_order_gift"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="category",
            options={"verbose_name": "Category", "verbose_name_plural": "Categories"},
        ),
    ]
