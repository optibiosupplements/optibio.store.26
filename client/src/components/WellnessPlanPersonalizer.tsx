import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface UserData {
  primaryGoals: string[];
  stressLevel: number;
  sleepQuality: number;
  exerciseFrequency: "none" | "light" | "moderate" | "intense" | "";
  timingPreference: "morning" | "evening" | "flexible" | "";
}

interface WellnessPlan {
  timing: string;
  expectedTimeline: string;
  personalizedTips: string[];
}

export default function WellnessPlanPersonalizer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    primaryGoals: [],
    stressLevel: 5,
    sleepQuality: 5,
    exerciseFrequency: "",
    timingPreference: "",
  });

  const goalOptions = [
    { id: "stress", label: "Reduce Stress & Anxiety", icon: "🧘" },
    { id: "sleep", label: "Improve Sleep Quality", icon: "😴" },
    { id: "focus", label: "Enhance Mental Clarity", icon: "🎯" },
    { id: "energy", label: "Boost Energy Levels", icon: "⚡" },
    { id: "performance", label: "Athletic Performance", icon: "💪" },
  ];

  const toggleGoal = (goalId: string) => {
    setUserData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goalId)
        ? prev.primaryGoals.filter(g => g !== goalId)
        : [...prev.primaryGoals, goalId]
    }));
  };

  const generatePlan = (): WellnessPlan => {
    const hasHighStress = userData.stressLevel >= 7;
    const hasPoorSleep = userData.sleepQuality <= 4;
    const isAthlete = userData.exerciseFrequency === "intense" || userData.primaryGoals.includes("performance");
    
    let timing = "";
    let expectedTimeline = "";
    const tips: string[] = [];

    // Timing recommendations based on goals and preferences
    if (userData.timingPreference === "morning") {
      if (userData.primaryGoals.includes("energy") || userData.primaryGoals.includes("focus")) {
        timing = "Take 2 capsules in the morning with breakfast for peak daytime performance";
      } else {
        timing = "Take 2 capsules in the morning with breakfast, or split (1 morning, 1 afternoon) for all-day support";
      }
    } else if (userData.timingPreference === "evening") {
      if (userData.primaryGoals.includes("sleep")) {
        timing = "Take 2 capsules 30-60 minutes before bed to support deep, restorative sleep";
      } else {
        timing = "Take 2 capsules with dinner for overnight recovery and next-day benefits";
      }
    } else {
      // Flexible timing based on primary goals
      if (userData.primaryGoals.includes("sleep")) {
        timing = "Take 2 capsules 30-60 minutes before bed for optimal sleep support";
      } else if (userData.primaryGoals.includes("energy") || userData.primaryGoals.includes("focus")) {
        timing = "Take 2 capsules in the morning with breakfast for sustained daytime energy and clarity";
      } else if (isAthlete) {
        timing = "Split dose: 1 capsule morning, 1 capsule post-workout for performance and recovery";
      } else {
        timing = "Take 2 capsules with your largest meal for best absorption and consistent benefits";
      }
    }

    // Expected timeline based on goals
    if (userData.primaryGoals.includes("sleep")) {
      expectedTimeline = "2-3 weeks for noticeable sleep improvements, 4-6 weeks for optimal results";
    } else if (userData.primaryGoals.includes("stress")) {
      expectedTimeline = "2-4 weeks for stress reduction, 6-8 weeks for sustained calm";
    } else if (userData.primaryGoals.includes("performance")) {
      expectedTimeline = "4-8 weeks for athletic performance gains, 12 weeks for peak benefits";
    } else if (userData.primaryGoals.includes("focus")) {
      expectedTimeline = "2-3 weeks for mental clarity, 4-6 weeks for sustained cognitive benefits";
    } else {
      expectedTimeline = "3-4 weeks for initial benefits, 8 weeks for optimal results";
    }

    // Goal-specific tips
    if (userData.primaryGoals.includes("sleep")) {
      tips.push("Create a consistent bedtime routine—take your capsules at the same time each night");
      tips.push("Avoid screens 30 minutes after taking for enhanced sleep benefits");
    }
    if (userData.primaryGoals.includes("stress")) {
      tips.push("Pair with 5 minutes of deep breathing or meditation for amplified stress relief");
      tips.push("Track your stress levels weekly to notice gradual improvements");
    }
    if (userData.primaryGoals.includes("performance")) {
      tips.push("Take consistently for at least 8-12 weeks to see peak athletic performance");
      tips.push("Combine with adequate protein intake for optimal recovery support");
    }
    if (userData.primaryGoals.includes("focus")) {
      tips.push("Mental clarity effects typically appear within 2-3 weeks of consistent use");
      tips.push("Best results when paired with good sleep hygiene and hydration");
    }
    if (userData.primaryGoals.includes("energy")) {
      tips.push("Unlike caffeine, energy benefits build gradually—give it 3-4 weeks");
      tips.push("Take with breakfast for sustained energy throughout the day");
    }

    // Lifestyle-specific tips
    if (hasHighStress) {
      tips.push("Your high stress level may benefit from the full 600mg clinical dose—stick with 2 capsules daily");
    }
    if (hasPoorSleep) {
      tips.push("Poor sleep and stress often go hand-in-hand—ashwagandha addresses both");
    }
    if (isAthlete) {
      tips.push("Studies show athletes benefit from split dosing for both performance and recovery");
    }

    // Universal tips
    tips.push("Take with food for optimal absorption and to minimize any stomach sensitivity");
    tips.push("Consistency is key—take daily for at least 8 weeks for full benefits");
    tips.push("Results are cumulative—don't skip days for best outcomes");

    return {
      timing,
      expectedTimeline,
      personalizedTips: tips.slice(0, 6) // Limit to 6 most relevant tips
    };
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return userData.primaryGoals.length > 0;
      case 1:
        return userData.exerciseFrequency;
      case 2:
        return userData.timingPreference;
      default:
        return false;
    }
  };

  const plan = showResults ? generatePlan() : null;

  // Collapsed state
  if (!isExpanded) {
    return (
      <section className="py-24 bg-gradient-to-br from-[#F7F4EF] via-white to-[#F7F4EF]/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1E3A5F] to-[#B89651] text-white px-6 py-3 rounded-full font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              FREE PERSONALIZED PLAN
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Get Your Personalized Wellness Plan
            </h2>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Answer 3 quick questions to discover the best way to take OptiBio for <span className="font-semibold text-[#1E3A5F]">YOUR</span> specific goals and lifestyle
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => setIsExpanded(true)}
                className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45] text-lg px-8 py-6"
              >
                Create My Free Plan (90 seconds)
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm text-slate-500">
              No email required • Instant results • Based on clinical research
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Results page
  if (showResults && plan) {
    return (
      <section className="py-24 bg-gradient-to-br from-[#F7F4EF] via-white to-[#F7F4EF]/30">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A961] to-[#F7F4EF]0 text-slate-900 px-6 py-3 rounded-full font-bold text-lg mb-6">
                <Sparkles className="w-5 h-5" />
                Your Personalized Wellness Plan
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Here's How to Maximize Your Results
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Based on your goals of {userData.primaryGoals.map(g => goalOptions.find(opt => opt.id === g)?.label.toLowerCase()).join(", ")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Timing */}
              <Card className="border-2 border-[#C9A961]/30 bg-gradient-to-br from-[#F7F4EF] to-white">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#C9A961]/10 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-600 mb-2">Optimal Timing</div>
                    <div className="text-lg font-bold text-[#1E3A5F] leading-tight">
                      {plan.timing}
                    </div>
                    <div className="text-sm text-slate-600 mt-3 p-3 bg-[#F7F4EF] rounded-lg">
                      <strong>Clinical Dose:</strong> 2 capsules daily (600mg KSM-66®)
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-2 border-[#C9A961]/20 bg-gradient-to-br from-[#F7F4EF] to-white">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#C9A961]/10 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-[#1E3A5F]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-600 mb-2">Expected Results</div>
                    <div className="text-lg font-bold text-[#1E3A5F] leading-tight">
                      {plan.expectedTimeline}
                    </div>
                    <div className="text-sm text-slate-600 mt-3 p-3 bg-[#F7F4EF] rounded-lg">
                      Consistency is key for best results
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personalized Tips */}
            <Card className="border-2 border-slate-200">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#B89651] flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Your Personalized Tips</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.personalizedTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-[#B89651] flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical Disclaimer */}
            <Card className="border-2 border-[#C9A961]/20 bg-[#F7F4EF]">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-[#B89651] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-[#1E3A5F]">
                    <strong>Important:</strong> This plan provides general guidance based on clinical research of KSM-66® Ashwagandha. 
                    It is not medical advice. The clinically studied dose is 600mg daily (2 capsules). 
                    Consult your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, 
                    taking medications, or have a medical condition.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center space-y-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45] text-lg px-8 py-6"
                onClick={() => window.location.href = "/shop"}
              >
                Get Started with Your Plan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-sm text-slate-600">
                90-day money-back guarantee • Free shipping on all orders
              </p>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowResults(false);
                  setStep(0);
                  setIsExpanded(false);
                }}
                className="text-slate-600"
              >
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Quiz flow
  return (
    <section className="py-24 bg-gradient-to-br from-[#F7F4EF] via-white to-[#F7F4EF]/30">
      <div className="container">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-12 bg-[#1E3A5F]" : i < step ? "w-8 bg-[#1E3A5F]" : "w-8 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <Badge className="mb-4 bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30">
              Step {step + 1} of 3
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {step === 0 && "What Are Your Wellness Goals?"}
              {step === 1 && "Tell Us About Your Lifestyle"}
              {step === 2 && "When Do You Prefer to Take Supplements?"}
            </h2>
          </div>

          <Card className="border-2 border-slate-200">
            <CardContent className="p-8 space-y-6">
              {/* Step 0: Goals */}
              {step === 0 && (
                <div className="space-y-4">
                  <p className="text-slate-600">Select all that apply:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                          userData.primaryGoals.includes(goal.id)
                            ? "border-[#1E3A5F] bg-[#F7F4EF]"
                            : "border-slate-200 hover:border-[#C9A961]/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{goal.icon}</span>
                          <span className="font-semibold text-slate-900">{goal.label}</span>
                        </div>
                        {userData.primaryGoals.includes(goal.id) && (
                          <CheckCircle2 className="w-6 h-6 text-[#1E3A5F] ml-auto mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Lifestyle */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label>Current Stress Level (1-10)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[userData.stressLevel]}
                        onValueChange={(value) => setUserData({ ...userData, stressLevel: value[0] })}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Low (1)</span>
                        <span className="font-bold text-[#1E3A5F]">{userData.stressLevel}</span>
                        <span>High (10)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Sleep Quality (1-10)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[userData.sleepQuality]}
                        onValueChange={(value) => setUserData({ ...userData, sleepQuality: value[0] })}
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Poor (1)</span>
                        <span className="font-bold text-[#1E3A5F]">{userData.sleepQuality}</span>
                        <span>Excellent (10)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Exercise Frequency</Label>
                    <RadioGroup
                      value={userData.exerciseFrequency}
                      onValueChange={(value: any) => setUserData({ ...userData, exerciseFrequency: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none" className="font-normal cursor-pointer">Little to no exercise</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="font-normal cursor-pointer">Light (1-2 days/week)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate" className="font-normal cursor-pointer">Moderate (3-4 days/week)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intense" id="intense" />
                        <Label htmlFor="intense" className="font-normal cursor-pointer">Intense (5+ days/week)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 2: Timing */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-slate-600">When do you usually take supplements?</p>
                  <RadioGroup
                    value={userData.timingPreference}
                    onValueChange={(value: any) => setUserData({ ...userData, timingPreference: value })}
                  >
                    <div className="space-y-3">
                      <label
                        htmlFor="morning"
                        className={`flex items-start p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          userData.timingPreference === "morning"
                            ? "border-[#1E3A5F] bg-[#F7F4EF]"
                            : "border-slate-200 hover:border-[#C9A961]/40"
                        }`}
                      >
                        <RadioGroupItem value="morning" id="morning" className="mt-1" />
                        <div className="ml-4">
                          <div className="font-semibold text-slate-900">Morning (with breakfast)</div>
                          <div className="text-sm text-slate-600">Best for daytime energy and focus</div>
                        </div>
                      </label>

                      <label
                        htmlFor="evening"
                        className={`flex items-start p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          userData.timingPreference === "evening"
                            ? "border-[#1E3A5F] bg-[#F7F4EF]"
                            : "border-slate-200 hover:border-[#C9A961]/40"
                        }`}
                      >
                        <RadioGroupItem value="evening" id="evening" className="mt-1" />
                        <div className="ml-4">
                          <div className="font-semibold text-slate-900">Evening (before bed)</div>
                          <div className="text-sm text-slate-600">Best for sleep support and overnight recovery</div>
                        </div>
                      </label>

                      <label
                        htmlFor="flexible"
                        className={`flex items-start p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          userData.timingPreference === "flexible"
                            ? "border-[#1E3A5F] bg-[#F7F4EF]"
                            : "border-slate-200 hover:border-[#C9A961]/40"
                        }`}
                      >
                        <RadioGroupItem value="flexible" id="flexible" className="mt-1" />
                        <div className="ml-4">
                          <div className="font-semibold text-slate-900">Flexible (whatever works)</div>
                          <div className="text-sm text-slate-600">We'll recommend the best timing for your goals</div>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className="border-2"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45]"
            >
              {step === 2 ? "Get My Plan" : "Continue"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
