// CosmoGuide - AI Space Exploration Cockpit
// Created by: Nayan Dhurve (nayandhurve44@gmail.com)
// License: MIT

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  tokens?: number;
  sources?: string[];
}

export interface AssistantConfig {
  style: 'Simple' | 'Balanced' | 'Expert';
  topicFilter?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AsteroidItem {
  id: string;
  name: string;
  closeApproachDate: string;
  velocityKph: number;
  missDistanceAu: number;
  estimatedDiameterMinM: number;
  estimatedDiameterMaxM: number;
  isPotentiallyHazardous: boolean;
  orbitingBody: string;
}

export interface SpaceWeatherParam {
  kpIndex: number;
  solarWindSpeed: number;
  solarWindDensity: number;
  xrayFlux: 'A' | 'B' | 'C' | 'M' | 'X';
  auroraProbability: number; // 0-100%
  alertMessage?: string;
}

export interface SpaceNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedDate: string;
  url?: string;
  imageUrl?: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  category: 'planet' | 'star' | 'galaxy';
  mass: string;
  diameter: string;
  temperature: string;
  distance: string;
  gravity?: string;
  color: string;
  atmosphere?: string;
  fact: string;
}
