import React from 'react'
import LegalDocument from '../components/LegalDocument'
import { termsAndServices } from '../lib/data'

export default function TermsOfServices() {
  return <LegalDocument data={termsAndServices} />
} 