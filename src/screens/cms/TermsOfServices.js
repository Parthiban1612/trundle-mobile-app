import React from 'react'
import { ENDPOINTS } from '../../redux/endpoints'
import useFetch from '../../hooks/useFetch'
import CMSContent from './CMSContent'

const TermsOfServices = () => {
  const { data: termsOfServices, loading } = useFetch({
    url: ENDPOINTS.TERMS_OF_SERVICE,
    method: 'GET',
  });

  return <CMSContent
    loading={loading}
    title="Terms of Services"
    html={termsOfServices?.data?.content}
  />
}
export default TermsOfServices;


