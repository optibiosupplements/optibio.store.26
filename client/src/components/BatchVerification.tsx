import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Search, CheckCircle2, Download, Calendar, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function BatchVerification() {
  const [lotNumber, setLotNumber] = useState("");
  const [searchedLotNumber, setSearchedLotNumber] = useState("");
  
  const { data, isLoading, error } = trpc.batches.verify.useQuery(
    { lotNumber: searchedLotNumber },
    { enabled: searchedLotNumber.length > 0 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedLotNumber(lotNumber.trim().toUpperCase());
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="border-2 border-[#C9A961]/20 shadow-cream bg-gradient-to-br from-[#F7F4EF]/80 to-[#F7F4EF]/80">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Verify Your Batch</h3>
              <p className="text-sm text-slate-600">
                Enter your product lot number to view batch-specific test results and certificates.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Lot number can be found on the bottom of your bottle (e.g., ASH-2024-11-001)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter lot number (e.g., ASH-2024-11-001)"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                className="flex-1 bg-white border-[#C9A961]/20 focus:border-[#C9A961]"
              />
              <Button
                type="submit"
                disabled={!lotNumber.trim() || isLoading}
                className="bg-gradient-to-r from-[#C9A961] to-[#F7F4EF]0 hover:from-[#F7F4EF]0 hover:to-[#B89651] text-slate-900 font-semibold shadow-gold"
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Searching..." : "Verify"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {searchedLotNumber && data && (
        <div className="space-y-4">
          {data.found ? (
            <>
              {/* Batch Info Card */}
              <Card className="border-2 border-[#C9A961]/20 shadow-lg bg-gradient-to-br from-[#F7F4EF]/80 to-[#F7F4EF]/80">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-6 w-6 text-[#B89651]" />
                        <h3 className="text-xl font-bold text-slate-900">Batch Verified</h3>
                      </div>
                      <p className="text-sm text-slate-600">
                        This batch has passed all quality control tests
                      </p>
                    </div>
                    <Badge className="bg-[#B89651] text-white">Authentic</Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-medium">Lot Number</p>
                      <p className="text-sm font-bold text-slate-900">{data.batch?.lotNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Manufactured
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {data.batch?.manufactureDate && formatDate(data.batch.manufactureDate)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {data.batch?.expiryDate && formatDate(data.batch.expiryDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Results */}
              {data.batch?.testResults && (
                <Card className="border-2 border-[#C9A961]/20 shadow-cream bg-gradient-to-br from-[#F7F4EF]/80 to-[#F7F4EF]/80">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold mb-4 text-slate-900">Test Results</h4>
                    
                    <div className="space-y-4">
                      {/* Potency */}
                      <div className="bg-white/60 rounded-lg p-4 border border-[#C9A961]/10">
                        <h5 className="font-semibold text-sm mb-2 text-slate-900">Potency & Purity</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-slate-500">Withanolides</p>
                            <p className="text-sm font-bold text-[#B89651]">{data.batch.testResults.withanolides}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Purity</p>
                            <p className="text-sm font-bold text-[#B89651]">{data.batch.testResults.purity}</p>
                          </div>
                        </div>
                      </div>

                      {/* Heavy Metals */}
                      <div className="bg-white/60 rounded-lg p-4 border border-[#C9A961]/10">
                        <h5 className="font-semibold text-sm mb-2 text-slate-900">Heavy Metals (ICP-MS)</h5>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(data.batch.testResults.heavyMetals).map(([metal, value]) => (
                            <div key={metal}>
                              <p className="text-xs text-slate-500 capitalize">{metal}</p>
                              <p className="text-sm font-semibold text-[#B89651]">{value as string}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Microbial */}
                      <div className="bg-white/60 rounded-lg p-4 border border-[#C9A961]/10">
                        <h5 className="font-semibold text-sm mb-2 text-slate-900">Microbial Testing</h5>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(data.batch.testResults.microbial).map(([test, value]) => (
                            <div key={test}>
                              <p className="text-xs text-slate-500 capitalize">{test.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-sm font-semibold text-[#B89651]">{value as string}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Download Documents */}
              <Card className="border-2 border-[#C9A961]/20 shadow-cream bg-gradient-to-br from-[#F7F4EF]/80 to-[#F7F4EF]/80">
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold mb-4 text-slate-900">Download Documents</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.batch?.coaUrl && (
                      <a
                        href={data.batch?.coaUrl}
                        download
                        className="flex items-center gap-2 p-3 bg-white/80 hover:bg-white border border-[#C9A961]/20 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4 text-[#B89651]" />
                        <span className="text-sm font-semibold text-slate-900">Certificate of Analysis</span>
                      </a>
                    )}
                    {data.batch?.heavyMetalsTestUrl && (
                      <a
                        href={data.batch?.heavyMetalsTestUrl}
                        download
                        className="flex items-center gap-2 p-3 bg-white/80 hover:bg-white border border-[#C9A961]/20 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4 text-[#B89651]" />
                        <span className="text-sm font-semibold text-slate-900">Heavy Metals Test</span>
                      </a>
                    )}
                    {data.batch?.microbialTestUrl && (
                      <a
                        href={data.batch?.microbialTestUrl}
                        download
                        className="flex items-center gap-2 p-3 bg-white/80 hover:bg-white border border-[#C9A961]/20 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4 text-[#B89651]" />
                        <span className="text-sm font-semibold text-slate-900">Microbial Test</span>
                      </a>
                    )}
                    {data.batch?.potencyTestUrl && (
                      <a
                        href={data.batch?.potencyTestUrl}
                        download
                        className="flex items-center gap-2 p-3 bg-white/80 hover:bg-white border border-[#C9A961]/20 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4 text-[#B89651]" />
                        <span className="text-sm font-semibold text-slate-900">Potency Test (HPLC)</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-2 border-red-200 shadow-lg bg-gradient-to-br from-red-50/80 to-rose-50/80">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-[#D4745F] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Batch Not Found</h3>
                    <p className="text-sm text-slate-600 mb-2">{data.message}</p>
                    <p className="text-xs text-slate-500">
                      Please verify the lot number on your bottle and try again. If the issue persists, contact our support team at support@optibio.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
