from django import forms
from .models import Jobs, Company

class JobsAdminForm(forms.ModelForm):
    class Meta:
        model = Jobs
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(JobsAdminForm, self).__init__(*args, **kwargs)
        self.fields['company_id'].queryset = Company.objects.all()
        self.fields['company_id'].label_from_instance = lambda obj: obj.name
        self.fields['company_id'].label = "Company Name"