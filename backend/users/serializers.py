from rest_framework.serializers import ModelSerializer, SerializerMethodField
from axes.handlers.proxy import AxesProxyHandler
from .models import User


class UserSerializer(ModelSerializer):
    is_blocked = SerializerMethodField()

    def get_is_blocked(self, object):
        request = self.context["request"]
        return AxesProxyHandler.is_locked(request, {"username": object})

    class Meta:
        model = User
        fields = "__all__"
