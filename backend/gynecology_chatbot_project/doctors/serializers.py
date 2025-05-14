# doctors/serializers.py

from rest_framework import serializers
from .models import DoctorProfile, Appointment


class DoctorProfileSerializer(serializers.ModelSerializer):
    """Serializer for the DoctorProfile model"""
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'specialization',
                 'qualification', 'experience_years', 'bio', 'availability']
        read_only_fields = ['id', 'user']


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for the Appointment model"""
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'doctor_name', 'patient_name',
                 'appointment_time', 'reason', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']