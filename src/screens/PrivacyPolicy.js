import React from 'react'
import LegalDocument from '../components/LegalDocument'
import { privacyPolicy } from '../lib/data'

export default function PrivacyPolicy() {
  return <LegalDocument data={privacyPolicy} />
}
