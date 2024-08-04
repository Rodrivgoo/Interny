from django import forms
from authenticate.models import CustomUser
from .models import DirectorUniversity, InternshipStudent, Company

class DirectorUniversityForm(forms.ModelForm):
    director = forms.ModelChoiceField(
        queryset=CustomUser.objects.filter(user_role__role__name='director'),
        label='Director'
    )

    class Meta:
        model = DirectorUniversity
        fields = '__all__'

class InternshipStudentAdminForm(forms.ModelForm):
    class Meta:
        model = InternshipStudent
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(InternshipStudentAdminForm, self).__init__(*args, **kwargs)
        self.fields['company'].queryset = Company.objects.all()
        self.fields['company'].label_from_instance = lambda obj: obj.name
        self.fields['company'].label = "Company Name"