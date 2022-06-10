import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries";
import ThoughtList from "../components/ThoughtList";
import FriendList from '../components/FriendList'
import ThoughtForm from "../components/ThoughtForm";
//need to check the logged-in status of a user
import Auth from '../utils/auth';

const Home = () => {
  //use useQuery hook to make query request
  //Because this is asynchronous, just like using fetch()
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  //if data exists, store it in the thouhts constant we just created, if data is undefined, then save an empty array to the thouhghts component
  const thoughts = data?.thoughts || [];

//use object destructuring to extract 'data' form the 'useQuery' hook's response and rename it `userData` to be more descriptive
const { data: userData } = useQuery(QUERY_ME_BASIC)
 
  console.log(thoughts);

  const loggedIn = Auth.loggedIn()

  return (
    <main>
      <div className="flex-row justify-space-between">
        {loggedIn && (<div className="col-12 mb-3"><ThoughtForm /></div>)}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* PRINT THOUGHT LIST */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            //passing the thoughts array as props and a custom title
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3 mt-3">
          <FriendList
          username={userData.me.username}
          friendCount={userData.me.friendCount}
          friends={userData.me.friends} />
          </div>
        ) : null}
      </div>
    </main>
  ); 
};

export default Home;
