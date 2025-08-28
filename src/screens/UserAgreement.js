import React from 'react'
import LegalDocument from '../components/LegalDocument'
import { userAgreement } from '../lib/data'

export default function UserAgreement() {
  return <LegalDocument data={userAgreement} />
} 