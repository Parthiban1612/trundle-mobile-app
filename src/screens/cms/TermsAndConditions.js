import React from 'react';
import { ENDPOINTS } from '../../redux/endpoints';
import useFetch from '../../hooks/useFetch';
import CMSContent from './CMSContent';

const TermsAndConditions = () => {
  const { data: termsAndConditions, loading } = useFetch({
    url: ENDPOINTS.TERMS_AND_CONDITIONS,
    method: 'GET',
  });

  return <CMSContent
    loading={loading}
    title="Terms and Conditions"
    html={termsAndConditions?.data?.content}
  />
}

export default TermsAndConditions;
