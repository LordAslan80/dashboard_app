import logging
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from axes.utils import reset
from .models import User
from .serializers import UserSerializer

logger = logging.getLogger(__name__)


class UserView(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    paginator = None


class NewUserView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request, format=None):
        user = User(
            username=request.data["username"],
            first_name=request.data["firstName"],
            last_name=request.data["lastName"],
            email=request.data["email"],
            is_staff=request.data["is_staff"],
            is_active=True,
            required_password_change=True,
            password_change_date=timezone.now(),
        )
        user.set_password(request.data["passwd"])

        try:
            validate_password(request.data["passwd"], user)
            user.save()
        except ValidationError as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            error_message = User._meta.get_field("username").error_messages["unique"]
            return Response(
                {"error": error_message}, status=status.HTTP_406_NOT_ACCEPTABLE
            )
        return Response({}, status=status.HTTP_201_CREATED)


class DeleteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def delete(self, request):
        User.objects.get(id=request.data["user_id"]).delete()
        return Response({}, status=200)


class UpdateUserStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        user = User.objects.get(username=request.data["username"])
        user.is_active = False if user.is_active == True else True
        message = "reactivated" if user.is_active == True else "deactivated"
        user.save()
        return Response({f"User {message}"}, status=status.HTTP_200_OK)


class UpdateUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        for item in request.data:
            if item in ["username", "first_name", "last_name", "email"]:
                if self.validate_requested_field(request, item):
                    setattr(request.user, item, request.data[item])
        try:
            request.user.save()
        except Exception:
            error_message = User._meta.get_field("username").error_messages["unique"]
            return Response(
                {"error": error_message}, status=status.HTTP_406_NOT_ACCEPTABLE
            )
        return Response({"User data updated"}, status=status.HTTP_200_OK)

    def validate_requested_field(self, request, field):
        return (
            True
            if field in request.data
            and request.data[field]
            and request.data[field] != ""
            else False
        )


class ResetLoginAttemptsView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        if "blocked_user" not in request.data.keys():
            raise ValidationError(detail={"blocked_user": "This field is required."})
        if not User.objects.filter(username=request.data["blocked_user"]).exists():
            raise ValidationError(
                ("Username does not exists."), code="Username does not exists."
            )
        reset(username=request.data["blocked_user"])
        return Response({"User unblocked"}, status=status.HTTP_200_OK)


class AdminResetUserPasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        if not request.user.is_staff:
            return Response(
                {"response": "User is not an admin!"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        validate_password(request.data["new_passwd"], request.data["target_user"])

        user = User.objects.get(username=request.data["target_user"])
        user.required_password_change = False
        user.password_change_date = timezone.now()
        user.set_password(request.data["new_passwd"])
        user.save()

        return Response({"response": "Success"}, status=status.HTTP_200_OK)
