from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class ComplexityValidator:
    def validate(self, password: str, user=None):
        minimum_requirements = 1
        capitals = [char for char in password if char.isupper()]
        lowers = [char for char in password if char.islower()]
        numbers = [char for char in password if char.isdigit()]
        specials = [char for char in password if not char.isalnum()]

        if (
            len(capitals) < minimum_requirements
            or len(lowers) < minimum_requirements
            or len(numbers) < minimum_requirements
            or len(specials) < minimum_requirements
        ):
            raise ValidationError(
                _(
                    "You need at least {0} uppercase and {0} lowercase letter, {0} number, {0} special character!".format(
                        minimum_requirements
                    )
                ),
                code=(
                    "You need at least {0} uppercase and {0} lowercase letter, {0} number, {0} special character!".format(
                        minimum_requirements
                    )
                ),
            )


class CharacterRepeatValidator:
    def validate(self, password, user=None):
        for char in password:
            if char * 3 in password:
                raise ValidationError(
                    _("You cannot repeat 1 character more then two times!"),
                    code="You cannot repeat 1 character more then two times!",
                )
