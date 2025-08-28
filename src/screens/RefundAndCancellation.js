import React from 'react'
import LegalDocument from '../components/LegalDocument'
import { cancellationAndRefundPolicy } from '../lib/data'

export default function RefundAndCancellation() {
  return <LegalDocument data={cancellationAndRefundPolicy} />
}   