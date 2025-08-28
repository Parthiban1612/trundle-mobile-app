import React from 'react'
import LegalDocument from '../components/LegalDocument'
import { termsAndConditions } from '../lib/data'

export default function TermsAndConditions() {
  return <LegalDocument data={termsAndConditions} />
} 