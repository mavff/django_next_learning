# Generated by Django 5.2.1 on 2025-06-01 18:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_tag_comment_task_tags'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='title',
            new_name='name',
        ),
    ]
