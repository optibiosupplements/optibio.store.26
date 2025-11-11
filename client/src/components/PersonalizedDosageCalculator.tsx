import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Target,
  Sparkles,
  Calendar,
  TrendingUp
} from "lucide-react";

interface UserData {
  age: string;
  weight: string;
  biologicalSex: "male" | "female" | "other" | "";
  primaryGoals: string[];
  stressLevel: number;
  sleepQuality: number;
  exerciseFrequency: "none" | "light" | "moderate" | "intense" | "";
  timingPreference: "morning" | "evening" | "flexible" | "";
}

interface DosageRecommendation {
  dosage: "1 capsule" | "2 capsules" | "1-2 capsules";
  timing: string;
  expectedTimeline: string;
  personalizedTips: string[];
  reasoning: string;
}

export default function PersonalizedDosageCalculator() {
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    age: "",
    weight: "",
    biologicalSex: "",
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

  const calculateRecommendation = (): DosageRecommendation => {
    const age = parseInt(userData.age);
    const weight = parseInt(userData.weight);
    const hasHighStress = userData.stressLevel >= 7;
    const hasPoorSleep = userData.sleepQuality <= 4;
    const isAthlete = userData.exerciseFrequency === "intense" || userData.primaryGoals.includes("performance");
    
    // Dosage logic based on clinical research
    let dosage: "1 capsule" | "2 capsules" | "1-2 capsules" = "2 capsules";
    let timing = "";
    let expectedTimeline = "";
    const tips: string[] = [];

    // Age considerations
    if (age >= 65) {
      dosage = "1 capsule";
      tips.push("Starting with a lower dose is recommended for optimal tolerance");
    } else if (age >= 18 && age < 30 && !hasHighStress) {
      dosage = "1-2 capsules";
      tips.push("You may start with 1 capsule and increase to 2 if needed");
    }

    // Weight considerations (clinical trials used 600mg for most participants)
    if (weight < 130 && dosage === "2 capsules") {
      dosage = "1-2 capsules";
      tips.push("Consider starting with 1 capsule daily for the first week");
    }

    // High stress or poor sleep = 2 capsules
    if (hasHighStress || hasPoorSleep) {
      dosage = "2 capsules";
      tips.push("Higher stress levels benefit from the full 600mg clinical dose");
    }

    // Athletes often benefit from full dose
    if (isAthlete) {
      dosage = "2 capsules";
      tips.push("Athletic performance studies used the full 600mg dose");
    }

    // Timing recommendations
    if (userData.timingPreference === "morning") {
      timing = "Take in the morning with breakfast";
      if (dosage === "2 capsules") {
        timing = "Take both capsules in the morning with breakfast, or split (1 morning, 1 afternoon)";
      }
    } else if (userData.timingPreference === "evening") {
      timing = "Take 30-60 minutes before bed";
      if (userData.primaryGoals.includes("sleep")) {
        timing = "Take 30-60 minutes before bed for optimal sleep support";
      }
    } else {
      // Flexible timing based on goals
      if (userData.primaryGoals.includes("sleep")) {
        timing = "Take 30-60 minutes before bed for sleep support";
      } else if (userData.primaryGoals.includes("energy") || userData.primaryGoals.includes("focus")) {
        timing = "Take in the morning with breakfast for daytime benefits";
      } else {
        timing = dosage === "2 capsules" 
          ? "Split dose: 1 capsule morning, 1 capsule evening"
          : "Take with your largest meal for best absorption";
      }
    }

    // Expected timeline based on goals
    if (userData.primaryGoals.includes("sleep")) {
      expectedTimeline = "2-3 weeks for noticeable sleep improvements";
    } else if (userData.primaryGoals.includes("stress")) {
      expectedTimeline = "2-4 weeks for stress reduction benefits";
    } else if (userData.primaryGoals.includes("performance")) {
      expectedTimeline = "4-8 weeks for athletic performance gains";
    } else {
      expectedTimeline = "3-4 weeks for optimal benefits";
    }

    // Goal-specific tips
    if (userData.primaryGoals.includes("sleep")) {
      tips.push("Pair with a consistent bedtime routine for best sleep results");
    }
    if (userData.primaryGoals.includes("stress")) {
      tips.push("Combine with deep breathing or meditation for enhanced stress relief");
    }
    if (userData.primaryGoals.includes("performance")) {
      tips.push("Take consistently for 8-12 weeks to see peak performance benefits");
    }
    if (userData.primaryGoals.includes("focus")) {
      tips.push("Effects on mental clarity typically appear within 2-3 weeks");
    }

    // General tips
    tips.push("Take with food for optimal absorption and to minimize any stomach sensitivity");
    tips.push("Consistency is key—take daily for at least 8 weeks for full benefits");

    const reasoning = `Based on your ${userData.biologicalSex === "female" ? "profile" : "profile"}, ${
      hasHighStress ? "high stress level" : "moderate stress level"
    }, and goals of ${userData.primaryGoals.map(g => goalOptions.find(opt => opt.id === g)?.label.toLowerCase()).join(", ")}, we recommend ${dosage} daily (${dosage === "2 capsules" ? "600mg" : dosage === "1 capsule" ? "300mg" : "300-600mg"} KSM-66®).`;

    return {
      dosage,
      timing,
      expectedTimeline,
      personalizedTips: tips,
      reasoning
    };
  };

  const handleNext = () => {
    if (step < 3) {
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
        return userData.age && userData.weight && userData.biologicalSex;
      case 1:
        return userData.primaryGoals.length > 0;
      case 2:
        return userData.exerciseFrequency;
      case 3:
        return userData.timingPreference;
      default:
        return false;
    }
  };

  const recommendation = showResults ? calculateRecommendation() : null;

  if (showResults && recommendation) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-6 py-3 rounded-full font-bold text-lg mb-6">
            <Sparkles className="w-5 h-5" />
            Your Personalized Wellness Plan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Here's How to Take OptiBio
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {recommendation.reasoning}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Dosage */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-blue-700" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600 mb-2">Recommended Dosage</div>
                <div className="text-3xl font-bold text-blue-900">{recommendation.dosage}</div>
                <div className="text-sm text-slate-600 mt-1">
                  ({recommendation.dosage === "2 capsules" ? "600mg" : recommendation.dosage === "1 capsule" ? "300mg" : "300-600mg"} daily)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timing */}
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-amber-700" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600 mb-2">Best Time to Take</div>
                <div className="text-lg font-bold text-amber-900 leading-tight">
                  {recommendation.timing}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600 mb-2">Expected Results</div>
                <div className="text-lg font-bold text-green-900 leading-tight">
                  {recommendation.expectedTimeline}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personalized Tips */}
        <Card className="border-2 border-slate-200">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-amber-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Your Personalized Tips</h3>
            </div>
            <div className="space-y-3">
              {recommendation.personalizedTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-lg px-8 py-6"
            onClick={() => window.location.href = "/shop"}
          >
            Get Your Personalized Plan
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
            }}
            className="text-slate-600"
          >
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? "w-12 bg-blue-600" : i < step ? "w-8 bg-blue-400" : "w-8 bg-slate-200"
            }`}
          />
        ))}
      </div>

      <div className="text-center mb-8">
        <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
          Step {step + 1} of 4
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          {step === 0 && "Tell Us About Yourself"}
          {step === 1 && "What Are Your Wellness Goals?"}
          {step === 2 && "Your Current Lifestyle"}
          {step === 3 && "When Do You Prefer to Take Supplements?"}
        </h2>
      </div>

      <Card className="border-2 border-slate-200">
        <CardContent className="p-8 space-y-6">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 35"
                    value={userData.age}
                    onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                    min="18"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 150"
                    value={userData.weight}
                    onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                    min="80"
                    max="400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Biological Sex</Label>
                <RadioGroup
                  value={userData.biologicalSex}
                  onValueChange={(value: any) => setUserData({ ...userData, biologicalSex: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 1: Goals */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-slate-600">Select all that apply:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                      userData.primaryGoals.includes(goal.id)
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{goal.icon}</span>
                      <span className="font-semibold text-slate-900">{goal.label}</span>
                    </div>
                    {userData.primaryGoals.includes(goal.id) && (
                      <CheckCircle2 className="w-6 h-6 text-blue-600 ml-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Lifestyle */}
          {step === 2 && (
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
                    <span className="font-bold text-blue-700">{userData.stressLevel}</span>
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
                    <span className="font-bold text-blue-700">{userData.sleepQuality}</span>
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

          {/* Step 3: Timing */}
          {step === 3 && (
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
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
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
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
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
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
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
          className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700"
        >
          {step === 3 ? "Get My Plan" : "Continue"}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
