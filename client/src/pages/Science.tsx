import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Microscope, Brain, Heart, Dumbbell, Moon, Shield, TrendingUp, Users, FileText, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

export default function Science() {
  const [, setLocation] = useLocation();

  const studies = [
    {
      title: "Stress & Anxiety Reduction",
      icon: Shield,
      percentage: "44%",
      metric: "reduction in stress",
      description: "Double-blind, placebo-controlled study showed significant reductions in stress and anxiety levels with no adverse effects.",
      participants: 64,
      duration: "60 days",
      journal: "Indian Journal of Psychological Medicine",
      year: 2012,
      link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3573577/",
      findings: [
        "44% reduction in perceived stress scale scores",
        "Significant decrease in serum cortisol levels",
        "Improved overall quality of life markers",
        "No adverse effects reported"
      ]
    },
    {
      title: "Cognitive Function & Memory",
      icon: Brain,
      percentage: "27.9%",
      metric: "improvement in memory",
      description: "Clinical trial showed significant improvements in immediate and general memory, executive function, and attention.",
      participants: 50,
      duration: "8 weeks",
      journal: "Journal of Dietary Supplements",
      year: 2017,
      link: "https://pubmed.ncbi.nlm.nih.gov/28471731/",
      findings: [
        "27.9% improvement in immediate memory",
        "Enhanced executive function",
        "Better sustained attention",
        "Improved information processing speed"
      ]
    },
    {
      title: "Sleep Quality Enhancement",
      icon: Moon,
      percentage: "72%",
      metric: "improvement in sleep quality",
      description: "Study demonstrated significant improvements in sleep quality, sleep onset latency, and overall sleep efficiency.",
      participants: 80,
      duration: "10 weeks",
      journal: "PLOS ONE",
      year: 2020,
      link: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257843",
      findings: [
        "72% improvement in overall sleep quality",
        "Reduced time to fall asleep",
        "Increased sleep efficiency",
        "Better mental alertness upon waking"
      ]
    },
    {
      title: "Physical Performance & Strength",
      icon: Dumbbell,
      percentage: "15%",
      metric: "increase in muscle strength",
      description: "Resistance training study showed significant increases in muscle strength, size, and recovery.",
      participants: 57,
      duration: "8 weeks",
      journal: "Journal of the International Society of Sports Nutrition",
      year: 2015,
      link: "https://pubmed.ncbi.nlm.nih.gov/26609282/",
      findings: [
        "Significantly greater increases in muscle strength",
        "Larger increase in muscle size",
        "Greater reduction in exercise-induced muscle damage",
        "Increased testosterone levels"
      ]
    },
    {
      title: "Cardiorespiratory Endurance",
      icon: Heart,
      percentage: "13%",
      metric: "increase in VO2 max",
      description: "Study on athletic adults showed significant improvements in cardiorespiratory endurance and quality of life.",
      participants: 50,
      duration: "12 weeks",
      journal: "AYU Journal",
      year: 2015,
      link: "https://pubmed.ncbi.nlm.nih.gov/26195901/",
      findings: [
        "Significant improvement in VO2 max",
        "Enhanced cardiorespiratory endurance",
        "Better overall quality of life",
        "Improved physical health scores"
      ]
    },
    {
      title: "Testosterone & Male Fertility",
      icon: TrendingUp,
      percentage: "17%",
      metric: "increase in testosterone",
      description: "Clinical study on men showed significant increases in testosterone levels and improvements in sperm quality.",
      participants: 46,
      duration: "90 days",
      journal: "Evidence-Based Complementary and Alternative Medicine",
      year: 2013,
      link: "https://pubmed.ncbi.nlm.nih.gov/24371462/",
      findings: [
        "16.7% increase in testosterone levels",
        "Improved sperm concentration and motility",
        "Better overall reproductive health",
        "Enhanced vitality and well-being"
      ]
    }
  ];

  const benefits = [
    {
      icon: Brain,
      title: "Mental Clarity & Focus",
      description: "Supports cognitive function, memory, and concentration through stress reduction and neuroprotective effects."
    },
    {
      icon: Shield,
      title: "Stress Resilience",
      description: "Helps the body adapt to physical and mental stress by regulating cortisol and supporting adrenal function."
    },
    {
      icon: Moon,
      title: "Better Sleep",
      description: "Promotes restful sleep by reducing stress and anxiety, helping you wake up refreshed and energized."
    },
    {
      icon: Dumbbell,
      title: "Physical Performance",
      description: "Enhances strength, endurance, and recovery for both athletes and active individuals."
    },
    {
      icon: Heart,
      title: "Overall Wellness",
      description: "Supports immune function, cardiovascular health, and overall vitality for long-term well-being."
    },
    {
      icon: TrendingUp,
      title: "Hormonal Balance",
      description: "Helps maintain healthy hormone levels, supporting energy, mood, and reproductive health."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-300/30 backdrop-blur-sm">
              <Microscope className="w-4 h-4 text-blue-100" />
              <span className="text-blue-100 text-sm font-semibold">Evidence-Based Research</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              The Science Behind KSM-66®
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Over 20 peer-reviewed clinical studies validate the effectiveness of KSM-66® Ashwagandha. 
              Discover the research that makes it the gold standard in adaptogenic supplements.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">20+</div>
                <div className="text-sm text-blue-200">Clinical Studies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">1,000+</div>
                <div className="text-sm text-blue-200">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">14</div>
                <div className="text-sm text-blue-200">Years of Research</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is KSM-66 */}
      <section className="py-16 -mt-12 relative z-20">
        <div className="container">
          <Card className="border-2 border-slate-200 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-12 space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900">What Makes KSM-66® Different?</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full" />
              </div>
              
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  <strong>KSM-66®</strong> is the most clinically studied ashwagandha extract in the world. Unlike other ashwagandha supplements that use leaves or a mixture of plant parts, KSM-66® is made exclusively from the <strong>root of the ashwagandha plant</strong>—the part traditionally used in Ayurvedic medicine for thousands of years.
                </p>

                <p>
                  What sets KSM-66® apart is its <strong>full-spectrum extraction process</strong>. This proprietary method preserves all the bioactive compounds in their natural ratios, including withanolides, alkaloids, and other beneficial phytochemicals. The result is a high-concentration extract (5% withanolides) that delivers consistent, reliable results.
                </p>

                <div className="grid md:grid-cols-2 gap-4 py-4">
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h3 className="font-bold text-green-900 mb-2">✓ KSM-66® Ashwagandha</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Root-only extract</li>
                      <li>• Full-spectrum (all compounds)</li>
                      <li>• 5% withanolides standardized</li>
                      <li>• 20+ clinical studies</li>
                      <li>• Organic & non-GMO</li>
                      <li>• No chemical solvents</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <h3 className="font-bold text-red-900 mb-2">✗ Generic Ashwagandha</h3>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Mixed leaves and roots</li>
                      <li>• Isolated compounds only</li>
                      <li>• Variable withanolide content</li>
                      <li>• Limited or no studies</li>
                      <li>• Unknown sourcing</li>
                      <li>• Chemical extraction methods</li>
                    </ul>
                  </div>
                </div>

                <p>
                  The extraction process uses only <strong>water and milk</strong>—no harsh chemicals or solvents. This "green chemistry" approach takes 14 days to complete, but it ensures the highest purity and bioavailability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Clinical Studies */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Clinical Research & Results</h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                Every claim we make is backed by rigorous, peer-reviewed clinical trials. Here's what the science shows:
              </p>
            </div>

            <div className="grid gap-6">
              {studies.map((study, index) => {
                const Icon = study.icon;
                return (
                  <Card key={index} className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Icon & Metric */}
                        <div className="flex-shrink-0 text-center md:text-left">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mx-auto md:mx-0 mb-4">
                            <Icon className="w-10 h-10 text-blue-700" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-4xl font-bold text-blue-700">{study.percentage}</div>
                            <div className="text-sm text-slate-600 font-medium">{study.metric}</div>
                          </div>
                        </div>

                        {/* Right: Study Details */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{study.title}</h3>
                            <p className="text-slate-700">{study.description}</p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <Badge variant="outline" className="bg-slate-50">
                              <Users className="w-3 h-3 mr-1" />
                              {study.participants} participants
                            </Badge>
                            <Badge variant="outline" className="bg-slate-50">
                              <FileText className="w-3 h-3 mr-1" />
                              {study.duration}
                            </Badge>
                            <a href={study.link} target="_blank" rel="noopener noreferrer">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors">
                                {study.journal} ({study.year}) →
                              </Badge>
                            </a>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 mb-2">Key Findings:</h4>
                            <ul className="space-y-1">
                              {study.findings.map((finding, i) => (
                                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                  <span className="text-green-600 mt-0.5">✓</span>
                                  <span>{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Health Benefits</h2>
              <p className="text-slate-600 text-lg">
                KSM-66® supports multiple aspects of health and wellness through its adaptogenic properties.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-2 border-blue-200 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">{benefit.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Quality */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-slate-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Shield className="w-7 h-7 text-green-600" />
                  Safety & Quality Assurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    <strong>KSM-66® has an outstanding safety profile</strong> established through extensive clinical research. Across all studies, no significant adverse effects have been reported, making it suitable for long-term daily use.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
                    <h3 className="font-bold text-green-900 text-lg">Clinical Safety Data:</h3>
                    <ul className="space-y-2 text-green-800">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>GRAS Status:</strong> Generally Recognized As Safe by regulatory authorities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>No Adverse Effects:</strong> Extensive safety studies show excellent tolerability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Third-Party Tested:</strong> Every batch tested for purity and potency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Organic Certified:</strong> USDA Organic and non-GMO verified</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span><strong>Heavy Metal Testing:</strong> Tested for lead, mercury, arsenic, and cadmium</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-slate-600 italic">
                    Note: As with any supplement, consult your healthcare provider before use, especially if you are pregnant, nursing, taking medications, or have a medical condition.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="border-2 border-blue-200 shadow-2xl bg-gradient-to-br from-blue-50 to-white max-w-4xl mx-auto">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">
                Experience the Benefits of Research-Backed Ashwagandha
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Join thousands who have discovered the power of KSM-66®. Every bottle is backed by science and our 90-day money-back guarantee.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => setLocation("/shop")}
                  size="lg"
                  className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg text-lg px-8"
                >
                  Shop Now
                </Button>
                <Button
                  onClick={() => setLocation("/about")}
                  size="lg"
                  variant="outline"
                  className="border-2 text-lg px-8"
                >
                  Learn About Our Quality
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* References Section */}
      <section className="py-12 bg-slate-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Scientific References</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>1. Chandrasekhar, K., Kapoor, J., & Anishetty, S. (2012). A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults. Indian Journal of Psychological Medicine, 34(3), 255-262.</p>
              <p>2. Choudhary, D., Bhattacharyya, S., & Bose, S. (2017). Efficacy and Safety of Ashwagandha (Withania somnifera (L.) Dunal) Root Extract in Improving Memory and Cognitive Functions. Journal of Dietary Supplements, 14(6), 599-612.</p>
              <p>3. Deshpande, A., Irani, N., Balkrishnan, R., & Benny, I. R. (2020). A randomized, double blind, placebo controlled study to evaluate the effects of ashwagandha (Withania somnifera) extract on sleep quality in healthy adults. Sleep Medicine, 72, 28-36.</p>
              <p>4. Wankhede, S., Langade, D., Joshi, K., Sinha, S. R., & Bhattacharyya, S. (2015). Examining the effect of Withania somnifera supplementation on muscle strength and recovery: a randomized controlled trial. Journal of the International Society of Sports Nutrition, 12, 43.</p>
              <p>5. Choudhary, B., Shetty, A., & Langade, D. G. (2015). Efficacy of Ashwagandha (Withania somnifera [L.] Dunal) in improving cardiorespiratory endurance in healthy athletic adults. AYU Journal, 36(1), 63-68.</p>
              <p>6. Ambiye, V. R., Langade, D., Dongre, S., Aptikar, P., Kulkarni, M., & Dongre, A. (2013). Clinical Evaluation of the Spermatogenic Activity of the Root Extract of Ashwagandha (Withania somnifera) in Oligospermic Males: A Pilot Study. Evidence-Based Complementary and Alternative Medicine, 2013, 571420.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
