
http://localhost:8000/users/login/:
	- POST body = {"email", "password", "role", "is_manager", "is_chief"} -> response = {"token", "role"}

http://localhost:8000/users/notifications/:
	- GET header = {"Authorization"} -> response = [{"id", "type", "description", "creation_date", "is_read"}, ...]
	- DELETE body = {"id"}, header = {"Authorization"} -> response = {"message"}

http://localhost:8000/users/notifications_count/:
	- GET header = {"Authorization"} -> response = {"count"}

http://localhost:8000/users/manage_user/:
	- POST body = {"username", "password", "first_name", "last_name", "birth_date", "gender", "job", "phone", "address", "start_date"}, header = {"Authorization"} -> response = {"email", "message"}
  - GET header = {"Authorization"} -> response = [{"id", "email", "password", "first_name", "last_name", "birth_date", "gender", "job", "phone", "address", "start_date", "is_active", "is_chief", "is_manager"}, ...]

  - PUT body = {The itmes that I can change header} = {"Authorization"} -> response = {"email", "password", "first_name", "last_name", "birth_date", "gender", "job", "phone", "address", "start_date", "message"}

http://localhost:8000/users/freeze_user/:
	- POST body = {"id"}, header = {"Authorization"} -> response = {"message"}
	- DELETE body = {"id"}, header = {"Authorization"} -> response = {"message"}


http://localhost:8000/users/manage_team/:
	- POST body = {"name", "description"}, header = {"Authorization"} -> response = {"message"}
  - GET header = {"Authorization"} -> response = [{"id", "name", "description", "creation_date"}, ...]
	- DELETE body = {"id"}, header = {"Authorization"} -> response = {"message"}
  - PUT header = {"name", "description"}, header = {"Authorization"} -> response = {"id", "name", "description", "creation_date", "message"}

http://localhost:8000/users/change_team/:
	- POST body = {"id", "team"}, header = {"Authorization"} -> response = {"message"}


http://localhost:8000/users/my_profile/:
	- GET header = {"Authorization"} -> response = {"id", "email", "password", "first_name", "last_name", "birth_date", "gender", "job", "phone", "address", "start_date", "is_active", "is_chief", "is_manager"}

http://localhost:8000/users/my_profile/<id>/:
	- GET header = {"Authorization"} -> response = {"id", "email", "password", "first_name", "last_name", "birth_date", "gender", "job", "phone", "address", "start_date", "is_active", "is_chief", "is_manager"}

http://localhost:8000/users/others_profile/<id>/:
	- GET header = {"Authorization"} -> response = {"email", "first_name", role, "last_name", "is_chief", "is_manager"}

http://localhost:8000/users/consult_my_planning/:
  - GET header = {"Authorization"} -> response = [{"id", "day", start_time, "end_time", "is_active", "user"}, ...]

note: day is in ['sunday', 'monday', ...]

http://localhost:8000/users/consult_my_schedule/:
  - GET para = {"start_date", "end_date", "state"}, header = {"Authorization"} -> response = [{"id", "date", start_time, "end_time", "state", "late_penalty", "early_penalty", "user"}, ...]


http://localhost:8000/users/consult_my_pointing/:
  - GET para = {"start_date", "end_date", "method"}, header = {"Authorization"} -> response = [{"id", "date", time, "method", "user", "schedule"}, ...]

http://localhost:8000/users/consult_others_planning/<id>/:
  - GET header = {"Authorization"} -> response = [{"id", "day", start_time, "end_time", "is_active", "user"}, ...]

http://localhost:8000/users/consult_others_schedule/<id>/:
  - GET para = {"start_date", "end_date", "state"}, header = {"Authorization"} -> response = [{"id", "date", start_time, "end_time", "state", "late_penalty", "early_penalty", "user"}, ...]


http://localhost:8000/users/consult_filtered_schedule/:
  - GET para = {"start_date", "end_date", "state"}, header = {"Authorization"} -> response = [{"id", "date", start_time, "end_time", "state", "late_penalty", "early_penalty", "user"}, ...]

http://localhost:8000/users/demand_message/
  - POST body = {"title", "content"}, header = {"Authorization"} -> {"message", "id", "title", "content", "creation_date", "is_accepted", "user"}
  - GET header = {"Authorization"} -> response = [{"id", "title", "content", "creation_date", "is_accepted", "user"}, ...]

http://localhost:8000/users/manage_demand_message/:
  - GET header = {"Authorization"} -> response = [{"id", "title", "content", "creation_date", "is_accepted", "user"}, ...]
  - POST body = {"id"}, header = {"Authorization"} -> response = {"message"}
  - DELETE body = {"id"}, header = {"Authorization"} -> response = {"message"}

http://localhost:8000/users/get_pointing_settings/:
  - GET header = {"Authorization"} -> response = {"id", "PLATFORM_NAME", "POINTING_QR_ENABLED", "POINTING_FACE_RECOGNITION_ENABLED", "POINTING_MANUAL_ENABLED"}

http://localhost:8000/users/manage_pointing_settings/
  - POST body = {"PLATFORM_NAME", "POINTING_QR_ENABLED", "POINTING_FACE_RECOGNITION_ENABLED", "POINTING_MANUAL_ENABLED"} header = {"Authorization"} -> response = {"id", "PLATFORM_NAME", "POINTING_QR_ENABLED", "POINTING_FACE_RECOGNITION_ENABLED", "POINTING_MANUAL_ENABLED", "message"}

http://localhost:8000/users/check_system_sanity/:
  - POST header = {"Authorization"} -> {"sanity_percentage", "message", "problems": [{"type", "message"}, ...]}


// Not tested

http://localhost:8000/users/justification/:
  - POST body = {"text", "picture"}, header = {"Authorization"} -> {"message"}
  - GET header = {"Authorization"} -> [{"id", "date", "text", "picture", "is_accepted", "user", "start_date", "end_date"}, ...]


http://localhost:8000/users/manage_justification/:
 - GET header = {"Authorization"} -> [{"id", "date", "text", "picture", "is_accepted", "user", "start_date", "end_date"}, ...]
 - POST body = {"id", "start_date", "end_date"}, header = {"Authorization"} -> {"message"}
 - DELETE body = {"id"}, header = {"Authorization"} -> {"message"}

http://localhost:8000/users/justification_picture/<id>/:
	- GET header = {"Authorization"} -> response = Image (not json)


http://localhost:8000/users/change_profile_picture/:
	- POST body = {"picture"} + header = {"Authorization"} -> response = {"message"}


http://localhost:8000/users/profile_picture/<id>/:
	- GET header = {"Authorization"} -> response = Image (not json)

http://localhost:8000/users/notifications_count/:
	- GET header = {"Authorization"} -> response = {"count"}


http://localhost:8000/users/notifications/:
	- GET header = {"Authorization"} -> response = [{"id", "type", "description", "creation_date", "is_read"}, ...]
	- DELETE body = {"id"}, header = {"Authorization"} -> response = {"message"}

http://localhost:8000/users/statistics/:
	- GET header = {"Authorization"} -> response = {}


http://localhost:8000/users/manage_planning/:
  - POST body = {"create": [{"day", "start_time", "end_time", "user", ...}], "delete":["id", "id", ...], "modify": [{"id", "day", "start_time", "end_time", "user", ...}]}, header = {"Authorization"} -> response = {"message"}

  - GET header = {"Authorization"} -> response = [{"id", "day", "start_time", "end_time", "is_active", "user"}, ..]


http://localhost:8000/users/confirm_pointing/:
	- POST body = {"id", "schedule"} header = {"Authorization"} -> response = {"message"}
	- DELETE body = {"id"}, header = {"Authorization"} -> response = {"message"}


http://localhost:8000/users/point_manually/:
  - POST body = {"id"}, header = {"Authorization"} -> response = {"message"}

http://localhost:8000/users/point_qr/:
  - POST body = {"code"}, header = {"Authorization"} -> response = {"message"}

http://localhost:8000/users/get_point_qr/:
  - GET header = {"Authorization"} -> response = {"code"}

http://localhost:8000/users/point_face/:
  - POST body = {"image"} + header = {"Authorization"} -> response = {"message", "email"}

