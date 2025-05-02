from django.db import models
from django.contrib.auth.models import AbstractUser
from . import managers
import os

class Team(models.Model):
    name = models.CharField(max_length=128, unique=True)
    description = models.TextField(null=True, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [('employee', 'Employee'), ('admin', 'Admin')]
    GENDER_CHOICES = [('F', 'Female'), ('M', 'Male')]
    JOB_CHOICES = [('teacher', 'Teacher'), ('Agent', 'Agent'), ('engineer', 'Engineer'), ('doctor', 'Doctor')]

    def get_upload_to(self, filename):
        return os.path.join('images', 'profile_pictures', str(self.pk), filename)
    
    DEFAULT_PICTURE = 'images/profile_pictures/default_profile_picture.jpg'

    email = models.EmailField(unique=True, max_length=254, verbose_name='email address')
    password = models.CharField(max_length=128, verbose_name='password')
    first_name = models.CharField(max_length=128, verbose_name='first name')
    last_name = models.CharField(max_length=128, verbose_name='last name')
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default='employee')
    is_manager = models.BooleanField(default=False)
    is_chief = models.BooleanField(default=False)
    picture = models.ImageField(upload_to=get_upload_to, default=DEFAULT_PICTURE)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    job = models.CharField(max_length=128, null=True, blank=True)
    phone = models.CharField(max_length=16, null=True, blank=True)
    address = models.CharField(max_length=256, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = managers.UserManager()    

class Notification(models.Model):
    NOTIFICATION_TYPES = [('message', 'Message'), ('alert', 'Alert')]
    type = models.CharField(max_length=32, choices=NOTIFICATION_TYPES)
    description = models.TextField()
    creation_date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.type
    
class Settings(models.Model):
    PLATFORM_NAME = models.CharField(max_length=128, default="MyPlatform")
    POINTING_QR_ENABLED = models.BooleanField(default=False)
    POINTING_FACE_RECOGNITION_ENABLED = models.BooleanField(default=False)
    POINTING_MANUAL_ENABLED = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.pk and Settings.objects.exists():
            raise ValueError("Only one Settings instance is allowed.")
        super().save(*args, **kwargs)
        
    def __str__(self):
        return "Settings"

class Planning(models.Model):
    DAY_CHOICES = [('monday', 'Monday'), ('tuesday', 'Tuesday'), ('wednesday', 'Wednesday'), ('thursday', 'Thursday'), ('friday', 'Friday'), ('saturday', 'Saturday'), ('sunday', 'Sunday')]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('user', 'day')
    
    def __str__(self):
        return f"{self.user} - {self.day} - {self.start_time} to {self.end_time}"

class DailySchedule(models.Model):
    STATES_CHOICES = [('pending', 'Pending'), ('pointed', 'Pointed'), ('absent', 'Absent'), ('justified', 'Justified')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    state = models.CharField(max_length=16, default='pending')
    late_penalty = models.IntegerField(default=0)
    early_penalty = models.IntegerField(default=0)
    location = models.CharField(max_length=255, null=True, blank=True)
    
    
    def __str__(self):
        return f"{self.user} - {self.date} - {self.start_time} to {self.end_time}"

class Pointing(models.Model):
    METHOD_CHOICES = [('qr', 'QR'), ('face_recognition', 'Face Recognition'), ('manual', 'Manual')]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    method = models.CharField(max_length=16, choices=METHOD_CHOICES)
    schedule = models.ForeignKey(DailySchedule, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=16, default='pending')
    
    def __str__(self):
        return f"{self.user} - {self.date} - {self.time}"

class Justification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    text = models.TextField(null=True, blank=True)
    picture = models.ImageField(upload_to='justifications/', null=True, blank=True)
    is_accepted = models.BooleanField(null=True, blank=False)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    
    def __str__(self):
        return f"{self.user} - {self.date} - {self.is_accepted}"
    


class DemandMessage(models.Model):
    title = models.CharField(max_length=512)
    content = models.TextField(blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    