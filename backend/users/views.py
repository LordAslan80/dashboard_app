import logging
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
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
        data = request.data
        user = User(
            username=data["username"],
            first_name=data["firstName"],
            last_name=data["lastName"],
            email=data["email"],
            is_staff=data["is_staff"],
            is_active=True,
            required_password_change=True,
            password_change_date=timezone.now(),
        )
        user.set_password(data["passwd"])

        status = 201
        try:
            user.save()
        except Exception:
            error_message = User._meta.get_field("username").error_messages["unique"]
            status = 406
            return Response({"error": error_message}, status=status)
        return Response({}, status=status)


class DeleteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def delete(self, request):
        User.objects.get(id=request.data["user_id"]).delete()
        return Response({}, status=200)


class DeactivateUserView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        user = User.objects.get(username=request.data["username"])
        user.is_active = False
        user.save()
        return Response({"User deactivated"}, status=status.HTTP_200_OK)
