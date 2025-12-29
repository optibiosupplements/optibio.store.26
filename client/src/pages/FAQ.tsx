import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Mail, ChevronRight } from "lucide-react";
// Breadcrumb styling moved to custom implementation
import { useLocation } from "wouter";
import FAQSchema from "@/components/FAQSchema";

export default function FAQ() {
  const [, setLocation] = useLocation();

  const faqs = [
    {
      category: "Product & Usage",
      questions: [
        {
          q: "What is KSM-66® Ashwagandha?",
          a: "KSM-66® is the highest concentration full-spectrum ashwagandha root extract available on the market. It's made using a proprietary extraction process that preserves all the natural constituents of the ashwagandha root in their original balance. It's the most clinically studied ashwagandha extract with over 20 peer-reviewed studies supporting its effectiveness."
        },
        {
          q: "How do I take Optibio Ashwagandha?",
          a: "Take 2 capsules daily, preferably with meals. For best results, take one capsule in the morning and one in the evening. Consistency is key—most people notice benefits within 2-4 weeks of daily use, with optimal results after 8-12 weeks."
        },
        {
          q: "When is the best time to take ashwagandha?",
          a: "Ashwagandha can be taken at any time of day. Many people prefer taking it in the morning for energy and focus, while others take it in the evening to support relaxation and sleep. We recommend splitting the dose (one capsule morning, one evening) for balanced benefits throughout the day."
        },
        {
          q: "How long does it take to see results?",
          a: "Most people begin noticing benefits within 2-4 weeks of consistent daily use. Stress and sleep improvements may be felt sooner, while benefits for physical performance and hormonal balance typically become more pronounced after 6-8 weeks. Clinical studies show optimal results after 8-12 weeks of continuous use."
        },
        {
          q: "Can I take more than the recommended dose?",
          a: "We recommend sticking to the suggested serving size of 2 capsules per day (300mg each, 600mg total), which is the dosage used in most clinical studies. While KSM-66® has an excellent safety profile, more is not necessarily better. If you have specific health goals, consult with your healthcare provider about the appropriate dosage for you."
        },
        {
          q: "Is Optibio Ashwagandha vegan?",
          a: "Yes! Our capsules are 100% vegan, made from plant-based cellulose. The KSM-66® extract itself is also vegan-friendly. We use no animal-derived ingredients, gelatin, or animal testing."
        },
        {
          q: "Does it contain any allergens?",
          a: "Our product is free from common allergens including gluten, dairy, soy, eggs, fish, shellfish, tree nuts, and peanuts. It's manufactured in a facility that follows strict allergen control protocols. However, if you have specific allergies or sensitivities, please review the full ingredient list or contact us."
        }
      ]
    },
    {
      category: "Safety & Interactions",
      questions: [
        {
          q: "Is ashwagandha safe to take daily?",
          a: "Yes, KSM-66® Ashwagandha has been extensively studied for safety and is generally recognized as safe (GRAS) for daily use. Clinical trials lasting up to 12 weeks have shown no significant adverse effects. However, as with any supplement, we recommend consulting your healthcare provider before starting, especially if you have existing health conditions."
        },
        {
          q: "Can I take ashwagandha with other supplements?",
          a: "Ashwagandha generally works well with other supplements. However, because it can have calming effects, use caution when combining with other sedative supplements or medications. Always consult your healthcare provider before combining supplements, especially if you're taking prescription medications."
        },
        {
          q: "Can I take ashwagandha with medications?",
          a: "Ashwagandha may interact with certain medications, including thyroid medications, blood pressure medications, immunosuppressants, sedatives, and diabetes medications. If you're taking any prescription medications, please consult your healthcare provider before use."
        },
        {
          q: "Is it safe during pregnancy or breastfeeding?",
          a: "We do not recommend taking ashwagandha during pregnancy or while breastfeeding without explicit approval from your healthcare provider. While ashwagandha has been used traditionally, there is insufficient modern research on its safety during pregnancy and lactation."
        },
        {
          q: "Are there any side effects?",
          a: "KSM-66® Ashwagandha is well-tolerated by most people. In rare cases, some individuals may experience mild digestive discomfort, especially when first starting. Taking it with food usually helps. If you experience any adverse effects, discontinue use and consult your healthcare provider."
        },
        {
          q: "Can children take this product?",
          a: "Our product is formulated for adults 18 years and older. We do not recommend giving this supplement to children without the guidance of a qualified healthcare professional."
        }
      ]
    },
    {
      category: "Subscription & Ordering",
      questions: [
        {
          q: "How does the subscription work?",
          a: "Our subscription service delivers your ashwagandha automatically at your chosen frequency (30, 60, or 90 days). You'll save 15% on every order, get free shipping, and can pause, skip, or cancel anytime. There are no commitments or cancellation fees."
        },
        {
          q: "Can I change or cancel my subscription?",
          a: "Absolutely! You have full control over your subscription. Log into your account to change delivery frequency, skip a shipment, update your address, or cancel anytime. You can also contact our customer support team for assistance."
        },
        {
          q: "When will my subscription renew?",
          a: "Your subscription will automatically renew based on the frequency you selected (every 30, 60, or 90 days). We'll send you an email reminder 3 days before each shipment, giving you time to make any changes."
        },
        {
          q: "Can I try it before subscribing?",
          a: "Yes! You can purchase a one-time bottle to try before committing to a subscription. Many customers start with a single bottle and then switch to subscription once they experience the benefits."
        }
      ]
    },
    {
      category: "Shipping & Returns",
      questions: [
        {
          q: "How long does shipping take?",
          a: "We offer three shipping options: Standard (3-5 business days, free over $75), Express (2-3 business days), and Overnight (1 business day). Orders are processed within 1-2 business days. You'll receive tracking information via email once your order ships."
        },
        {
          q: "Do you ship internationally?",
          a: "Currently, we only ship within the United States (all 50 states). We're working on expanding international shipping in the future. Sign up for our newsletter to be notified when we start shipping to your country."
        },
        {
          q: "What is your return policy?",
          a: "We offer a 90-day money-back guarantee. If you're not completely satisfied with your purchase, return it within 90 days for a full refund—even if the bottle is opened and partially used. We believe in our product and want you to try it risk-free."
        },
        {
          q: "How do I return a product?",
          a: "Contact our customer support team at support@optibio.com to initiate a return. We'll provide you with a return authorization and instructions. Once we receive your return, we'll process your refund within 5-7 business days."
        },
        {
          q: "What if my order arrives damaged?",
          a: "We're sorry if your order arrives damaged! Contact us immediately at support@optibio.com with photos of the damage, and we'll send you a replacement at no charge. Your satisfaction is our priority."
        }
      ]
    },
    {
      category: "Quality & Testing",
      questions: [
        {
          q: "How do I know your product is high quality?",
          a: "Every batch of Optibio Ashwagandha is third-party tested for purity, potency, and safety. We use only KSM-66®, the gold standard ashwagandha extract, manufactured in GMP-certified facilities in the USA. We provide certificates of analysis upon request and maintain complete transparency about our sourcing and testing."
        },
        {
          q: "What does third-party tested mean?",
          a: "Third-party testing means our products are analyzed by independent laboratories (not affiliated with our company) to verify purity, potency, and safety. These labs test for heavy metals, microbial contaminants, and confirm the withanolide content matches our label claims."
        },
        {
          q: "Where is your product manufactured?",
          a: "Our ashwagandha is manufactured in FDA-registered, GMP-certified facilities in the United States. While the KSM-66® extract is sourced from certified organic farms in India (ashwagandha's native region), all processing, encapsulation, and quality testing happens in the USA."
        },
        {
          q: "What's the difference between your product and cheaper alternatives?",
          a: "The main difference is the extract quality and clinical backing. Many cheaper products use generic ashwagandha (often mixed with leaves or using chemical extraction), have inconsistent potency, and lack clinical research. Optibio uses KSM-66®, the most studied extract with over 20 clinical trials, standardized to 5% withanolides, and extracted using only water and milk (no harsh chemicals)."
        },
        {
          q: "How should I store my ashwagandha?",
          a: "Store your bottle in a cool, dry place away from direct sunlight and moisture. Keep the lid tightly closed. No refrigeration is needed. When stored properly, the product will maintain its potency through the expiration date printed on the bottle."
        }
      ]
    }
  ];

  // Flatten all FAQs for schema
  const allFAQs = faqs.flatMap(category => 
    category.questions.map(q => ({
      question: q.q,
      answer: q.a
    }))
  );

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at center, #F8FCFE 0%, #EBF5FB 40%, #D6EAF8 100%)' }}>
      {/* FAQ Schema for Rich Snippets */}
      <FAQSchema faqs={allFAQs} />
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#C9A961]/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#1E3A5F]/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container relative z-10">
          <nav className="flex items-center gap-2 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-2">
            <a href="/" className="text-slate-500 hover:text-[#1E3A5F] transition-colors">
              Home
            </a>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-[#1E3A5F] font-bold">
              FAQ
            </span>
          </nav>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="px-5 py-2 bg-gradient-to-r from-[#C9A961] to-[#F7F4EF]0 text-slate-900 border-0 shadow-gold">
              <HelpCircle className="w-4 h-4 mr-2 inline" />
              <span className="font-bold">Frequently Asked Questions</span>
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-[#1E3A5F] leading-tight">
              How Can We Help?
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Find answers to common questions about Optibio Ashwagandha, usage, shipping, and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 -mt-12 relative z-20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="border-2 border-slate-200 shadow-md bg-white">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6 pb-4 border-b-2 border-[#1E3A5F]/20 flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-[#1E3A5F]" />
                    {section.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {section.questions.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${sectionIndex}-${faqIndex}`}
                        className="border rounded-lg px-6 bg-slate-50/50"
                      >
                        <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-[#1E3A5F] py-4">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-700 leading-relaxed pb-4">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container">
          <Card className="border-2 border-slate-200 shadow-md bg-white max-w-3xl mx-auto">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#1E3A5F]/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-[#1E3A5F]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1E3A5F] mb-3">
                  Still Have Questions?
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Our customer support team is here to help. We typically respond within 24 hours.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => window.location.href = "mailto:support@optibio.com"}
                  size="lg"
                  className="bg-[#1E3A5F] hover:bg-[#2563EB] text-white font-bold"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button
                  onClick={() => setLocation("/shop")}
                  size="lg"
                  variant="outline"
                  className="border-2"
                >
                  Shop Now
                </Button>
              </div>
              <p className="text-sm text-slate-500">
                Email: <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:underline">support@optibio.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
