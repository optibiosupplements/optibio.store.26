import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Award,
  Microscope,
  Factory,
  CheckCircle2,
  FileCheck,
  Leaf,
  Beaker,
  Users,
  ArrowRight,
  FlaskConical,
  ClipboardCheck,
  Sparkles,
  Download,
  FileText,
} from "lucide-react";
import { useLocation } from "wouter";
import BatchVerification from "@/components/BatchVerification";

export default function Quality() {
  const [, setLocation] = useLocation();

  const certifications = [
    {
      icon: Award,
      title: "GMP Certified",
      description: "Manufactured in FDA-registered, Good Manufacturing Practice certified facilities"
    },
    {
      icon: Microscope,
      title: "Third-Party Tested",
      description: "Every batch independently tested for purity, potency, and safety"
    },
    {
      icon: Leaf,
      title: "Organic & Non-GMO",
      description: "Certified organic ashwagandha sourced from sustainable farms"
    },
    {
      icon: Shield,
      title: "Heavy Metal Tested",
      description: "Tested for lead, mercury, arsenic, and cadmium below detection limits"
    },
    {
      icon: FileCheck,
      title: "COA Available",
      description: "Certificate of Analysis provided for complete transparency"
    },
    {
      icon: Beaker,
      title: "Microbial Testing",
      description: "Tested for bacteria, yeast, mold, and pathogens"
    }
  ];

  const manufacturingSteps = [
    {
      step: 1,
      title: "Sourcing",
      description: "Premium ashwagandha roots sourced from certified organic farms in India, the plant's native region where it thrives naturally.",
      icon: Leaf
    },
    {
      step: 2,
      title: "Extraction",
      description: "Proprietary 14-day extraction process using only water and milk—no harsh chemicals or solvents. This preserves all bioactive compounds in their natural ratios.",
      icon: FlaskConical
    },
    {
      step: 3,
      title: "Standardization",
      description: "Extract standardized to 5% withanolides through rigorous testing to ensure consistent potency in every batch.",
      icon: Microscope
    },
    {
      step: 4,
      title: "Encapsulation",
      description: "Encapsulated in GMP-certified facilities in the USA using vegan cellulose capsules. No fillers, binders, or artificial ingredients.",
      icon: Factory
    },
    {
      step: 5,
      title: "Testing",
      description: "Comprehensive third-party testing for purity (heavy metals, pesticides), potency (withanolide content), and safety (microbial contaminants).",
      icon: ClipboardCheck
    },
    {
      step: 6,
      title: "Quality Assurance",
      description: "Final inspection and COA verification before packaging. Only batches meeting our strict standards are released.",
      icon: CheckCircle2
    }
  ];

  const testingProtocols = [
    {
      category: "Purity Testing",
      tests: [
        "Heavy metals (Lead, Mercury, Arsenic, Cadmium)",
        "Pesticide residue screening",
        "Solvent residue analysis",
        "Allergen testing"
      ]
    },
    {
      category: "Potency Testing",
      tests: [
        "Withanolide content (HPLC)",
        "Active compound verification",
        "Standardization confirmation",
        "Bioavailability assessment"
      ]
    },
    {
      category: "Safety Testing",
      tests: [
        "Microbial contamination (bacteria, yeast, mold)",
        "Pathogen screening (E. coli, Salmonella)",
        "Mycotoxin testing",
        "Stability testing"
      ]
    },
    {
      category: "Identity Testing",
      tests: [
        "DNA authentication (species verification)",
        "Organoleptic analysis",
        "Microscopic examination",
        "TLC fingerprinting"
      ]
    }
  ];

  const qualityDocuments = [
    {
      title: "Certificate of Analysis (COA)",
      description: "Complete analysis of product composition, purity, and potency for current batch",
      filename: "COA-Sample-Batch.pdf",
      icon: FileCheck,
      category: "Quality Assurance"
    },
    {
      title: "Heavy Metals Testing Report",
      description: "Third-party ICP-MS testing for lead, arsenic, cadmium, and mercury",
      filename: "Heavy-Metals-Test-Report.pdf",
      icon: Microscope,
      category: "Safety Testing"
    },
    {
      title: "Microbial Testing Report",
      description: "Comprehensive microbial analysis including bacteria, yeast, mold, and pathogens",
      filename: "Microbial-Test-Report.pdf",
      icon: Beaker,
      category: "Safety Testing"
    },
    {
      title: "Potency Testing Report (HPLC)",
      description: "Withanolide content analysis by High-Performance Liquid Chromatography",
      filename: "Potency-Test-Report.pdf",
      icon: FlaskConical,
      category: "Potency Verification"
    }
  ];

  const qualityStandards = [
    {
      standard: "FDA Registered Facilities",
      description: "All manufacturing occurs in FDA-registered facilities that comply with current Good Manufacturing Practices (cGMP) for dietary supplements."
    },
    {
      standard: "ISO 9001:2015",
      description: "Quality management system certified to international standards for consistent product quality and customer satisfaction."
    },
    {
      standard: "USDA Organic",
      description: "Certified organic ashwagandha sourced from farms that meet USDA organic standards—no synthetic pesticides or fertilizers."
    },
    {
      standard: "Non-GMO Project Verified",
      description: "Verified non-GMO through rigorous testing and traceability protocols to ensure genetic integrity."
    },
    {
      standard: "Kosher & Halal Certified",
      description: "Certified to meet religious dietary requirements, expanding accessibility to all communities."
    },
    {
      standard: "GRAS Status",
      description: "KSM-66® Ashwagandha has Generally Recognized as Safe (GRAS) status based on extensive safety data and historical use."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 border-0 shadow-gold">
              <Shield className="w-4 h-4 mr-2 inline" />
              <span className="font-bold">Quality You Can Trust</span>
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Our Quality System
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mx-auto">
              Every bottle meets the highest standards of purity, potency, and safety. Here's how we ensure exceptional quality from farm to bottle.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="py-16 -mt-12 relative z-20">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <Card key={index} className="border-2 border-yellow-100 shadow-cream hover:shadow-gold transition-all bg-gradient-to-br from-yellow-50/80 to-amber-50/80">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">{cert.title}</h3>
                      <p className="text-sm text-slate-600">{cert.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Manufacturing Process</h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                Our 6-step process ensures every capsule delivers consistent, reliable results backed by science.
              </p>
            </div>

            <div className="space-y-6">
              {manufacturingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                            <Icon className="w-10 h-10 text-[#C9A961]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-green-700 text-white">Step {step.step}</Badge>
                            <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{step.description}</p>
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

      {/* Testing Protocols */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Comprehensive Testing Protocols</h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                Every batch undergoes rigorous third-party testing across multiple categories to ensure safety and efficacy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {testingProtocols.map((protocol, index) => (
                <Card key={index} className="border-2 border-slate-200 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                        <Microscope className="w-6 h-6 text-[#C9A961]" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{protocol.category}</h3>
                    </div>
                    <ul className="space-y-3">
                      {protocol.tests.map((test, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle2 className="w-5 h-5 text-[#C9A961] flex-shrink-0 mt-0.5" />
                          <span>{test}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Quality Standards & Certifications</h2>
              <p className="text-slate-600 text-lg">
                We adhere to the highest industry standards and maintain multiple certifications.
              </p>
            </div>

            <div className="space-y-4">
              {qualityStandards.map((item, index) => (
                <Card key={index} className="border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-[#C9A961]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">{item.standard}</h3>
                        <p className="text-slate-700 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Team */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-white">
        <div className="container">
          <Card className="border-2 border-[#C9A961]/30 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mx-auto">
                  <Users className="w-10 h-10 text-[#C9A961]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Dedicated Quality Assurance Team
                  </h2>
                  <p className="text-slate-700 leading-relaxed max-w-2xl mx-auto mb-6">
                    Our quality assurance team includes PhD-level scientists, certified quality professionals, and experienced technicians who oversee every aspect of production. They conduct regular audits, review testing data, and ensure compliance with all regulatory requirements.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Badge variant="outline" className="bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30 px-4 py-2">
                      <Sparkles className="w-4 h-4 mr-2" />
                      PhD Scientists
                    </Badge>
                    <Badge variant="outline" className="bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30 px-4 py-2">
                      <Shield className="w-4 h-4 mr-2" />
                      QA Certified
                    </Badge>
                    <Badge variant="outline" className="bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30 px-4 py-2">
                      <Microscope className="w-4 h-4 mr-2" />
                      Lab Technicians
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Batch Verification Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 border-0 shadow-gold">
                <Shield className="w-4 h-4 mr-2 inline" />
                <span className="font-bold">Batch Verification</span>
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4">Verify Your Product Batch</h2>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                Enter your product lot number to access batch-specific test results, certificates of analysis, and complete quality documentation for your specific bottle.
              </p>
            </div>
            
            <BatchVerification />
          </div>
        </div>
      </section>

      {/* Document Library Section */}
      <section className="py-16 bg-gradient-to-br from-[#F7F4EF] via-white to-green-50/20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-5 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 border-0 shadow-gold">
                <FileText className="w-4 h-4 mr-2 inline" />
                <span className="font-bold">Transparency & Documentation</span>
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Quality Documents Library</h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                Download our complete quality documentation. All sensitive information has been redacted for privacy while maintaining full transparency about our testing standards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {qualityDocuments.map((doc, index) => {
                const Icon = doc.icon;
                return (
                  <Card key={index} className="border-2 border-yellow-100 shadow-cream hover:shadow-gold transition-all bg-gradient-to-br from-yellow-50/80 to-amber-50/80 group">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-2">
                            {doc.category}
                          </Badge>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{doc.title}</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{doc.description}</p>
                        </div>
                      </div>
                      <a
                        href={`/documents/${doc.filename}`}
                        download
                        className="block"
                      >
                        <Button
                          className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold shadow-gold hover:shadow-glow-gold transition-all"
                          size="lg"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </a>
                      <p className="text-xs text-slate-500 text-center mt-3">
                        <FileText className="w-3 h-3 inline mr-1" />
                        {doc.filename}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-8 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50/80 to-amber-50/80">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">About These Documents</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      All documents are from third-party certified laboratories accredited to ISO/IEC 17025:2017 standards. 
                      Sensitive information including exact batch numbers, manufacturer details, and proprietary formulations 
                      have been redacted for privacy and competitive reasons. These sample documents represent our typical 
                      testing protocols and quality standards. For specific batch information, please contact customer support 
                      with your product lot number.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <Card className="border-2 border-[#C9A961]/30 shadow-2xl bg-gradient-to-br from-green-50 to-white max-w-3xl mx-auto">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-[#C9A961]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Experience the Difference Quality Makes
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  When you choose OptiBio, you're choosing a product backed by rigorous quality standards, transparent testing, and unwavering commitment to excellence.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => setLocation("/shop")}
                  size="lg"
                  className="bg-gradient-to-r from-[#1E3A5F] to-[#152B45] hover:from-[#152B45] hover:to-[#1E3A5F] shadow-lg"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => setLocation("/science")}
                  size="lg"
                  variant="outline"
                  className="border-2"
                >
                  View Clinical Studies
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
