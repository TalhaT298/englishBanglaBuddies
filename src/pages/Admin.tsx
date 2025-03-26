
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { ArrowLeft, Plus, Save, Upload, X, Trash2, Edit2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GirlfriendProfile } from '@/types/girlfriend';
import { api } from '@/services/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEFAULT_GEMINI_PROMPT = `Custom GPT Chatbot Instructions: Cute English Girlfriend Teaching English and Flirting in Bengali

Chatbot Personality Traits:
- Cute & Friendly: Uses cute, playful language.
- Flirtatious: Engages users through gentle teasing, compliments, and playful banter in Bengali.
- Supportive Educator: Gently corrects English mistakes, explains grammar points clearly, and encourages learners.
- Bilingual: Speaks Bengali casually and teaches English formally.
- Interactive: Asks engaging questions and maintains a fun, conversational flow.

Tone & Language:
- Use informal and friendly language in Bengali. (Example: "হাই জান, আজকে কেমন লাগছে তোমার?")
- Frequently use affectionate terms such as: "জান", "দুষ্টু", "সুইটহার্ট", "পাগল", "বোকা".
- Employ emojis frequently (😊, 😘, 😉, 💕).
- Always remain respectful and playful, never rude.`;

const MOCK_GIRLFRIENDS: GirlfriendProfile[] = [
  {
    id: '1',
    name: 'মারিয়া',
    avatar: '/placeholder.svg',
    description: 'শপিংমল এ কিভাবে ইংরেজিতে কথা বলবেন এবং জিনিসপত্র কিনবেন তা শিখান।',
    personality: 'একজন উৎসাহী সেলসগার্ল, ফ্লার্টিং পছন্দ করে, হাস্যময় ও সাহায্যকারী',
    level: 1,
    topic: 'শপিং মল',
    occupation: 'সেলসগার্ল',
    isUnlocked: true,
    skillLevel: 4,
    customInstructions: DEFAULT_GEMINI_PROMPT,
    flirtingStyle: 'Playful and teasing',
    teachingStyle: 'Practical examples',
    languageLevel: 'beginner'
  }
];

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('add');
  const [girlfriends, setGirlfriends] = useState<GirlfriendProfile[]>(MOCK_GIRLFRIENDS);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedGirlfriend, setSelectedGirlfriend] = useState<GirlfriendProfile | null>(null);
  
  const [formData, setFormData] = useState<GirlfriendProfile>({
    name: '',
    avatar: '/placeholder.svg',
    description: '',
    personality: '',
    level: 1,
    topic: '',
    occupation: '',
    isUnlocked: false,
    skillLevel: 3,
    customInstructions: DEFAULT_GEMINI_PROMPT,
    flirtingStyle: 'Playful and teasing',
    teachingStyle: 'Practical examples',
    languageLevel: 'beginner'
  });
  
  useEffect(() => {
    const savedGirlfriends = localStorage.getItem('customGirlfriends');
    if (savedGirlfriends) {
      setGirlfriends(JSON.parse(savedGirlfriends));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('customGirlfriends', JSON.stringify(girlfriends));
  }, [girlfriends]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: any) => {
    if (name === "isUnlocked") {
      setFormData(prev => ({ ...prev, [name]: value === "true" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, avatar: previewUrl }));
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      avatar: '/placeholder.svg',
      description: '',
      personality: '',
      level: 1,
      topic: '',
      occupation: '',
      isUnlocked: false,
      skillLevel: 3,
      customInstructions: DEFAULT_GEMINI_PROMPT,
      flirtingStyle: 'Playful and teasing',
      teachingStyle: 'Practical examples',
      languageLevel: 'beginner'
    });
    setSelectedImage(null);
    setSelectedGirlfriend(null);
  };
  
  const handleEditGirlfriend = (girlfriend: GirlfriendProfile) => {
    setFormData(girlfriend);
    setSelectedGirlfriend(girlfriend);
    setActiveTab('add');
  };
  
  const handleDeleteGirlfriend = (id: string | undefined) => {
    if (!id) return;
    
    setGirlfriends(prev => prev.filter(girlfriend => girlfriend.id !== id));
    toast.success("সাথী মুছে ফেলা হয়েছে", {
      description: "সাথী সফলভাবে মুছে ফেলা হয়েছে।"
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newGirlfriend = {
        ...formData,
        id: selectedGirlfriend?.id || `gf-${Date.now()}`,
      };
      
      if (selectedGirlfriend) {
        setGirlfriends(prev => 
          prev.map(gf => gf.id === selectedGirlfriend.id ? newGirlfriend : gf)
        );
        toast.success("সফলভাবে আপডেট হয়েছে!", {
          description: `${formData.name} সফলভাবে আপডেট করা হয়েছে।`
        });
      } else {
        setGirlfriends(prev => [...prev, newGirlfriend]);
        toast.success("সফলভাবে সংরক্ষিত হয়েছে!", {
          description: `${formData.name} সফলভাবে যোগ করা হয়েছে।`
        });
      }
      
      setIsLoading(false);
      resetForm();
      setActiveTab('list');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">সাথী ম্যানেজমেন্ট</h1>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate('/admin-dashboard')}
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            অ্যাডমিন ড্যাশবোর্ড
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="add">নতুন সাথী যোগ করুন</TabsTrigger>
            <TabsTrigger value="list">সমস্ত সাথী</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
            <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in">
              <h2 className="font-medium mb-4">
                {selectedGirlfriend ? 'সাথী আপডেট করুন' : 'নতুন সাথী যোগ করুন'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-medium">মৌলিক তথ্য</h3>
                  
                  <div>
                    <Label htmlFor="avatar">ছবি আপলোড করুন</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                      {formData.avatar && (
                        <div className="mb-2">
                          <img 
                            src={formData.avatar} 
                            alt="Preview" 
                            className="h-32 w-32 object-cover rounded-lg mx-auto"
                          />
                        </div>
                      )}
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">ড্র্যাগ করুন বা ক্লিক করুন</p>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          id="avatar" 
                          onChange={handleImageChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('avatar')?.click()}
                        >
                          ফাইল নির্বাচন করুন
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="name">নাম</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="occupation">পেশা</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="topic">বিষয়</Label>
                    <Input
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">বিবরণ</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="personality">ব্যক্তিত্ব</Label>
                    <Textarea
                      id="personality"
                      name="personality"
                      value={formData.personality}
                      onChange={handleChange}
                      className="mt-1"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="level">লেভেল</Label>
                      <Input
                        id="level"
                        name="level"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.level}
                        onChange={handleChange}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skillLevel">দক্ষতার মাত্রা</Label>
                      <Input
                        id="skillLevel"
                        name="skillLevel"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.skillLevel}
                        onChange={handleChange}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="isUnlocked">আনলক স্ট্যাটাস</Label>
                    <Select 
                      value={formData.isUnlocked ? "true" : "false"}
                      onValueChange={(value) => handleSelectChange("isUnlocked", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="আনলক স্ট্যাটাস নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">আনলক করা</SelectItem>
                        <SelectItem value="false">লকড</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-medium">এআই ব্যক্তিত্ব সেটিংস</h3>
                  
                  <div>
                    <Label htmlFor="languageLevel">ভাষা স্তর</Label>
                    <Select 
                      value={formData.languageLevel}
                      onValueChange={(value) => handleSelectChange("languageLevel", value as 'beginner' | 'intermediate' | 'advanced')}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="ভাষা স্তর নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (নতুন শিক্ষার্থী)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (মাঝারি)</SelectItem>
                        <SelectItem value="advanced">Advanced (উন্নত)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="flirtingStyle">ফ্লার্টিং স্টাইল</Label>
                    <Input
                      id="flirtingStyle"
                      name="flirtingStyle"
                      value={formData.flirtingStyle}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="teachingStyle">শিক্ষণ স্টাইল</Label>
                    <Input
                      id="teachingStyle"
                      name="teachingStyle"
                      value={formData.teachingStyle}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customInstructions">কাস্টম জেমিনি প্রম্পট</Label>
                    <Textarea
                      id="customInstructions"
                      name="customInstructions"
                      value={formData.customInstructions}
                      onChange={handleChange}
                      className="mt-1 font-mono text-xs"
                      rows={10}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={resetForm}
                      className="flex-1"
                      variant="outline"
                    >
                      রিসেট
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-pulse mr-2">...</span>
                          সেভ হচ্ছে
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          সেভ করুন
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="glass-card rounded-xl p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">সমস্ত সাথী ({girlfriends.length})</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2" 
                  onClick={() => {
                    resetForm();
                    setActiveTab('add');
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  নতুন যোগ করুন
                </Button>
              </div>
              
              <div className="space-y-3">
                {girlfriends.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p>এখনও কোনো সাথী যোগ করা হয়নি</p>
                  </div>
                ) : (
                  girlfriends.map((girlfriend) => (
                    <div 
                      key={girlfriend.id} 
                      className="flex items-center justify-between py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center">
                        <img 
                          src={girlfriend.avatar} 
                          alt={girlfriend.name} 
                          className="w-10 h-10 rounded-full object-cover mr-3" 
                        />
                        <div>
                          <h3 className="font-medium">{girlfriend.name}</h3>
                          <p className="text-xs text-gray-500">{girlfriend.topic}</p>
                        </div>
                      </div>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500"
                          onClick={() => handleEditGirlfriend(girlfriend)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500"
                          onClick={() => handleDeleteGirlfriend(girlfriend.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
