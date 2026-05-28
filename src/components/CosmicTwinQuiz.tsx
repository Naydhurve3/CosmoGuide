import React, { useState } from "react";
import { Sparkles, Brain, RefreshCw, Twitter, Share2, Compass, Sun, Eye } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: { text: string; trait: string }[];
}

export default function CosmicTwinQuiz() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = start, 1..5 = questions, 6 = results
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [traitsRecord, setTraitsRecord] = useState<string[]>([]);
  const [cosmicMatch, setCosmicMatch] = useState<{
    name: string;
    tagline: string;
    description: string;
    image: string;
    energyLevel: string;
    stability: string;
    dominantTrait: string;
  } | null>(null);

  const quizQuestions: Question[] = [
    {
      id: 1,
      question: "How do you handle crowded spaces and high pressure environments?",
      options: [
        { text: "I absorb the kinetic heat and direct the conversation", trait: "Gas Giant" },
        { text: "I concentrate heavily, producing dense creative bursts", trait: "Neutron Star" },
        { text: "I need wide open orbital spaces to float freely", trait: "Nebula" },
        { text: "I emit highly synchronized, predictable intervals of hyper-focus", trait: "Pulsar" }
      ]
    },
    {
      id: 2,
      question: "Choose a favorite chromatic color palette from gravitational spectrums:",
      options: [
        { text: "Luminous, blazing superheated yellows and gold", trait: "Protostar" },
        { text: "Deep, mysterious ultraviolet and cold magenta cosmic dust", trait: "Nebula" },
        { text: "Highly intense violet and gamma-ray beam emissions", trait: "Pulsar" },
        { text: "Deep solid azure or oceanic teal pressure layers", trait: "Gas Giant" }
      ]
    },
    {
      id: 3,
      question: "How do you think your friends would characterize your personal core energy?",
      options: [
        { text: "Extremely stable, warm, giving heat to the whole neighborhood", trait: "Protostar" },
        { text: "Magnetic, highly intense, sometimes slightly erratic", trait: "Neutron Star" },
        { text: "Deeply philosophical, expansive, and always building long-term", trait: "Nebula" },
        { text: "Fast-moving, clock-accurate, loud, and incredibly disciplined", trait: "Pulsar" }
      ]
    },
    {
      id: 4,
      question: "What cosmic threat would you theoretically deploy shielding against?",
      options: [
        { text: "Massive thermal expansion or system burnout", trait: "Protostar" },
        { text: "Rogue black hole magnetic orbital distortion", trait: "Neutron Star" },
        { text: "Severe atmospheric pressure changes or deep vacuum decompression", trait: "Gas Giant" },
        { text: "Rotational orbit declination or clock mismatch anomalies", trait: "Pulsar" }
      ]
    },
    {
      id: 5,
      question: "Choose your primary astronomical tool for measuring spacetime events:",
      options: [
        { text: "A high resonance atomic clock mapping frequency delays", trait: "Pulsar" },
        { text: "Infrared deep-space optical lenses imaging cosmic nebulae", trait: "Nebula" },
        { text: "Thermal sensors verifying direct core temperature scales", trait: "Protostar" },
        { text: "Magnetic field fluxmeters recording magnetic disruptions", trait: "Neutron Star" }
      ]
    }
  ];

  const handleStartQuiz = () => {
    setCurrentStep(1);
    setSelectedOpt(null);
    setTraitsRecord([]);
    setCosmicMatch(null);
  };

  const handleSelectOption = (index: number) => {
    setSelectedOpt(index);
  };

  const handleNextQuestion = () => {
    if (selectedOpt === null) return;

    // Accumulate selected trait
    const chosenTrait = quizQuestions[currentStep - 1].options[selectedOpt].trait;
    const updatedTraits = [...traitsRecord, chosenTrait];
    setTraitsRecord(updatedTraits);
    setSelectedOpt(null);

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate winner trait count
      const traitCounts: Record<string, number> = {};
      updatedTraits.forEach((t) => {
        traitCounts[t] = (traitCounts[t] || 0) + 1;
      });

      // Find the most frequent trait chosen
      let topTrait = "Nebula";
      let highestCount = 0;
      Object.entries(traitCounts).forEach(([trait, count]) => {
        if (count > highestCount) {
          highestCount = count;
          topTrait = trait;
        }
      });

      // Trigger matched cosmic personality card details
      let matchedResult = {
        name: "Luminous Solar Nebula",
        tagline: "Expansive, peaceful, the birth cradle of all chemistry.",
        description: "You represent a majestic interstellar nursery spanning dozens of light years. Quiet, reflective, and deeply collaborative, you thrive in calm creative chaos, slowly building beautiful systems over eras.",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500",
        energyLevel: "Soft, expansive",
        stability: "Extremely resilient (over billions of years)",
        dominantTrait: "Unbounded creativity & spatial presence"
      };

      if (topTrait === "Pulsar") {
        matchedResult = {
          name: "Highly Disciplined Millisecond Pulsar",
          tagline: "Laser-focused, hyper-consistent, beating like a galactic drum.",
          description: "Clock-accurate and incredibly fast, you emit powerful beams of high energy at regular intervals. Your friends rely on you when timing, absolute discipline, or strict focus parameters are critical.",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500",
          energyLevel: "Intense relativistic rotation",
          stability: "Highly secure frequency",
          dominantTrait: "Pristine metric discipline & speed"
        };
      } else if (topTrait === "Neutron Star") {
        matchedResult = {
          name: "Chrono Magnetar Neutron Star",
          tagline: "Heavy weight, dense gravitations, magnetic, highly intense.",
          description: "Packed with incredible substance, you are dense and robust! You possess a magnetic presence that warps nearby social gravity, emitting cosmic flares whenever challenged.",
          image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500",
          energyLevel: "Extreme high voltage field",
          stability: "Very solid physical core",
          dominantTrait: "Magnetic charisma & heavy core integrity"
        };
      } else if (topTrait === "Protostar") {
        matchedResult = {
          name: "Burning Main-Sequence Protostar",
          tagline: "Always warm, radiant, a stellar anchor of system logic.",
          description: "You act as the bright center of standard orbits. Generous, warm-hearted, and consistent, you generate energy continuously, acting as the vital engine of growth for all partners near you.",
          image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=500",
          energyLevel: "Radiant, thermal thermodynamic",
          stability: "Constant hydrogen-fueled equilibrium",
          dominantTrait: "Warm hospitality & bright systemic leadership"
        };
      } else if (topTrait === "Gas Giant") {
        matchedResult = {
          name: "Atmospheric Jovian Gas Giant",
          tagline: "Protective giant, multilayered pressure, massive guardian.",
          description: "Vast and deeply protective, you act as the system shield, absorbing comet deviations so standard satellites can thrive peacefully. Your personality is multilayered and robust under pressure.",
          image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500",
          energyLevel: "Dynamic, deep-current heat convective",
          stability: "High storm gas density equilibrium",
          dominantTrait: "Protective custody & resilient deep mind"
        };
      }

      setCosmicMatch(matchedResult);
      setCurrentStep(6);
    }
  };

  const getTwitterShareUrl = () => {
    if (!cosmicMatch) return "#";
    const text = `I just took the Cosmic Twin Personality Quiz on @CosmoGuide and matched as: ${cosmicMatch.name}! "${cosmicMatch.tagline}" 🌌 Discover yours now:`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
  };

  return (
    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 backdrop-blur-md rounded-2xl text-left shadow-2xl relative overflow-hidden">
      {/* Quiz start interface screen */}
      {currentStep === 0 && (
        <div className="space-y-4 text-center py-6">
          <Brain className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
          <div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider">
              AI "Cosmic Twin" Persona Quiz
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Answer 5 targeted multiple choice questions designed to analyze your mental pressure curves, chromatic tastes, and working frequencies to identify your matched planetary double.
            </p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="p-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-550 border border-indigo-500/20 text-white font-bold text-xs tracking-wider transition uppercase shadow-lg shadow-indigo-600/15 cursor-pointer inline-block"
          >
            Initiate Diagnosis
          </button>
        </div>
      )}

      {/* Question interface screen */}
      {currentStep >= 1 && currentStep <= 5 && (
        <div className="space-y-5 animate-fadeIn">
          {/* Header metrics tracking */}
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-indigo-500/10 pb-2.5 text-slate-400">
            <span>Stellar Assessment Form</span>
            <span className="text-indigo-400">Step {currentStep} of 5</span>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-white text-base leading-relaxed">
              {quizQuestions[currentStep - 1].question}
            </h5>

            <div className="grid grid-cols-1 gap-2.5">
              {quizQuestions[currentStep - 1].options.map((opt, oIdx) => {
                const isSelected = selectedOpt === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-3.5 px-5 rounded-xl border text-xs text-left transition duration-300 flex items-center justify-between group ${
                      isSelected
                        ? "bg-indigo-505/10 border-indigo-500 text-white font-bold"
                        : "bg-slate-950/45 border-slate-805 text-slate-310 hover:border-indigo-500/30"
                    }`}
                  >
                    <span>{opt.text}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                        isSelected ? "border-indigo-400 bg-indigo-600Scale" : "border-slate-800"
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Choose an answer to proceed</span>
            <button
              onClick={handleNextQuestion}
              disabled={selectedOpt === null}
              className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs tracking-wider transition disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed"
            >
              {currentStep === 5 ? "Deploy Diagnosis" : "Proceed"}
            </button>
          </div>
        </div>
      )}

      {/* Finished Output Results screen */}
      {currentStep === 6 && cosmicMatch && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/5 p-2 px-3 border border-emerald-500/10 rounded-xl mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Handshake Successful • Matched Celestial Orbit Uncovered</span>
          </div>

          {/* Results Details Block layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 rounded-xl overflow-hidden shadow-2xl border border-indigo-500/15 relative h-48 md:h-56">
              <img
                src={cosmicMatch.image}
                alt={cosmicMatch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-3 p-2 py-1 bg-indigo-600/90 rounded text-[9px] font-bold text-white uppercase tracking-widest font-mono">
                My Double
              </div>
            </div>

            <div className="md:col-span-7 text-left space-y-3">
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">Matched System Double</span>
                <h4 className="text-xl font-black text-white leading-snug">{cosmicMatch.name}</h4>
                <p className="text-xs text-indigo-200 mt-1 italic font-medium">"{cosmicMatch.tagline}"</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {cosmicMatch.description}
              </p>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1.5">
                <div className="p-2 border border-slate-850 bg-slate-950/40 rounded-lg">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">Energy Curve</span>
                  <span className="text-white font-bold truncate block mt-0.5">{cosmicMatch.energyLevel}</span>
                </div>
                <div className="p-2 border border-slate-850 bg-slate-950/40 rounded-lg">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">Resilience</span>
                  <span className="text-white font-bold truncate block mt-0.5">{cosmicMatch.stability}</span>
                </div>
                <div className="p-2 border border-slate-850 bg-slate-950/40 rounded-lg">
                  <span className="text-slate-500 block text-[8px] uppercase font-bold">Top Aspect</span>
                  <span className="text-indigo-300 font-bold truncate block mt-0.5">{cosmicMatch.dominantTrait}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social and redo buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3.5 border-t border-indigo-500/10">
            <a
              href={getTwitterShareUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex-grow py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs tracking-wider transition uppercase flex items-center justify-center space-x-2 shadow-lg shadow-indigo-650/10"
            >
              <Twitter className="w-4 h-4 fill-white" />
              <span>Broadcast Double to Twitter (X)</span>
            </a>
            <button
              onClick={handleStartQuiz}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-550 bg-slate-950 text-slate-300 text-xs font-semibold tracking-wide transition flex items-center justify-center"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Re-Diagnose
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
