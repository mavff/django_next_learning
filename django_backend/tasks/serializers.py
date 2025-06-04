from rest_framework import serializers
from .models import Task, Comment, Tag
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'user']
        read_only_fields = ['id', 'user']
        
class TaskSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, source='tags'
    )
    class Meta:
        model = Task
        fields = ['id', 'name', 'done', 'user', 'tags', 'tag_ids','due_date', 'description', 'created_at']
        read_only_fields = ['id', 'user', 'tags']
        
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'user', 'task', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'task', 'created_at']
