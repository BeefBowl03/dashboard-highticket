import React, { useState } from "react";
import { Wand2, RefreshCw, CheckCircle, RotateCcw } from "lucide-react";
import { checkNiche } from "../api/checkNiche";
import { generateLogo as generateLogoAPI } from "../api/generateLogo";

const LogoGenerator = () => {
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [currentMode, setCurrentMode] = useState<"normal" | "remix" | "new">(
    "normal"
  );
  const [remixInstructions, setRemixInstructions] = useState("");
  const [remixType, setRemixType] = useState<"random" | "custom" | null>(null);

  // niche states
  const [userNiche, setUserNiche] = useState("");
  const [needNiche, setNeedNiche] = useState(false);

  const generateLogo = async (
    mode: "normal" | "remix" | "new" = "normal",
    instructions?: string,
    remixKind?: "random" | "custom"
  ) => {
    setLoading(true);
    setError("");
    setCurrentMode(mode);
    if (mode === "remix") setRemixType(remixKind || null);

    try {
      // Step 1: Check niche if not supplied
      if (!userNiche) {
        const nicheData = await checkNiche(storeName.trim());

        if (!nicheData.hasNiche) {
          setNeedNiche(true);
          setLoading(false);
          return;
        } else {
          setUserNiche(nicheData.niche || '');
          setNeedNiche(false); // ✅ reset so prompt disappears
        }
      }

      // Step 2: Proceed with logo generation
      const logoParams = {
        storeName: storeName.trim(),
        niche: userNiche,
        mode: mode as 'normal' | 'remix' | 'new',
        instructions: instructions?.trim(),
      };
      
      const data = await generateLogoAPI(logoParams);
      
      setGeneratedLogo(data.imageUrl);
      // hide custom input after generation
      if (remixKind === "custom") setRemixType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetToNew = () => {
    setGeneratedLogo("");
    setStoreName("");
    setError("");
    setRemixInstructions("");
    setRemixType(null);
    setUserNiche("");
    setNeedNiche(false);
  };

  const getLoadingText = () => {
    if (currentMode === "remix") {
      if (remixType === "random") return "Generating remix randomly...";
      if (remixType === "custom")
        return "Applying custom remix instructions...";
      return "Remixing...";
    }
    if (currentMode === "new") return "Generating new concept...";
    return "Generating...";
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4">
      <div className="w-full rounded-2xl shadow-lg p-10 text-white">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{generatedLogo ? "Step 2 of 2" : "Step 1 of 2"}</span>
            <span>
              {generatedLogo ? "Download your logo" : "Enter brand name"}
            </span>
          </div>
          <div className="w-full h-1 bg-gray-700 rounded mt-2">
            <div
              className={`h-1 rounded transition-all duration-300 ${
                generatedLogo ? "w-full bg-yellow-500" : "w-1/2 bg-yellow-500"
              }`}
            ></div>
          </div>
        </div>

        {/* Step 1: Input */}
        {!generatedLogo ? (
          <>
            <h1 className="text-2xl font-bold text-yellow-500 mb-2">
              What is your brand name?
            </h1>
            <p className="text-gray-400 mb-6">
              Enter your store or business name (with correct capitalization) to
              generate a professional logo.
            </p>

            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter your store name..."
              className="w-full p-4 border border-yellow-500 rounded-lg bg-transparent text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none mb-6"
            />

            {/* niche prompt */}
            {needNiche && (
              <div className="mb-6">
                <p className="text-yellow-400 mb-2">
                  Please specify your niche (e.g., backyard, wellness, smart
                  home).
                </p>
                <input
                  type="text"
                  value={userNiche}
                  onChange={(e) => setUserNiche(e.target.value)}
                  placeholder="Enter your niche..."
                  className="w-full p-3 border border-yellow-500 rounded-lg bg-transparent text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={() => generateLogo("normal")}
              disabled={!storeName || loading || (needNiche && !userNiche)}
              className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {getLoadingText()}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  {needNiche ? "Confirm Niche & Continue" : "Generate Logo"}
                </>
              )}
            </button>

            {error && <p className="mt-4 text-red-400">{error}</p>}
          </>
        ) : (
          <>
            {/* Step 2: Results */}
            <h2 className="text-xl font-bold text-yellow-500 mb-4">
              Your Generated Logo
            </h2>
            <div className="border border-gray-700 rounded-lg p-6">
              <img
                src={generatedLogo}
                alt="Generated Logo"
                className="w-full max-w-md mx-auto"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {/* ✅ Download */}
              <a
                href={generatedLogo}
                download={`${storeName || "logo"}.png`}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Download Logo
              </a>

              {/* 🎨 Remix Buttons */}
              <button
                onClick={() => generateLogo("remix", undefined, "random")}
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Wand2 className="w-4 h-4" /> Remix Randomly
              </button>

              <button
                onClick={() => setRemixType("custom")}
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Wand2 className="w-4 h-4" /> Custom Remix
              </button>

              {remixType === "custom" && (
                <div className="w-full mt-3">
                  <textarea
                    value={remixInstructions}
                    onChange={(e) => setRemixInstructions(e.target.value)}
                    placeholder="Enter specific remix instructions..."
                    className="w-full p-2 border border-gray-600 rounded bg-transparent text-white placeholder-gray-500 mb-2"
                    rows={3}
                  />
                  <button
                    onClick={() =>
                      generateLogo("remix", remixInstructions, "custom")
                    }
                    disabled={loading || !remixInstructions}
                    className="w-full bg-yellow-500 text-black py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" /> Confirm & Generate Custom
                    Remix
                  </button>
                </div>
              )}

              {/* 🔄 New logo */}
              <button
                onClick={resetToNew}
                className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Generate New Logo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LogoGenerator;
