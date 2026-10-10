import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  Alert,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

/* =========================================================
   TYPES
========================================================= */

type FormState = {
  age: string;
  gender: string;
  country: string;
  academic_level: string;
  most_used_platform: string;
  purpose_of_use: string;
  avg_daily_usage_hours: string;
  daily_unlocks: string;
  study_hours: string;
  physical_activity_hours: string;
  sleep_hours_per_night: string;
  stress_level: string;
};

type InputProps = {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (name: keyof FormState, value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
};

/* =========================================================
   SCORE GAUGE
========================================================= */

function ScoreGauge({ score }: { score: number | null }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (score === null) {
      setAnimatedScore(0);
      return;
    }

    const duration = 1400;
    const startTime = Date.now();

    const animate = () => {
      const progress = Math.min(
        (Date.now() - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore(score * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const safeScore = Math.min(
    Math.max(animatedScore, 0),
    10
  );

  const getStatus = () => {
    if (safeScore < 3) {
      return {
        title: "Needs Attention",
        description:
          "Your wellbeing may need some additional attention.",
        color: "#EF4444",
        bg: "#FEF2F2",
      };
    }

    if (safeScore < 5) {
      return {
        title: "Below Average",
        description:
          "There may be some lifestyle areas worth improving.",
        color: "#F97316",
        bg: "#FFF7ED",
      };
    }

    if (safeScore < 7) {
      return {
        title: "Moderate",
        description:
          "Your wellbeing appears to be in a moderate range.",
        color: "#EAB308",
        bg: "#FEFCE8",
      };
    }

    if (safeScore < 8.5) {
      return {
        title: "Good",
        description:
          "Your lifestyle patterns indicate generally good wellbeing.",
        color: "#22C55E",
        bg: "#F0FDF4",
      };
    }

    return {
      title: "Excellent",
      description:
        "Your predicted score is in the excellent range.",
      color: "#10B981",
      bg: "#ECFDF5",
    };
  };

  const status = getStatus();

  return (
    <View className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <View className="flex-row items-center">
        <LinearGradient
          colors={["#CCFBF1", "#E0F2FE"]}
          className="h-12 w-12 items-center justify-center rounded-2xl"
        >
          <Text className="text-2xl">🧠</Text>
        </LinearGradient>

        <View className="ml-3">
          <Text className="text-lg font-bold text-slate-800">
            Mental Health Score
          </Text>

          <Text className="mt-0.5 text-xs text-slate-400">
            AI-based prediction
          </Text>
        </View>
      </View>

      {/* Score */}
      <View className="mt-8 items-center">
        <View className="relative h-40 w-40 items-center justify-center">
          {/* Outer circle */}
          <View
            className="absolute h-40 w-40 rounded-full"
            style={{
              borderWidth: 14,
              borderColor: "#E2E8F0",
            }}
          />

          {/* Progress ring */}
          <View
            className="absolute h-40 w-40 rounded-full"
            style={{
              borderWidth: 14,
              borderColor: status.color,
              borderRightColor: "transparent",
              borderBottomColor:
                safeScore < 5
                  ? "transparent"
                  : status.color,
              transform: [
                {
                  rotate: `${-45 + safeScore * 18}deg`,
                },
              ],
            }}
          />

          <View className="items-center">
            <Text className="text-4xl font-black text-slate-800">
              {safeScore.toFixed(1)}
            </Text>

            <Text className="mt-1 text-xs font-medium text-slate-400">
              OUT OF 10
            </Text>
          </View>
        </View>
      </View>

      {/* Status */}
      <View className="mt-6 items-center">
        <View
          className="flex-row items-center rounded-full px-4 py-2"
          style={{ backgroundColor: status.bg }}
        >
          <View
            className="mr-2 h-2 w-2 rounded-full"
            style={{ backgroundColor: status.color }}
          />

          <Text
            className="text-sm font-bold"
            style={{ color: status.color }}
          >
            {status.title}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text className="mt-4 text-center text-sm leading-6 text-slate-500">
        {status.description}
      </Text>

      {/* Score scale */}
      <View className="mt-7">
        <View className="mb-2 flex-row justify-between">
          {["0", "2", "4", "6", "8", "10"].map(
            (number) => (
              <Text
                key={number}
                className="text-[10px] font-bold text-slate-400"
              >
                {number}
              </Text>
            )
          )}
        </View>

        <View className="h-2 overflow-hidden rounded-full bg-slate-100">
          <View
            className="h-full rounded-full"
            style={{
              width: `${safeScore * 10}%`,
              backgroundColor: status.color,
            }}
          />
        </View>
      </View>

      {/* Disclaimer */}
      <View className="mt-6 rounded-2xl bg-slate-50 p-4">
        <Text className="text-center text-[10px] leading-5 text-slate-400">
          This result is an AI-based prediction for
          informational purposes only and is not a
          medical diagnosis.
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  keyboardType = "default",
}: InputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-bold text-slate-600">
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={(text) => onChange(name, text)}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800"
      />
    </View>
  );
}

/* =========================================================
   SELECT
========================================================= */

function Select({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-bold text-slate-600">
        {label}
      </Text>

      <Pressable
        onPress={() => setOpen((previous) => !previous)}
        className="h-14 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4"
      >
        <Text
          className={
            value
              ? "text-sm text-slate-800"
              : "text-sm text-slate-400"
          }
        >
          {value || `Select ${label}`}
        </Text>

        <Text className="text-slate-400">
          {open ? "▲" : "▼"}
        </Text>
      </Pressable>

      {open && (
        <View className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                onSelect(option);
                setOpen(false);
              }}
              className="border-b border-slate-100 px-4 py-3"
            >
              <Text
                className={
                  value === option
                    ? "text-sm font-bold text-teal-600"
                    : "text-sm text-slate-700"
                }
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function Section({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <View className="mb-5 mt-2 flex-row items-center">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
        <Text className="text-xs font-black text-teal-600">
          {number}
        </Text>
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold text-slate-800">
          {title}
        </Text>

        <Text className="mt-0.5 text-xs text-slate-400">
          {description}
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function index() {
  const [form, setForm] = useState<FormState>({
    age: "",
    gender: "",
    country: "",
    academic_level: "",
    most_used_platform: "",
    purpose_of_use: "",
    avg_daily_usage_hours: "",
    daily_unlocks: "",
    study_hours: "",
    physical_activity_hours: "",
    sleep_hours_per_night: "",
    stress_level: "",
  });

  const [score, setScore] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ScrollView reference */
  const scrollViewRef = useRef<ScrollView>(null);

  /* Result position */
  const resultPosition = useRef(0);

  const API_URL =
    process.env.EXPO_PUBLIC_API_URL ||
    "https://mental-health-prediction-6ylw.onrender.com";

  /* =======================================================
     CHANGE
  ======================================================= */

  const handleChange = (
    name: keyof FormState,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async () => {
  // ---------- CLIENT-SIDE VALIDATION ----------

  if (!form.age || Number(form.age) < 10 || Number(form.age) > 100) {
    Alert.alert(
      "Invalid Age",
      "Please enter an age between 10 and 100."
    );
    return;
  }

  if (!form.gender) {
    Alert.alert("Missing Information", "Please select your gender.");
    return;
  }

  if (!form.country) {
    Alert.alert("Missing Information", "Please select your country.");
    return;
  }

  if (!form.academic_level) {
    Alert.alert(
      "Missing Information",
      "Please select your academic level."
    );
    return;
  }

  if (!form.most_used_platform) {
    Alert.alert(
      "Missing Information",
      "Please select your most used social media platform."
    );
    return;
  }

  if (!form.purpose_of_use) {
    Alert.alert(
      "Missing Information",
      "Please select your main purpose of using social media."
    );
    return;
  }

  const usageHours = Number(form.avg_daily_usage_hours);
  if (
    !form.avg_daily_usage_hours ||
    Number.isNaN(usageHours) ||
    usageHours < 0 ||
    usageHours > 24
  ) {
    Alert.alert(
      "Invalid Usage Hours",
      "Daily usage hours must be between 0 and 24."
    );
    return;
  }

  const unlocks = Number(form.daily_unlocks);
  if (
    !form.daily_unlocks ||
    Number.isNaN(unlocks) ||
    unlocks < 0 ||
    unlocks > 500
  ) {
    Alert.alert(
      "Invalid Daily Unlocks",
      "Please enter a valid number of daily phone unlocks."
    );
    return;
  }

  const studyHours = Number(form.study_hours);
  if (
    !form.study_hours ||
    Number.isNaN(studyHours) ||
    studyHours < 0 ||
    studyHours > 24
  ) {
    Alert.alert(
      "Invalid Study Hours",
      "Study hours must be between 0 and 24."
    );
    return;
  }

  const activityHours = Number(form.physical_activity_hours);
  if (
    !form.physical_activity_hours ||
    Number.isNaN(activityHours) ||
    activityHours < 0 ||
    activityHours > 24
  ) {
    Alert.alert(
      "Invalid Physical Activity",
      "Physical activity hours must be between 0 and 24."
    );
    return;
  }

  const sleepHours = Number(form.sleep_hours_per_night);
  if (
    !form.sleep_hours_per_night ||
    Number.isNaN(sleepHours) ||
    sleepHours < 0 ||
    sleepHours > 24
  ) {
    Alert.alert(
      "Invalid Sleep Hours",
      "Sleep hours must be between 0 and 24."
    );
    return;
  }

  if (!form.stress_level) {
    Alert.alert(
      "Missing Information",
      "Please select your stress level."
    );
    return;
  }

  // ---------- SEND TO SERVER ----------

  setLoading(true);
  setError("");
  setScore(null);

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age: Number(form.age),
        gender: form.gender,
        country: form.country,
        academic_level: form.academic_level,
        most_used_platform: form.most_used_platform,
        purpose_of_use: form.purpose_of_use,
        avg_daily_usage_hours: usageHours,
        daily_unlocks: unlocks,
        study_hours: studyHours,
        physical_activity_hours: activityHours,
        sleep_hours_per_night: sleepHours,
        stress_level: form.stress_level,
      }),
    });

    const data = await response.json();

    // Don't show backend validation details directly
    if (!response.ok) {
      console.error("Backend error:", data);

      Alert.alert(
        "Unable to Analyze",
        "Please check your answers and try again."
      );

      return;
    }

    const predictedScore = Number(
      data.predicted_mental_health_score
    );

    if (Number.isNaN(predictedScore)) {
      Alert.alert(
        "Prediction Error",
        "We received an invalid result. Please try again."
      );
      return;
    }

    setScore(predictedScore);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 300);

  } catch (err) {
    console.error(err);

    Alert.alert(
      "Connection Error",
      "Unable to connect to the prediction server. Please check your internet connection and try again."
    );
  } finally {
    setLoading(false);
  }
};

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    setForm({
      age: "",
      gender: "",
      country: "",
      academic_level: "",
      most_used_platform: "",
      purpose_of_use: "",
      avg_daily_usage_hours: "",
      daily_unlocks: "",
      study_hours: "",
      physical_activity_hours: "",
      sleep_hours_per_night: "",
      stress_level: "",
    });

    setScore(null);
    setError("");

    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <SafeAreaView className="flex-1 bg-[#F5F8FA]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F8FA"
      />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <LinearGradient
          colors={[
            "#0F766E",
            "#0D9488",
            "#14B8A6",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 pb-8 pt-7"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Text className="text-2xl">
                  🧠
                </Text>
              </View>

              <View className="ml-3">
                <Text className="text-xl font-black text-white">
                  MindCheck
                </Text>

                <Text className="text-xs text-teal-100">
                  Mental Wellness Assessment
                </Text>
              </View>
            </View>

            <View className="rounded-full bg-white/15 px-3 py-2">
              <Text className="text-[10px] font-black text-white">
                AI POWERED
              </Text>
            </View>
          </View>

          {/* Hero */}

          <View className="mt-8">
            <Text className="text-3xl font-black leading-10 text-white">
              Understand your{"\n"}
              <Text className="text-teal-100">
                mental wellbeing
              </Text>
            </Text>

            <Text className="mt-4 text-sm leading-6 text-teal-50">
              Complete this short assessment to
              receive an AI-based wellbeing score
              based on your lifestyle patterns.
            </Text>
          </View>
        </LinearGradient>

        {/* =================================================
            FORM
        ================================================= */}

        <View className="px-5 pt-5">
          <View className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <View className="mb-6">
              <Text className="text-xl font-black text-slate-800">
                Assessment
              </Text>

              <Text className="mt-1 text-xs leading-5 text-slate-400">
                Your information helps estimate
                your wellbeing score.
              </Text>
            </View>

            {/* Personal */}

            <Section
              number="01"
              title="Personal Information"
              description="Tell us a little about yourself"
            />

            <Input
              label="Age"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 21"
              keyboardType="numeric"
            />

            <Select
              label="Gender"
              value={form.gender}
              onSelect={(value) =>
                handleChange(
                  "gender",
                  value
                )
              }
              options={[
                "Male",
                "Female",
                "Other",
              ]}
            />

            <Input
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="e.g. India"
            />

            <Select
              label="Academic Level"
              value={form.academic_level}
              onSelect={(value) =>
                handleChange(
                  "academic_level",
                  value
                )
              }
              options={[
                "High School",
                "Undergraduate",
                "Graduate",
              ]}
            />

            {/* Digital */}

            <Section
              number="02"
              title="Digital Behavior"
              description="Your social media usage patterns"
            />

            <Select
              label="Most Used Platform"
              value={
                form.most_used_platform
              }
              onSelect={(value) =>
                handleChange(
                  "most_used_platform",
                  value
                )
              }
              options={[
                "Facebook",
                "LinkedIn",
                "Instagram",
                "Snapchat",
                "Twitter",
                "YouTube",
                "TikTok",
                "LINE",
                "KakaoTalk",
                "VKontakte",
                "WhatsApp",
                "WeChat",
              ]}
            />

            <Select
              label="Purpose Of Use"
              value={form.purpose_of_use}
              onSelect={(value) =>
                handleChange(
                  "purpose_of_use",
                  value
                )
              }
              options={[
                "Networking",
                "Education",
                "Entertainment",
                "News",
              ]}
            />

            <Input
              label="Average Daily Usage"
              name="avg_daily_usage_hours"
              value={
                form.avg_daily_usage_hours
              }
              onChange={handleChange}
              placeholder="Hours per day"
              keyboardType="decimal-pad"
            />

            <Input
              label="Daily Unlocks"
              name="daily_unlocks"
              value={form.daily_unlocks}
              onChange={handleChange}
              placeholder="e.g. 80"
              keyboardType="numeric"
            />

            {/* Lifestyle */}

            <Section
              number="03"
              title="Lifestyle & Wellbeing"
              description="Your daily habits and wellbeing"
            />

            <Input
              label="Study Hours"
              name="study_hours"
              value={form.study_hours}
              onChange={handleChange}
              placeholder="Hours per day"
              keyboardType="decimal-pad"
            />

            <Input
              label="Physical Activity"
              name="physical_activity_hours"
              value={
                form.physical_activity_hours
              }
              onChange={handleChange}
              placeholder="Hours per day"
              keyboardType="decimal-pad"
            />

            <Input
              label="Sleep Hours"
              name="sleep_hours_per_night"
              value={
                form.sleep_hours_per_night
              }
              onChange={handleChange}
              placeholder="Hours per night"
              keyboardType="decimal-pad"
            />

            <Select
              label="Stress Level"
              value={form.stress_level}
              onSelect={(value) =>
                handleChange(
                  "stress_level",
                  value
                )
              }
              options={[
                "Low",
                "Medium",
                "High",
                "Very High",
              ]}
            />

            {/* Error */}

            {error !== "" && (
              <View className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4">
                <Text className="text-sm leading-5 text-red-600">
                  ⚠️ {error}
                </Text>
              </View>
            )}

            {/* Submit */}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="mt-2 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={[
                  "#0F766E",
                  "#0D9488",
                  "#14B8A6",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-14 flex-row items-center justify-center"
              >
                {loading ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="white"
                    />

                    <Text className="ml-2 font-bold text-white">
                      Analyzing...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="mr-2 text-lg">
                      ✨
                    </Text>

                    <Text className="font-bold text-white">
                      Predict Mental Health Score
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Reset */}

            <Pressable
              onPress={handleReset}
              disabled={loading}
              className="mt-3 h-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50"
            >
              <Text className="text-sm font-bold text-slate-600">
                Reset Assessment
              </Text>
            </Pressable>

            {/* Disclaimer */}

            <View className="mt-5 rounded-2xl bg-slate-50 p-4">
              <Text className="text-center text-[10px] leading-5 text-slate-400">
                🔒 Your responses are used only for
                generating the prediction. This tool
                provides informational results and is
                not a medical diagnosis.
              </Text>
            </View>
          </View>

          {/* =================================================
              RESULT - NOW AT THE BOTTOM
          ================================================= */}

          {score !== null && (
            <View
              className="mt-6"
              onLayout={(event) => {
                resultPosition.current =
                  event.nativeEvent.layout.y;
              }}
            >
              <View className="mb-3 flex-row items-center">
                <Text className="text-lg font-black text-slate-800">
                  Your Result
                </Text>

                <View className="ml-2 rounded-full bg-emerald-50 px-2 py-1">
                  <Text className="text-[9px] font-bold text-emerald-600">
                    ANALYZED
                  </Text>
                </View>
              </View>

              <ScoreGauge score={score} />
            </View>
          )}
        </View>

        {/* Footer */}

        <View className="mt-7 items-center">
          <Text className="text-xs font-bold text-slate-400">
            MindCheck
          </Text>

          <Text className="mt-1 text-[10px] text-slate-400">
            Mental Health Prediction System
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}