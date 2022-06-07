import React from 'react';
import { useQuery } from '@apollo/client'
import { QUERY_THOUGHTS } from '../utils/queries'

const Home = () => {
  //use useQuery hook to make query request
  //Because this is asynchronous, just like using fetch()
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  //if data exists, store it in the thouhts constant we just created, if data is undefined, then save an empty array to the thouhghts component
const thoughts = data?.thoughts || [];
console.log(thoughts)
  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className='col-12 mb-3'>{/* PRINT THOUGHT LIST */}</div>
      </div>
    </main>
  );
};

export default Home;