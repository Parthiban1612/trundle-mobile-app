import React from 'react'
import CMSContent from './CMSContent'
import useFetch from '../../hooks/useFetch'
import { ENDPOINTS } from '../../redux/endpoints'

const TermOfServices = () => {

  const { data: termOfServices, loading } = useFetch({
    url: ENDPOINTS.TERMS_OF_SERVICE,
    method: 'GET',
  });

  return <CMSContent
    loading={loading}
    title="Terms of Services"
    html={termOfServices?.data?.content}
  />
}

export default TermOfServices;