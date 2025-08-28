import React from 'react'
import LegalDocument from '../components/LegalDocument'
import { cookiePolicy } from '../lib/data'

export default function CookiePolicy() {
  return <LegalDocument data={cookiePolicy} />
} 