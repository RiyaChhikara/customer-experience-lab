'use client';

import { Persona } from '@/lib/api';

interface PersonaDisplayProps {
  persona: Persona;
}

export function PersonaDisplay({ persona }: PersonaDisplayProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        👤 Customer Persona Generated
      </h2>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6 md:p-8 rounded-xl border-2 border-purple-200 dark:border-purple-800">
        <div className="space-y-4">
          <p className="text-xl">
            <strong>Name:</strong> {persona.name}
          </p>
          <p className="text-xl">
            <strong>Age:</strong> {persona.age}
          </p>
          <p className="text-xl">
            <strong>Issue:</strong> {persona.issue}
          </p>
          <p className="text-xl">
            <strong>Emotion:</strong>{' '}
            <span className="text-red-600 dark:text-red-400 font-bold">
              {persona.emotion}
            </span>
          </p>
          <p className="text-xl">
            <strong>Priority:</strong>{' '}
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {persona.priority}/10
            </span>
          </p>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-gray-600 dark:text-gray-400 animate-pulse text-lg">
          AI agent handling call...
        </p>
      </div>
    </div>
  );
}

