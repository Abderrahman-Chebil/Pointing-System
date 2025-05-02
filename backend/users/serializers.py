from rest_framework import serializers
from .models import Team, User, Notification, Settings, Planning, DailySchedule, Pointing, Justification, DemandMessage

from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "role", "date_joined", "is_active","is_manager","is_chief","picture", "birth_date","gender","job","phone","address","start_date","team", ]
        extra_kawrgs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        # password = validated_data.pop('password', None)
        # if password:
        #     instance.set_password(password)
        for attr, value in validated_data.items():
            # TODO: Add all the fileds that can be edited
            if attr in ['first_name', 'last_name', 'birst_date', 'is_chief']:
                setattr(instance, attr, value)

        instance.save()
        return instance
    
class AuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField(
        label=_("Email"),
        write_only=True
    )
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                email=email, password=password)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs

    

class ProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['picture']
    
    def upload(self, instance, validated_data):
        instance.picture = validated_data.get('picture', instance.picture)
        instance.save()
        return instance
    
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'
    
class PlanningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planning
        fields = '__all__'

class DailyScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySchedule
        fields = '__all__'

class PointingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pointing
        fields = '__all__'

class JustificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Justification
        fields = '__all__'
        
class DemandMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandMessage
        fields = '__all__'

class NotificatinoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class PointingUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Pointing
        fields = '__all__'
