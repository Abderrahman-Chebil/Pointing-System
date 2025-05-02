from django.contrib import admin
from .models import User,Notification, Team, Settings, Planning, DailySchedule, Pointing, Justification, DemandMessage


admin.site.register(Team)
admin.site.register(User)
admin.site.register(Notification)
admin.site.register(Settings)
admin.site.register(Planning)
admin.site.register(DailySchedule)
admin.site.register(Pointing)
admin.site.register(Justification)
admin.site.register(DemandMessage)

