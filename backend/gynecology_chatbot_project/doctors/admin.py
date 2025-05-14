# doctors/admin.py
from django.contrib import admin
from .models import DoctorProfile, Appointment

class DoctorProfileAdmin(admin.ModelAdmin):
    """Admin View for DoctorProfile"""
    list_display = ('id', 'get_doctor_name', 'specialization', 'qualification', 'experience_years')
    list_filter = ('specialization', 'experience_years')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"
    get_doctor_name.short_description = 'Doctor Name'

class AppointmentAdmin(admin.ModelAdmin):
    """Admin View for Appointment"""
    list_display = ('id', 'get_patient_name', 'get_doctor_name', 'appointment_time', 'status')
    list_filter = ('status', 'appointment_time')
    search_fields = ('patient__username', 'patient__email', 'doctor__user__username', 'doctor__user__email')
    date_hierarchy = 'appointment_time'
    
    def get_patient_name(self, obj):
        return obj.patient.get_full_name()
    get_patient_name.short_description = 'Patient Name'
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.get_full_name()}"
    get_doctor_name.short_description = 'Doctor Name'

admin.site.register(DoctorProfile, DoctorProfileAdmin)
admin.site.register(Appointment, AppointmentAdmin)