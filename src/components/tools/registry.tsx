import type { ComponentType } from "react";
import { DogAgeCalculator } from "@/components/tools/dog-age-calculator";
import { CatAgeCalculator } from "@/components/tools/cat-age-calculator";
import { DogFoodCalculator } from "@/components/tools/dog-food-calculator";
import { PetNameGenerator } from "@/components/tools/pet-name-generator";
import {
  CalorieCalculator, IdealWeightCalculator, BCSCalculator, TreatCalorieCalculator,
  PregnancyCalculator, VaccinationSchedule, CostCalculator, LifeExpectancyCalculator,
  WaterCalculator, GroomingSchedule, ChecklistTool, UniversalNameGenerator,
  ExpenseTracker, FeedingPlanner, MedicationCalculator, InsuranceCalculator,
  BirthdayAgeCalculator, SitterRateCalculator, BoardingCostEstimator,
  MultiPetCostCalculator, VaccineReminder,
} from "@/components/tools/shared-tools";
import {
  DogWalkingCalculator, DogExerciseCalculator, PuppyGrowthCalculator, DogHeatCycleTracker,
} from "@/components/tools/dog-tools";
import {
  CatFoodCalculator, KittenGrowthCalculator, CatLitterCalculator, CatPlayTimeCalculator,
} from "@/components/tools/cat-tools";
import { PetCarePlanner } from "@/components/tools/general-tools";
import { SmartCollarQRTool } from "@/components/tools/smart-collar-qr";
import {
  BirdCageSize, BirdFood, BirdLifespan, BirdWingClipGuide,
  AquariumVolume, FishStocking, TankCyclingTracker, WaterChangeScheduler,
  FishFood, HeaterWattage, AquariumLighting, FishTankCost,
  RabbitHay, RabbitCageSize, RabbitFood, RabbitAge,
  HamsterCageSize, HamsterFood, GuineaPigVitaminC, HamsterLifespan,
  ReptileEnclosure, ReptileUVB, ReptileFeeder, SnakeFeedingSchedule, TurtleTank,
  HorseFeed, HorseWater, HorseAge, HorseBCS,
  ChickenCoopSize, ChickenEggProduction, GoatFeed, DuckPondSize,
  DogChocolateToxicity, DogBenadrylDose, CatLitterBoxCount,
  PetCarbonPawprint, PetMemorialGenerator,
} from "@/components/tools/species-tools";
import {
  DogPoopBagCalculator, DogCrateSize, DogCollarSize, DogEarCleaningSchedule, DogDentalSchedule,
  CatHairballRisk, CatScratchingPostSelector, CatCarrierSize, CatCatioSize,
  BirdBathFrequency, BirdFlightSpace, BirdToyRotation,
  FishQuarantineTimer, AquariumPlantCount, AquariumSubstrate, AquariumCO2,
  HamsterWheelSize, FerretCageSize, GuineaPigCageSize, RabbitLitterTrainingGuide,
  ReptileHumidityGuide, ReptileBaskingGuide, BeardedDragonFood,
  HorseBlanketSize, HorseStallSize, HorseHoofTrimming,
  ChickenFeed, GoatWater, SheepFeed, DuckFeed,
  PetHydrationCalculator, TrainingTreatPlanner,
} from "@/components/tools/species-tools-2";
import {
  DogSwimTimeCalculator, DogCarTravelPlanner, DogParkVisitTracker, DogCrateTrainingSchedule,
  CatWindowPerchGuide, CatWeightLossPlanner, CatAgeAdjustedFeeding,
  BirdMoltingTracker, BirdSleepSchedule,
  AquariumNitrateCalculator, FishMedicationDose,
  RabbitPelletCalculator, RabbitWeightTracker, GuineaPigFoodCalculator,
  ReptileSheddingTracker, SnakeTankSizeCalculator,
  HorseSupplementCost, ChickenNestingBoxCount,
  PetVetVisitCostEstimator, PetGroomingCostEstimator,
} from "@/components/tools/species-tools-3";
import {
  SymptomCheckerWizard, PillIdentifierForPets, PoisonLookupDatabase,
  VaccineScheduleGenerator, EmergencyVetFinder, BloodTestExplainer,
} from "@/components/tools/species-tools-4";
import {
  PetPersonalityQuiz, WhichBreedSuitsMe, PetCompatibilityTest,
  HumanToPetAge, PetZodiacCard, PetNameMeaning,
} from "@/components/tools/species-tools-5";
import {
  AdoptionVsBuyingComparator, LitterSizePredictor,
} from "@/components/tools/species-tools-6";
import {
  ClickerTrainingPlanner, PottyTrainingSchedule, CrateTrainingTimeline,
  LeashTrainingProgress, RecallTrainingTracker, SocializationChecklist,
  PuppyMilestoneTracker, AggressionRiskAssessment, SeparationAnxietyScore,
  TrickTrainingLibrary, CommandVocabularyBuilder, BehaviorJournal,
  RewardScheduleCalculator, BarkingLog, LitterTrainingPlanner,
} from "@/components/tools/species-tools-7";
import {
  HeatCycleTracker, PregnancyCalendarSpecies, WhelpingKitteningChecklist,
  StudFeeCalculator, GeneticDiversityCOI, PuppyKittenWeightChart,
  WeaningSchedule, NewbornCareTimeline,
} from "@/components/tools/species-tools-8";
import {
  HeatstrokeRiskCalculator, ColdWeatherSafetyScore, PawPadTemperatureChecker,
  FireworksAnxietyPrep, HalloweenSafetyChecker, ChristmasHazardLookup,
  AllergySeasonTracker, AirQualityImpactAssessor,
} from "@/components/tools/species-tools-9";
import {
  ReptileUvbSchedule, TankTemperatureGradient, BirdWingClippingGuide,
  FerretLitterTrainer, TurtleBaskingTime, GoatHoofTrimReminder,
  HorseFarrierSchedule, VivariumHumidityCalculator,
} from "@/components/tools/species-tools-10";
import {
  PetBreedIdentifier, PetAgeEstimatorPhoto, PetEmotionDetector, SkinConditionAnalyzer,
  BodyConditionScorePhoto, PoopHealthAnalyzer, DogWolfCoyoteIdentifier, CatCoatPatternIdentifier,
  BirdSpeciesIdentifier, FishDiseaseSpotChecker,
} from "@/components/tools/photo-tools";
import {
  TarantulaEnclosureCalculator, TarantulaFeedingSchedule,
  HedgehogWheelSize, HedgehogDietCalculator,
  AxolotlTankTemperature, AxolotlTankSize,
  SugarGliderDietCalculator, SugarGliderCageSize,
  ChinchillaDustBathSchedule, ChinchillaCageSize,
  TortoiseHibernationPlanner, QuailCoopSize,
} from "@/components/tools/species-tools-11";

/* Checklist datasets */
const DOG_ADOPTION = [
  { title: "Supplies", items: ["Collar & ID tag", "4-6 ft leash", "Harness", "Food & water bowls", "Crate", "Bed", "Puppy pads or grass", "Toys (2-3 kinds)", "Chews", "Grooming brush", "Nail clippers", "Enzymatic cleaner"] },
  { title: "Home prep", items: ["Baby gate(s)", "Puppy-proof low cabinets", "Designate a safe space", "Secure toxic plants", "Cover trash bins"] },
  { title: "First week", items: ["Schedule vet visit", "Introduce a routine", "Start crate training", "Meet family calmly", "Begin name recognition"] },
  { title: "Vet & records", items: ["Vaccination records", "Microchip info", "Pet insurance quote", "Emergency vet phone number"] },
];
const PET_ADOPTION = [
  { title: "Supplies", items: ["Species-appropriate food", "Fresh water setup", "Bowls or bottles", "Bedding / hides", "Enrichment toys", "Carrier or travel crate", "Cleaning supplies"] },
  { title: "Home prep", items: ["Designated safe area", "Remove hazards", "Temperature check (heat/AC)", "Introduce slowly to household"] },
  { title: "First week", items: ["Vet appointment scheduled", "Establish feeding routine", "Watch appetite & bathroom habits", "Update ID / microchip records"] },
];
const EMERGENCY_KIT = [
  { title: "First aid", items: ["Gauze pads", "Vet wrap", "Digital thermometer", "Blunt-tip scissors", "Tweezers", "Saline solution", "Hydrogen peroxide 3% (dog vomit induction — vet-directed only)", "Styptic powder", "Pet-safe antiseptic", "Cotton balls", "Instant cold pack", "Tick removal tool"] },
  { title: "Evacuation kit", items: ["Carrier or crate", "3 days food & water", "Bowls", "Leash & extra collar with ID", "Medication supply (7 days)", "Comfort item (blanket/toy)", "Litter & scoop (cats)", "Cleanup bags"] },
  { title: "Records", items: ["Vaccination records", "Photo of your pet", "Vet contact info", "Emergency vet contact", "Microchip number"] },
];
const TRAVEL_KIT = [
  { title: "Documents", items: ["Vaccination records", "Health certificate (flights / interstate)", "Photo ID for pet"] },
  { title: "Car essentials", items: ["Secured carrier or seatbelt harness", "Portable water bowl", "Food & measured portions", "Waste bags", "Comfort blanket", "Emergency kit (see Emergency Kit tool)"] },
  { title: "Overnight", items: ["Bed or familiar blanket", "Enrichment toys", "Medications", "Contact list: vet, sitter, emergency"] },
];
const MICROCHIP = [
  { title: "Locate & record", items: ["Scan chip at vet to confirm number", "Note manufacturer (HomeAgain, AKC Reunite, 24PetWatch, etc.)", "Save chip number in phone and email"] },
  { title: "Register", items: ["Register in manufacturer's database", "Register in universal registry (Michelson Found Animals — free)", "List two backup contacts"] },
  { title: "Keep current", items: ["Update after moving", "Update after changing phone number", "Update after transferring ownership", "Re-verify annually"] },
];

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  // Dogs
  "dog-age-calculator": DogAgeCalculator,
  "dog-food-calculator": DogFoodCalculator,
  "dog-water-calculator": () => <WaterCalculator species="dog" />,
  "dog-calorie-calculator": () => <CalorieCalculator species="dog" />,
  "dog-bmi-calculator": () => <BCSCalculator species="dog" />,
  "dog-weight-calculator": () => <IdealWeightCalculator species="dog" />,
  "dog-pregnancy-calculator": () => <PregnancyCalculator species="dog" gestation={63} />,
  "dog-vaccination-schedule": () => <VaccinationSchedule species="dog" />,
  "dog-walking-calculator": DogWalkingCalculator,
  "dog-cost-calculator": () => <CostCalculator species="dog" />,
  "dog-name-generator": () => <PetNameGenerator pet="dog" />,
  "puppy-growth-calculator": PuppyGrowthCalculator,
  "dog-life-expectancy-calculator": () => <LifeExpectancyCalculator species="dog" />,
  "dog-treat-calorie-calculator": () => <TreatCalorieCalculator species="dog" />,
  "dog-grooming-schedule": () => <GroomingSchedule species="dog" />,
  "dog-heat-cycle-tracker": DogHeatCycleTracker,
  "dog-exercise-calculator": DogExerciseCalculator,
  "dog-adoption-checklist": () => <ChecklistTool storageKey="furtools:dog-adoption" groups={DOG_ADOPTION} />,
  "dog-chocolate-toxicity-calculator": DogChocolateToxicity,
  "dog-benadryl-dose-calculator": DogBenadrylDose,

  // Cats
  "cat-age-calculator": CatAgeCalculator,
  "cat-food-calculator": CatFoodCalculator,
  "cat-water-calculator": () => <WaterCalculator species="cat" />,
  "cat-calorie-calculator": () => <CalorieCalculator species="cat" />,
  "cat-bmi-calculator": () => <BCSCalculator species="cat" />,
  "cat-weight-calculator": () => <IdealWeightCalculator species="cat" />,
  "cat-pregnancy-calculator": () => <PregnancyCalculator species="cat" gestation={65} />,
  "cat-vaccination-schedule": () => <VaccinationSchedule species="cat" />,
  "cat-name-generator": () => <PetNameGenerator pet="cat" />,
  "kitten-growth-calculator": KittenGrowthCalculator,
  "cat-cost-calculator": () => <CostCalculator species="cat" />,
  "cat-life-expectancy-calculator": () => <LifeExpectancyCalculator species="cat" />,
  "cat-litter-calculator": CatLitterCalculator,
  "cat-treat-calorie-calculator": () => <TreatCalorieCalculator species="cat" />,
  "cat-grooming-schedule": () => <GroomingSchedule species="cat" />,
  "cat-play-time-calculator": CatPlayTimeCalculator,
  "cat-litter-box-count-calculator": CatLitterBoxCount,

  // Birds
  "bird-cage-size-calculator": BirdCageSize,
  "bird-food-calculator": BirdFood,
  "bird-lifespan-estimator": BirdLifespan,
  "bird-name-generator": () => <UniversalNameGenerator species="bird" />,

  // Fish
  "aquarium-volume-calculator": AquariumVolume,
  "fish-stocking-calculator": FishStocking,
  "tank-cycling-tracker": TankCyclingTracker,
  "water-change-scheduler": WaterChangeScheduler,
  "fish-food-calculator": FishFood,
  "aquarium-heater-wattage-calculator": HeaterWattage,
  "aquarium-lighting-calculator": AquariumLighting,
  "fish-tank-cost-calculator": FishTankCost,
  "fish-name-generator": () => <UniversalNameGenerator species="fish" />,

  // Small pets
  "rabbit-hay-calculator": RabbitHay,
  "rabbit-cage-size-calculator": RabbitCageSize,
  "rabbit-food-calculator": RabbitFood,
  "rabbit-age-calculator": RabbitAge,
  "rabbit-name-generator": () => <UniversalNameGenerator species="rabbit" />,
  "hamster-cage-size-calculator": HamsterCageSize,
  "hamster-food-calculator": HamsterFood,
  "guinea-pig-vitamin-c-calculator": GuineaPigVitaminC,
  "small-pet-name-generator": () => <UniversalNameGenerator species="small-pet" />,
  "hamster-lifespan-estimator": HamsterLifespan,

  // Reptiles
  "reptile-enclosure-size-calculator": ReptileEnclosure,
  "reptile-uvb-distance-guide": ReptileUVB,
  "reptile-feeder-size-calculator": ReptileFeeder,
  "snake-feeding-schedule": SnakeFeedingSchedule,
  "turtle-tank-calculator": TurtleTank,
  "reptile-name-generator": () => <UniversalNameGenerator species="reptile" />,

  // Horses
  "horse-feed-calculator": HorseFeed,
  "horse-water-intake-calculator": HorseWater,
  "horse-age-calculator": HorseAge,
  "horse-body-condition-score": HorseBCS,
  "horse-name-generator": () => <UniversalNameGenerator species="horse" />,

  // Farm
  "chicken-coop-size-calculator": ChickenCoopSize,
  "chicken-egg-production-tracker": ChickenEggProduction,
  "goat-feed-calculator": GoatFeed,
  "duck-pond-size-calculator": DuckPondSize,

  // General
  "pet-name-generator": () => <UniversalNameGenerator species="pet" />,
  "pet-cost-calculator": () => <CostCalculator species="dog" />,
  "pet-expense-tracker": ExpenseTracker,
  "pet-feeding-planner": FeedingPlanner,
  "pet-medication-calculator": MedicationCalculator,
  "pet-insurance-calculator": InsuranceCalculator,
  "pet-adoption-checklist": () => <ChecklistTool storageKey="furtools:pet-adoption" groups={PET_ADOPTION} />,
  "pet-emergency-kit": () => <ChecklistTool storageKey="furtools:emergency-kit" groups={EMERGENCY_KIT} />,
  "pet-qr-tag-generator": SmartCollarQRTool,
  "pet-care-planner": PetCarePlanner,
  "pet-bmi-calculator": () => <BCSCalculator species="dog" />,
  "pet-birthday-age-calculator": BirthdayAgeCalculator,
  "pet-travel-checklist": () => <ChecklistTool storageKey="furtools:travel" groups={TRAVEL_KIT} />,
  "pet-sitter-rate-calculator": SitterRateCalculator,
  "pet-boarding-cost-estimator": BoardingCostEstimator,
  "multi-pet-cost-calculator": MultiPetCostCalculator,
  "pet-vaccine-reminder": VaccineReminder,
  "pet-microchip-checklist": () => <ChecklistTool storageKey="furtools:microchip" groups={MICROCHIP} />,
  "pet-loss-memorial-generator": PetMemorialGenerator,
  "pet-carbon-pawprint-calculator": PetCarbonPawprint,

  // Batch 3 — +30 tools
  "dog-poop-bag-calculator": DogPoopBagCalculator,
  "dog-crate-size-calculator": DogCrateSize,
  "dog-collar-size-calculator": DogCollarSize,
  "dog-ear-cleaning-schedule": DogEarCleaningSchedule,
  "dog-dental-care-schedule": DogDentalSchedule,
  "cat-hairball-risk-calculator": CatHairballRisk,
  "cat-scratching-post-selector": CatScratchingPostSelector,
  "cat-carrier-size-calculator": CatCarrierSize,
  "cat-catio-size-calculator": CatCatioSize,
  "bird-bath-frequency-guide": BirdBathFrequency,
  "bird-flight-space-calculator": BirdFlightSpace,
  "bird-toy-rotation-planner": BirdToyRotation,
  "fish-quarantine-timer": FishQuarantineTimer,
  "aquarium-plant-count-calculator": AquariumPlantCount,
  "aquarium-substrate-calculator": AquariumSubstrate,
  "aquarium-co2-calculator": AquariumCO2,
  "hamster-wheel-size-calculator": HamsterWheelSize,
  "ferret-cage-size-calculator": FerretCageSize,
  "guinea-pig-cage-size-calculator": GuineaPigCageSize,
  "rabbit-litter-training-guide": RabbitLitterTrainingGuide,
  "reptile-humidity-guide": ReptileHumidityGuide,
  "reptile-basking-temp-guide": ReptileBaskingGuide,
  "bearded-dragon-food-calculator": BeardedDragonFood,
  "horse-blanket-size-calculator": HorseBlanketSize,
  "horse-stall-size-calculator": HorseStallSize,
  "horse-hoof-trimming-schedule": HorseHoofTrimming,
  "chicken-feed-calculator": ChickenFeed,
  "goat-water-calculator": GoatWater,
  "sheep-feed-calculator": SheepFeed,
  "duck-feed-calculator": DuckFeed,
  "pet-hydration-calculator": PetHydrationCalculator,
  "training-treat-planner": TrainingTreatPlanner,

  // Batch 4 — +20 tools
  "dog-swim-time-calculator": DogSwimTimeCalculator,
  "dog-car-travel-planner": DogCarTravelPlanner,
  "dog-park-visit-tracker": DogParkVisitTracker,
  "dog-crate-training-schedule": DogCrateTrainingSchedule,
  "cat-window-perch-guide": CatWindowPerchGuide,
  "cat-weight-loss-planner": CatWeightLossPlanner,
  "cat-age-adjusted-feeding": CatAgeAdjustedFeeding,
  "bird-molting-tracker": BirdMoltingTracker,
  "bird-sleep-schedule": BirdSleepSchedule,
  "aquarium-nitrate-calculator": AquariumNitrateCalculator,
  "fish-medication-dose": FishMedicationDose,
  "rabbit-pellet-calculator": RabbitPelletCalculator,
  "rabbit-weight-tracker": RabbitWeightTracker,
  "guinea-pig-food-calculator": GuineaPigFoodCalculator,
  "reptile-shedding-tracker": ReptileSheddingTracker,
  "snake-tank-size-calculator": SnakeTankSizeCalculator,
  "horse-supplement-cost": HorseSupplementCost,
  "chicken-nesting-box-count": ChickenNestingBoxCount,
  "pet-vet-visit-cost-estimator": PetVetVisitCostEstimator,
  "pet-grooming-cost-estimator": PetGroomingCostEstimator,

  // Batch 5 — Medical & Health suite
  "pet-symptom-checker": SymptomCheckerWizard,
  "pet-pill-identifier": PillIdentifierForPets,
  "pet-poison-lookup": PoisonLookupDatabase,
  "pet-vaccine-schedule-generator": VaccineScheduleGenerator,
  "emergency-vet-finder": EmergencyVetFinder,
  "pet-blood-test-explainer": BloodTestExplainer,

  // Batch 6 — Fun / Quiz suite
  "pet-personality-quiz": PetPersonalityQuiz,
  "which-breed-suits-me": WhichBreedSuitsMe,
  "pet-compatibility-test": PetCompatibilityTest,
  "human-to-pet-age": HumanToPetAge,
  "pet-zodiac-birthday-card": PetZodiacCard,
  "pet-name-meaning-lookup": PetNameMeaning,

  // Batch 7 — Breeding & adoption
  "adoption-vs-buying-cost-comparator": AdoptionVsBuyingComparator,
  "litter-size-predictor": LitterSizePredictor,

  // Batch 8 — Training & Behavior (15 tools)
  "clicker-training-planner": ClickerTrainingPlanner,
  "potty-training-schedule": PottyTrainingSchedule,
  "crate-training-timeline": CrateTrainingTimeline,
  "leash-training-progress": LeashTrainingProgress,
  "recall-training-tracker": RecallTrainingTracker,
  "socialization-checklist": SocializationChecklist,
  "puppy-milestone-tracker": PuppyMilestoneTracker,
  "aggression-risk-assessment": AggressionRiskAssessment,
  "separation-anxiety-score": SeparationAnxietyScore,
  "trick-training-library": TrickTrainingLibrary,
  "command-vocabulary-builder": CommandVocabularyBuilder,
  "behavior-journal": BehaviorJournal,
  "reward-schedule-calculator": RewardScheduleCalculator,
  "barking-log": BarkingLog,
  "litter-training-planner": LitterTrainingPlanner,

  // Batch 9 — Breeding & Reproduction (8 tools)
  "heat-cycle-tracker": HeatCycleTracker,
  "pregnancy-calendar": PregnancyCalendarSpecies,
  "whelping-kittening-checklist": WhelpingKitteningChecklist,
  "stud-fee-calculator": StudFeeCalculator,
  "genetic-diversity-calculator": GeneticDiversityCOI,
  "puppy-kitten-weight-chart": PuppyKittenWeightChart,
  "weaning-schedule": WeaningSchedule,
  "newborn-care-timeline": NewbornCareTimeline,

  // Batch 10 — Seasonal & Environmental (8 tools)
  "heatstroke-risk-calculator": HeatstrokeRiskCalculator,
  "cold-weather-safety-score": ColdWeatherSafetyScore,
  "paw-pad-temperature-checker": PawPadTemperatureChecker,
  "fireworks-anxiety-prep": FireworksAnxietyPrep,
  "halloween-safety-checker": HalloweenSafetyChecker,
  "christmas-hazard-lookup": ChristmasHazardLookup,
  "allergy-season-tracker": AllergySeasonTracker,
  "air-quality-impact-assessor": AirQualityImpactAssessor,

  // Batch 11 — Species-specific husbandry (8 tools)
  "reptile-uvb-schedule": ReptileUvbSchedule,
  "tank-temperature-gradient-calculator": TankTemperatureGradient,
  "bird-wing-clipping-guide": BirdWingClippingGuide,
  "ferret-litter-trainer": FerretLitterTrainer,
  "turtle-basking-time-calculator": TurtleBaskingTime,
  "goat-hoof-trim-reminder": GoatHoofTrimReminder,
  "horse-farrier-schedule": HorseFarrierSchedule,
  "vivarium-humidity-calculator": VivariumHumidityCalculator,

  // Batch 12 — AI Photo Analysis (10 tools)
  "pet-breed-identifier": PetBreedIdentifier,
  "pet-age-estimator-photo": PetAgeEstimatorPhoto,
  "pet-emotion-detector": PetEmotionDetector,
  "skin-condition-analyzer": SkinConditionAnalyzer,
  "pet-body-condition-photo": BodyConditionScorePhoto,
  "poop-health-analyzer": PoopHealthAnalyzer,
  "dog-wolf-coyote-identifier": DogWolfCoyoteIdentifier,
  "cat-coat-pattern-identifier": CatCoatPatternIdentifier,
  "bird-species-identifier": BirdSpeciesIdentifier,
  "fish-disease-spot-checker": FishDiseaseSpotChecker,

  // Batch 13 — Wildlife & Exotic extras (12 tools)
  "tarantula-enclosure-size-calculator": TarantulaEnclosureCalculator,
  "tarantula-feeding-schedule": TarantulaFeedingSchedule,
  "hedgehog-wheel-size-calculator": HedgehogWheelSize,
  "hedgehog-diet-calculator": HedgehogDietCalculator,
  "axolotl-tank-temperature-calculator": AxolotlTankTemperature,
  "axolotl-tank-size-calculator": AxolotlTankSize,
  "sugar-glider-diet-calculator": SugarGliderDietCalculator,
  "sugar-glider-cage-size-calculator": SugarGliderCageSize,
  "chinchilla-dust-bath-schedule": ChinchillaDustBathSchedule,
  "chinchilla-cage-size-calculator": ChinchillaCageSize,
  "tortoise-hibernation-planner": TortoiseHibernationPlanner,
  "quail-coop-size-calculator": QuailCoopSize,
};
