import React from 'react'
import LegalDocument from '../components/LegalDocument'
import { dataProcessingAgreement } from '../lib/data'

export default function DataProcessingAgreement() {
  return <LegalDocument data={dataProcessingAgreement} />
} 