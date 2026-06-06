from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserView, NewUserView, DeleteUserView, UpdateUserStatusView
from .custom_jwt_claims import CustomTokenObtainPairView

router = DefaultRouter()
router.register(r"users", UserView)

urlpatterns = [
    path("", include(router.urls)),
    path("users/new", NewUserView.as_view(), name="new_user"),
    path("users/delete", DeleteUserView.as_view(), name="delete_user"),
    path(
        "users/update-status", UpdateUserStatusView.as_view(), name="update_user_status"
    ),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
]
