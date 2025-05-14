# doctors/views.py

from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from .models import DoctorProfile, Appointment
from .serializers import DoctorProfileSerializer, AppointmentSerializer


class DoctorProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """View doctor profiles (read-only)"""
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]


class AppointmentViewSet(viewsets.ModelViewSet):
    """Manage appointments in the database"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return appointments relevant to the current user"""
        user = self.request.user
        
        if user.user_type == 'doctor':
            try:
                doctor_profile = user.doctor_profile
                return Appointment.objects.filter(doctor=doctor_profile)
            except DoctorProfile.DoesNotExist:
                return Appointment.objects.none()
        else:  # user is a patient
            return Appointment.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        """Create a new appointment"""
        serializer.save(patient=self.request.user)