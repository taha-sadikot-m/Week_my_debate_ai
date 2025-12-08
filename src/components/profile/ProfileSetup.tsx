import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { User, BookOpen, Globe, Trophy, Film, Scale, Cpu, Heart } from 'lucide-react';

const INTEREST_CATEGORIES = [
  { id: 'politics', label: 'Politics', icon: Scale },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'cinema', label: 'Cinema', icon: Film },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'global_affairs', label: 'Global Affairs', icon: Globe },
  { id: 'ethics_philosophy', label: 'Ethics / Philosophy', icon: Heart },
];

const ProfileSetup = () => {
  const { user, updateProfile } = useCustomAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    age: '',
    gender: '',
    country: '',
    school: '',
    interests: [] as string[]
  });

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => {
      const currentInterests = prev.interests;
      if (currentInterests.includes(interestId)) {
        return { ...prev, interests: currentInterests.filter(i => i !== interestId) };
      } else {
        if (currentInterests.length >= 5) {
          toast({
            title: "Limit Reached",
            description: "You can select up to 5 interests.",
            variant: "destructive"
          });
          return prev;
        }
        return { ...prev, interests: [...currentInterests, interestId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.age || !formData.country) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.interests.length < 3) {
      toast({
        title: "Interests Required",
        description: "Please select at least 3 interests.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({
        fullName: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        country: formData.country,
        school: formData.school,
        interests: formData.interests
      });

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully set up.",
        });
        navigate('/');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-primary">
      <Card className="w-full max-w-2xl card-neon border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
            <User className="h-6 w-6" />
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-gray-400">
            Tell us about yourself to get personalized debate topics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300">Full Name *</Label>
                <Input 
                  id="fullName" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="bg-gray-900 border-gray-700 text-gray-100 focus:border-cyan-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-300">Age *</Label>
                <Input 
                  id="age" 
                  type="number"
                  value={formData.age} 
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="bg-gray-900 border-gray-700 text-gray-100 focus:border-cyan-500"
                  placeholder="18"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-300">Gender (Optional)</Label>
                <Select onValueChange={(val) => setFormData({...formData, gender: val})} value={formData.gender}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-gray-100">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-300">Country *</Label>
                <Input 
                  id="country" 
                  value={formData.country} 
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="bg-gray-900 border-gray-700 text-gray-100 focus:border-cyan-500"
                  placeholder="United States"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="school" className="text-gray-300">School / College (Optional)</Label>
                <Input 
                  id="school" 
                  value={formData.school} 
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="bg-gray-900 border-gray-700 text-gray-100 focus:border-cyan-500"
                  placeholder="University of Debates"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300">Interests (Select 3-5) *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INTEREST_CATEGORIES.map((category) => {
                  const isSelected = formData.interests.includes(category.id);
                  const Icon = category.icon;
                  return (
                    <div 
                      key={category.id}
                      onClick={() => handleInterestToggle(category.id)}
                      className={`
                        cursor-pointer p-3 rounded-lg border transition-all duration-200 flex items-center gap-2
                        ${isSelected 
                          ? 'bg-cyan-950/50 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                          : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-800'}
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 text-right">
                Selected: {formData.interests.length}/5
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-neon-primary h-12 text-lg font-bold mt-6"
              disabled={loading}
            >
              {loading ? 'Saving Profile...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
