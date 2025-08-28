import React from 'react'
import LegalDocument from '../components/LegalDocument'
import { cancellationAndRefundPolicy } from '../lib/data'

export default function CancellationRefundPolicy() {
  return <LegalDocument data={cancellationAndRefundPolicy} />
} 