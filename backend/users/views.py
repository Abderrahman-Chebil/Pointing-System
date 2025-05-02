import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import FormParser, MultiPartParser
from django.http import HttpResponse
from django.conf import settings
from rest_framework import parsers, renderers, status
from users.permissions import IsAdmin, IsChief, IsEmployee, IsManager, IsManagerOrChief
from .serializers import AuthTokenSerializer, DailyScheduleSerializer, JustificationSerializer, PlanningSerializer, PointingSerializer, PointingUserSerializer, SettingsSerializer, TeamSerializer
from .serializers import UserSerializer, ProfilePictureSerializer, NotificationSerializer, DemandMessageSerializer
import jwt, datetime
from .models import DailySchedule, Justification, Planning, Pointing, Team, User, Notification,DemandMessage,Settings
from .custom_renderers import ImageRenderer
from rest_framework import generics
from . import tools
import tempfile


class Login(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            token = jwt.encode({
                'email': serializer.validated_data['email'],
                'iat': datetime.datetime.utcnow(),
                'nbf': datetime.datetime.utcnow() + datetime.timedelta(minutes=-5),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=5)
            }, settings.SECRET_KEY, algorithm='HS256')
            user = User.objects.filter(email=serializer.validated_data['email']).first()
            return Response({'token': token, 'role': user.role, 'is_manager': user.is_manager, 'is_chief': user.is_chief})
        user = User.objects.filter(email=request.data['email']).first()
        if user:
            if not user.is_active:
                return Response({'error': 'You need to verify your email'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ManageUsersView(APIView): 
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Username is required'}, status=400)

        # Check if the username is already a valid email
        if '@' not in username:
            request.data['email'] = '@'.join([username, f'{settings.APP_EMAIL_SUFFIX}.com'])
        else:
            request.data['email'] = username  # Use the provided email as is

        raw_password = tools.generate_password()  # Generate the password
        request.data['password'] = raw_password
        request.data['is_active'] = True

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            instance = serializer.save()
            instance.set_password(raw_password)  # Hash the password
            instance.save()  # Save the hashed password to the database

        return Response({"email": request.data["email"], "message": 'A user has been created successfully'}, status=200)
    permission_classes = [IsAuthenticated, IsAdmin]


    
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(instance=users, many=True)
        return Response(data=serializer.data)
    
    def put(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'User ID is required'}, status=400)
        user = User.objects.filter(id=id).first()
        if not user:
            return Response({'error': 'User not found'}, status=400)
        serializer = UserSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(data={**serializer.data, "message": 'User updated successfully'}, status=200)

    def delete(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'User ID is required'}, status=400)
        user = User.objects.filter(id=id).first()
        if not user:
            return Response({'error': 'User not found'}, status=400)
        user.is_active = False
        user.delete()
        return Response(data={'message': 'User deleted successfully'}, status=200)

class FreezeUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    def post(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'User ID is required'}, status=400)
        user = User.objects.filter(id=id).first()
        if not user:
            return Response({'error': 'User not found'}, status=400)
        if user.is_active == False:
            return Response({'error': 'User is already frozen'}, status=400)
        user.is_active = False
        user.save()
        return Response(data={'message': 'User frozen successfully'}, status=200)
    
    def delete(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'User ID is required'}, status=400)
        user = User.objects.filter(id=id).first()
        if not user:
            return Response({'error': 'User not found'}, status=400)
        if user.is_active == True:
            return Response({'error': 'User is already unfrozen'}, status=400)
        user.is_active = True
        user.save()
        return Response(data={'message': 'User unfrozen successfully'}, status=200)
            

class ManageTeamView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    def post(self, request):
        name = request.data.get('name')
        if not name:
            return Response({'error': 'Team name is required'}, status=400)
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(data={'message': 'Team created successfully'}, status=200)
    
    def get(self, request):
        teams = Team.objects.all()
        serializer = TeamSerializer(instance=teams, many=True)
        return Response(data=serializer.data)
    
    def put(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Team ID is required'}, status=400)
        team = Team.objects.filter(id=id).first()
        if not team:
            return Response({'error': 'Team not found'}, status=400)
        serializer = TeamSerializer(instance=team, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(data={**serializer.data, "message": 'Team updated successfully'}, status=200)
    
    def delete(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Team ID is required'}, status=400)
        team = Team.objects.filter(id=id).first()
        if not team:
            return Response({'error': 'Team not found'}, status=400)
        team.delete()
        return Response(data={'message': 'Team deleted successfully'}, status=200)

class ChangeTeamView(APIView):
    def post(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'User ID is required'}, status=400)
        user = User.objects.filter(id=id).first()
        if not user:
            return Response({'error': 'User not found'}, status=400)
        team = request.data.get('team')
        if not team:
            return Response({'error': 'Team ID is required'}, status=400)
        team = Team.objects.filter(id=team).first()
        if not team:
            return Response({'error': 'Team not found'}, status=400)
        user.team = team
        user.save()
        return Response(data={'message': 'User team changed successfully'}, status=200)


class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        user_data = UserSerializer(instance=user).data
        return Response(data=user_data)


class OthersProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        user = User.objects.filter(id=id).first()
        if not user:
            return Response({'error': 'User not found'}, status=400)
        
        user_data = UserSerializer(instance=user).data
        data = dict(email=user_data['email'], first_name=user_data['first_name'], last_name=user_data['last_name'], role=user_data['role'], is_manager=user_data['is_manager'], is_chief=user_data['is_chief'])
        
        return Response(data=data)


class MyPlanningView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]
    def get(self, request):
        user = request.user
        planning = Planning.objects.filter(user=user)
        serializer = PlanningSerializer(instance=planning, many=True)
        return Response(data=serializer.data)

class MyDailyScheduleView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]
    
    def get(self, request):
        user = request.user
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        schedule_state = request.query_params.get('state')
        location = request.query_params.get('location')
        if location:
            daily_schedule = DailySchedule.objects.filter(user=user, location=location)
        else:
            daily_schedule = DailySchedule.objects.filter(user=user)        
        # Initialize queryset with user filter
        daily_schedule = DailySchedule.objects.filter(user=user)
        
        # Date range filtering
        if start_date and end_date:
            try:
                # Validate date formats
                from django.utils.dateparse import parse_date
                start_date = parse_date(start_date)
                end_date = parse_date(end_date)
                if not start_date or not end_date:
                    raise ValueError("Invalid date format")
                
                # Apply date range filter
                daily_schedule = daily_schedule.filter(
                    date__gte=start_date,
                    date__lte=end_date
                )
            except (ValueError, TypeError) as e:
                return Response(
                    {"error": "Invalid date format. Use YYYY-MM-DD"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # State filtering
        if schedule_state and schedule_state.lower() != 'all':
            daily_schedule = daily_schedule.filter(status=schedule_state.lower())
        
        serializer = DailyScheduleSerializer(daily_schedule, many=True)
        return Response(serializer.data)
class MyPointingView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        pointing_method = request.query_params.get('method')
        status = request.query_params.get('status')

        if status:
            filters['status'] = status
        
        filters = {}
        if start_date and end_date:
            filters['date'] = [start_date, end_date]
        if pointing_method:
            filters['method'] = pointing_method
        
        user = request.user
        pointing = Pointing.objects.filter(user=user)
        serializer = PointingUserSerializer(instance=pointing, many=True)
        return Response(data=serializer.data)


class ConsultOthersPlanningView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrChief]
    def get(self, request, id):
        user = User.objects.filter(id=id).first()
        if not user:
            return Response({'error': 'User not found'}, status=400)
        planning = Planning.objects.filter(user=user)
        serializer = PlanningSerializer(instance=planning, many=True)
        return Response(data=serializer.data)


class ConsultOthersDailyScheduleView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrChief]
    def get(self, request, id):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        schedule_state = request.query_params.get('state')
        
        filters = {}
        if start_date and end_date:
            filters['date'] = [start_date, end_date]
        if schedule_state:
            filters['state'] = schedule_state
            
        daily_schedule = DailySchedule.objects.filter(user=id, **filters)
        serializer = DailyScheduleSerializer(instance=daily_schedule, many=True)
        return Response(data=serializer.data)

class ConsultDailyScheduleView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrChief]
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        schedule_state = request.query_params.get('state')
        
        filters = {}
        if start_date and end_date:
            filters['date'] = [start_date, end_date]
        if schedule_state:
            filters['state'] = schedule_state
            
        daily_schedule = DailySchedule.objects.filter(**filters)
        serializer = DailyScheduleSerializer(instance=daily_schedule, many=True)
        return Response(data=serializer.data)




class DemandMessageView(APIView):
    permission_classes = [IsAuthenticated, IsChief]
    def post(self, request):
        request.data['is_accepted'] = None
        request.data['user'] = request.user.id
        serializer = DemandMessageSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response({'message': 'Demand message sent successfully', **serializer.data}, status=200)
    
    def get(self, request):
        messages = DemandMessage.objects.filter(user=request.user)
        serializer = DemandMessageSerializer(instance=messages, many=True)
        return Response(data=serializer.data)
    

class ManageDemandMessageView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Message ID is required'}, status=400)
        message = DemandMessage.objects.filter(id=id).first()
        if not message:
            return Response({'error': 'Message not found'}, status=400)
        message.is_accepted = True
        message.save()
        return Response(data={"message": 'Message accepted successfully'}, status=200)
    
    def delete(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Message ID is required'}, status=400)
        message = DemandMessage.objects.filter(id=id).first()
        if not message:
            return Response({'error': 'Message not found'}, status=400)
        message.is_accepted = False
        message.save()
        return Response(data={"message": 'Message rejected successfully'}, status=200)
    
    def get(self, request):
        messages = DemandMessage.objects.all()
        serializer = DemandMessageSerializer(instance=messages, many=True)
        return Response(data=serializer.data)

class ManagePointingSettings(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    def post(self, request):
        try:
            settings = Settings.objects.get()
        except Settings.DoesNotExist:
            Settings().save()
            settings = Settings.objects.get()
        
        serializer = SettingsSerializer(settings, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Settings updated successfully.', ** serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetPointingSettings(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            settings = Settings.objects.get()
        except Settings.DoesNotExist:
            return Response({'error': 'Settings not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CheckSystemSanity(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    def post(self, request):
        
        return Response({
            'sanity_percentage': 95,
            'message': 'System is running smoothly',
            'problems': [
                {
                    'type': 'warning',
                    'message': 'Low disk space on server',
                }
            ]
        })

class JustificationView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]
    def get(self, request):
        justifications = Justification.objects.filter(user=request.user)
        serializer = JustificationSerializer(instance=justifications, many=True)
        return Response(data=serializer.data)
    
    def post(self, request):
        request.data['user'] = request.user.id
        request.data['is_accepted'] = None
        request.data['start_date'] = None
        request.data['end_date'] = None

        serializer = JustificationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(data={'message': 'Justification sent successfully'}, status=200)

class ManageJustificationView(APIView):
    permission_classes = [IsAuthenticated, IsManager]
    def get(self, request):
        justifications = Justification.objects.all()
        serializer = JustificationSerializer(instance=justifications, many=True)
        return Response(data=serializer.data)
    def post(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Justification ID is required'}, status=400)
        justification = Justification.objects.filter(id=id).first()
        if not justification:
            return Response({'error': 'Justification not found'}, status=400)
        start_date = request.data.get('start_date')
        if not start_date:
            return Response({'error': 'start_date field is required'}, status=400)
        end_date = request.data.get('end_date')
        if not end_date:
            return Response({'error': 'end_date field is required'}, status=400)
        justification.start_date = start_date
        justification.end_date = end_date
        justification.is_accepted = True
        justification.save()
        return Response(data={"message": 'Justification accepted successfully'}, status=200)
    
    def delete(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Justification ID is required'}, status=400)
        justification = Justification.objects.filter(id=id).first()
        if not justification:
            return Response({'error': 'Justification not found'}, status=400)
        justification.start_date = None
        justification.end_date = None
        justification.is_accepted = False
        justification.save()
        return Response(data={"message": 'Justification rejected successfully'}, status=200)

class FetchJustificationPictureView(generics.RetrieveAPIView):
    renderers_classes = [ImageRenderer]
    def get(self, request, id):
        data = Justification.objects.get(id=id).picture
        return HttpResponse(data, content_type='image/' + data.path.split(".")[-1])

    
class ChangeProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser]
    
    def post(self, request):
        user = request.user
        serializer = ProfilePictureSerializer(instance=user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data={'message': 'Profile picture changed successfully'}, status=200)
        return Response(data=serializer.errors, status=400)


class FetchProfilePictureView(generics.RetrieveAPIView):
    renderers_classes = [ImageRenderer]
    def get(self, request, id):
        data = User.objects.get(id=id).picture
        return HttpResponse(data, content_type='image/' + data.path.split(".")[-1])




class NotificationsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user).order_by('-creation_date')
        serializer = NotificationSerializer(instance=notifications, many=True)
        for notification in notifications:
            notification.is_read = True
            notification.save()
        return Response(data=serializer.data)

    def delete(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Notification ID is required'}, status=400)
        notification = Notification.objects.filter(id=id).first()
        if not notification:
            return Response({'error': 'Notification not found'}, status=400)
        if notification.user != request.user:
            return Response({'error': 'You do not have permission to delete this notification'}, status=403)
        notification.delete()
        return Response({'message': 'Notification deleted successfully'}, status=200)

class NotificationsCountView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user, is_read=False)
        count = notifications.count()
        return Response({'count': count})
    
    
class StatisticsView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    def get(self, request):
            return Response({})


class ManagePlanningView(APIView):
    def post(self, request):
        create = request.data.get('create')
        delete = request.data.get('delete')
        modify = request.data.get('modify')
        
        if create:
            serializer = PlanningSerializer(data=create, many=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
        if delete:
            plannings = []
            for id in delete:
                planning = Planning.objects.filter(id=id).first()
                if not planning:
                    return Response({'error': 'Planning not found'}, status=400)
                plannings.append(planning)
            for planning in plannings:
                planning.delete()
        
        if modify:
            serializer = PlanningSerializer(data=create, many=True, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                
        return Response(data={'message': 'Planning created successfully'}, status=200)
    
    def get(self, request):
        daily_schedule = Planning.objects.filter()
        serializer = PlanningSerializer(instance=daily_schedule, many=True)
        return Response(data=serializer.data)


class ConfirmPointingView(APIView):
    permission_classes = [IsAuthenticated, IsManager]
    def post(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Pointing ID is required'}, status=400)
        pointing = Pointing.objects.filter(id=id).first()
        if not pointing:
            return Response({'error': 'Pointing not found'}, status=400)
        schedule = request.data.get('schedule')
        if not schedule:
            return Response({'error': 'Schedule ID is required'}, status=400)
        schedule = DailySchedule.objects.filter(id=schedule).first()
        if not schedule:
            return Response({'error': 'Schedule not found'}, status=400)
        
        pointing.schedule = schedule
        pointing.save()
        # schedule.late_penalty = max(schedule.start_time - pointing.time, 0)
        schedule.state = 'pointed'
        schedule.save()
        # schedule.early_penalty = pointing.time - schedule.end_time
        return Response({"message": 'Pointing confirmed successfully'}, status=200)
    
    def delete(self, request):
        id = request.data.get('id')
        if not id:
            return Response({'error': 'Schedule ID is required'}, status=400)
        schedule = DailySchedule.objects.filter(id=id).first()
        if not schedule:
            return Response({'error': 'Schedule not found'}, status=400)
        schedule.state = 'absent'
        schedule.save()        
        return Response({"message": "Schedule marked as Asbsent successfully"}, status=200) 


class ManuallyPointingView(APIView):
    permission_classes = [IsAuthenticated, IsManager]
    def post(self, request):
        user = request.data.get('user')
        if not user:
            return Response({"error": "Employee ID is required"})
        serializer = PointingSerializer(data={'user': user, 'method': 'manual'})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response({"message": "Manual Pointing created successfully"}, status=201)
        

class QRPointingView(APIView):
    permission_classes = [IsAuthenticated, IsManager]
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Code is required'}, status=400)
        try:
            email, date = tools.decode_code(code)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)
        if date != datetime.date.today().isoformat():
            return Response({'error': 'Code has expired'}, status=400)            
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=400)
        serializer = PointingSerializer(data={'user': user.id, 'method': 'qr'})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'QR Pointing created successfully'}, status=200)
        return Response({"error":serializer.errors}, status=400)


class GetQRPointingView(APIView):
    permission_classes = [IsAuthenticated, IsEmployee]
    def get(self, request):
        email = request.user.email
        code = tools.generate_code(email)
        return Response({'code': code}, status=200)



class FaceRecognitionPointingView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request):
        image = request.data.get("image")
        if not image:
            return Response({"error": "No image provided"}, status=400)

        # Save image temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            for chunk in image.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name

        try:
            email = tools.face_recognistion(tmp_path)

            if email:
                user = User.objects.filter(email=email).first()
                if not user:
                    return Response({"error": "User not found"}, status=400)

                serializer = PointingSerializer(data={'user': user.id, "method": "face_recognition"})
                serializer.is_valid(raise_exception=True)
                serializer.save()

                return Response({"message": "Pointing created successfully", "email": email}, status=201)

            return Response({"error": "Could not classify the image"}, status=400)

        finally:
            # Always delete the temp file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)