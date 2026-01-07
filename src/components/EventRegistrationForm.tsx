import React, { useState } from 'react';
import { Button } from './ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.js';
import { Input } from './ui/input.js';
import { Label } from './ui/label.js';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.js';
import { Checkbox } from './ui/checkbox.js';
import { 
  X,
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  GraduationCap,
  Users,
  Award,
  CreditCard,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EventRegistrationFormProps {
  eventTitle: string;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  organization: string;
  city: string;
  gradeYear: string;
  committeePreference: string;
  experienceLevel: string;
  attendedMunBefore: string;
  consent: boolean;
}

export default function EventRegistrationForm({ eventTitle, onClose }: EventRegistrationFormProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    organization: '',
    city: '',
    gradeYear: '',
    committeePreference: '',
    experienceLevel: '',
    attendedMunBefore: '',
    consent: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.organization.trim()) {
      newErrors.organization = 'School/College/Organisation is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.committeePreference) {
      newErrors.committeePreference = 'Committee preference is required';
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = 'Experience level is required';
    }

    if (!formData.attendedMunBefore) {
      newErrors.attendedMunBefore = 'Please select an option';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to receive event updates';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    
    // Move to payment step
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('payment');
    }, 500);
  };

  const handlePayment = async () => {
    console.log('Payment button clicked');
    setIsSubmitting(true);
    
    try {
      // For SYM MUN event, use the payment link directly
      if (eventTitle === 'SYM MUN') {
        // Open Razorpay payment link in new window
        const paymentWindow = window.open('https://rzp.io/rzp/SHypoA4', '_blank');
        
        // Poll to check if payment window is closed
        const pollTimer = setInterval(() => {
          if (paymentWindow && paymentWindow.closed) {
            clearInterval(pollTimer);
            // Show a dialog asking if payment was completed
            const paymentCompleted = confirm('Did you complete the payment successfully?');
            if (paymentCompleted) {
              // Save registration data to database
              saveRegistrationToDatabase();
            } else {
              setIsSubmitting(false);
            }
          }
        }, 1000);
        
        // Set timeout to stop polling after 10 minutes
        setTimeout(() => {
          clearInterval(pollTimer);
          setIsSubmitting(false);
        }, 600000);
      }
      
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  const saveRegistrationToDatabase = async () => {
    try {
      console.log('Saving registration to database...');
      
      // Call Supabase RPC function to save registration
      const { data, error } = await supabase.rpc('create_event_registration', {
        p_event_id: 1, // SYM MUN event ID
        p_event_title: eventTitle,
        p_full_name: formData.fullName,
        p_email: formData.email,
        p_phone: formData.phone,
        p_institution: formData.organization,
        p_year: formData.gradeYear || null,
        p_city: formData.city,
        p_experience: null,
        p_payment_status: 'completed',
        p_committee_preference: formData.committeePreference,
        p_experience_level: formData.experienceLevel,
        p_attended_mun_before: formData.attendedMunBefore === 'Yes',
        p_consent_updates: formData.consent
      });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      const result = data as any;
      
      if (!result.success) {
        console.error('Registration failed:', result.error);
        throw new Error(result.error || 'Failed to save registration');
      }

      console.log('Registration saved successfully:', result.registration);
      
      setIsSubmitted(true);
      setStep('success');
      setIsSubmitting(false);
      toast.success('Registration successful!');
      
      // Close the form after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error saving registration:', error);
      toast.error('Payment successful but there was an error saving your registration. Please contact support at contact@speakyourmind.in');
      setIsSubmitted(true);
      setStep('success');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="card-neon max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border-2 border-cyan-400 p-4 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-cyan-400" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-orbitron neon-text">
            Registration Successful!
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            Thank you for registering for {eventTitle}
          </p>
          <p className="text-gray-400 text-sm">
            You will receive your committee allotment via email and WhatsApp within 48 hours.
          </p>
          <div className="mt-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/50">
              <span className="text-cyan-400 text-sm">Closing automatically...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card-neon max-w-3xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b border-cyan-400/30 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-orbitron neon-text">
              {step === 'payment' ? 'Complete Payment' : 'Event Registration'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="btn-neon-secondary p-2"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Step */}
        {step === 'form' && (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">{/* All form fields remain the same */}
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-200 flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-400" />
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`bg-gray-800/50 border-cyan-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 ${
                errors.fullName ? 'border-red-400' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-200 flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-400" />
                Phone (WhatsApp) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`bg-gray-800/50 border-cyan-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 ${
                  errors.phone ? 'border-red-400' : ''
                }`}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200 flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`bg-gray-800/50 border-cyan-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 ${
                  errors.email ? 'border-red-400' : ''
                }`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Organization and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-gray-200 flex items-center gap-2">
                <Building className="h-4 w-4 text-cyan-400" />
                School/College/Organisation <span className="text-red-400">*</span>
              </Label>
              <Input
                id="organization"
                type="text"
                placeholder="Enter your institution"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className={`bg-gray-800/50 border-cyan-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 ${
                  errors.organization ? 'border-red-400' : ''
                }`}
                disabled={isSubmitting}
              />
              {errors.organization && (
                <p className="text-red-400 text-sm">{errors.organization}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-200 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                City <span className="text-red-400">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter your city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`bg-gray-800/50 border-cyan-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 ${
                  errors.city ? 'border-red-400' : ''
                }`}
                disabled={isSubmitting}
              />
              {errors.city && (
                <p className="text-red-400 text-sm">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Grade/Year (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="gradeYear" className="text-gray-200 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-cyan-400" />
              Grade/Year <span className="text-gray-400 text-sm">(Optional)</span>
            </Label>
            <Input
              id="gradeYear"
              type="text"
              placeholder="e.g., 12th Grade, 2nd Year, etc."
              value={formData.gradeYear}
              onChange={(e) => handleInputChange('gradeYear', e.target.value)}
              className="bg-gray-800/50 border-cyan-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400"
              disabled={isSubmitting}
            />
          </div>

          {/* Committee Preference and Experience Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="committeePreference" className="text-gray-200 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                Committee Preference <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.committeePreference}
                onValueChange={(value) => handleInputChange('committeePreference', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`bg-gray-800/50 border-cyan-400/30 text-white focus:border-cyan-400 ${
                  errors.committeePreference ? 'border-red-400' : ''
                }`}>
                  <SelectValue placeholder="Select committee" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-cyan-400/30">
                  <SelectItem value="UNSC" className="text-white hover:bg-gray-700">UNSC</SelectItem>
                  <SelectItem value="WHO" className="text-white hover:bg-gray-700">WHO</SelectItem>
                  <SelectItem value="Any" className="text-white hover:bg-gray-700">Any</SelectItem>
                </SelectContent>
              </Select>
              {errors.committeePreference && (
                <p className="text-red-400 text-sm">{errors.committeePreference}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel" className="text-gray-200 flex items-center gap-2">
                <Award className="h-4 w-4 text-cyan-400" />
                Experience Level <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => handleInputChange('experienceLevel', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={`bg-gray-800/50 border-cyan-400/30 text-white focus:border-cyan-400 ${
                  errors.experienceLevel ? 'border-red-400' : ''
                }`}>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-cyan-400/30">
                  <SelectItem value="Beginner" className="text-white hover:bg-gray-700">Beginner</SelectItem>
                  <SelectItem value="Intermediate" className="text-white hover:bg-gray-700">Intermediate</SelectItem>
                  <SelectItem value="Advanced" className="text-white hover:bg-gray-700">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {errors.experienceLevel && (
                <p className="text-red-400 text-sm">{errors.experienceLevel}</p>
              )}
            </div>
          </div>

          {/* Have you attended MUN before */}
          <div className="space-y-2">
            <Label className="text-gray-200 flex items-center gap-2">
              Have you attended MUN before? <span className="text-red-400">*</span>
            </Label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="attendedMunBefore"
                  value="Yes"
                  checked={formData.attendedMunBefore === 'Yes'}
                  onChange={(e) => handleInputChange('attendedMunBefore', e.target.value)}
                  className="w-4 h-4 text-cyan-400 bg-gray-800 border-cyan-400/30 focus:ring-cyan-400"
                  disabled={isSubmitting}
                />
                <span className="text-gray-300">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="attendedMunBefore"
                  value="No"
                  checked={formData.attendedMunBefore === 'No'}
                  onChange={(e) => handleInputChange('attendedMunBefore', e.target.value)}
                  className="w-4 h-4 text-cyan-400 bg-gray-800 border-cyan-400/30 focus:ring-cyan-400"
                  disabled={isSubmitting}
                />
                <span className="text-gray-300">No</span>
              </label>
            </div>
            {errors.attendedMunBefore && (
              <p className="text-red-400 text-sm">{errors.attendedMunBefore}</p>
            )}
          </div>

          {/* Consent Checkbox */}
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => handleInputChange('consent', checked as boolean)}
                className={`mt-1 ${errors.consent ? 'border-red-400' : 'border-cyan-400/30'}`}
                disabled={isSubmitting}
              />
              <Label
                htmlFor="consent"
                className="text-gray-300 text-sm leading-relaxed cursor-pointer"
              >
                I agree to receive event updates from SYM <span className="text-red-400">*</span>
              </Label>
            </div>
            {errors.consent && (
              <p className="text-red-400 text-sm ml-7">{errors.consent}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex gap-4">
            <Button
              type="submit"
              className="btn-neon-primary flex-1 py-3 text-lg font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="btn-neon-secondary px-8"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
        )}

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border-2 border-cyan-400 p-6 rounded-full">
                    <CreditCard className="h-16 w-16 text-cyan-400" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white neon-text">Complete Your Payment</h3>
              <p className="text-gray-300">
                You're almost there! Complete your payment of <span className="font-semibold text-cyan-400">₹1800</span> to secure your spot.
              </p>
            </div>

            {/* Payment Summary */}
            <div className="card-neon-glow p-6 space-y-3">
              <div className="flex justify-between items-center text-gray-300">
                <span>Event Registration</span>
                <span className="font-semibold">₹1800</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>Platform Fee</span>
                <span className="font-semibold">₹0</span>
              </div>
              <hr className="border-cyan-400/30" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-white">Total Amount</span>
                <span className="text-cyan-400">₹1800</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setStep('form')}
                className="btn-neon-secondary flex-1"
                disabled={isSubmitting}
              >
                Back to Form
              </Button>
              <Button
                onClick={handlePayment}
                className="btn-neon-primary flex-1 py-3 text-lg font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Pay with Razorpay
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
