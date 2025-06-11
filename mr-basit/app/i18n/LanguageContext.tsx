'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, translations, TranslationKey } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, options?: { returnObjects?: boolean }) => string | string[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: TranslationKey, options?: { returnObjects?: boolean }): string | string[] => {
    const translation = translations[language][key]
    if (options?.returnObjects && Array.isArray(translation)) {
      return translation
    }
    return translation as string
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 