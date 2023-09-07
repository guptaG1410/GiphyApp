'use client';

import React, { useState, useEffect } from 'react';
import Spinner from '@/components/spinner';
import Header from '@/components/header';
import { useDebouncedCallback } from 'use-debounce';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Search() {
  const [user, authLoading, error] = useAuthState(auth);
  const [giphies, setGiphies] = useState({
    q: '',
    loading: false,
    data: [],
    offset: 0,
    totalCount: 0,
    error: null,
    pages: 0,
  });
  const router = useRouter();

  // Data fetcher function
  const gihpyQuery = async () => {
    try {
      setGiphies({ ...giphies, loading: true, error: null });

      // Fetching GIFs based on search inputs and offset
      const itemlimits = 21;
      const giphy_raw = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=jGs3O53GLnREsU4x9qju1Ume4gT7FL7t&q=10&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
      );
      if (giphy_raw.status === 200) {
        let giphy_json = await giphy_raw.json();
        console.log(giphy_json);
      }
    } catch (error) {
      console.log(`Error occured: ${error.message}`);
    }
  };

  //Use effect will call Data Fetcher function on every search input change for hot search, and on every pagination navigation.
  useEffect(() => {
    gihpyQuery();
  }, [giphies.q, giphies.offset]);

  // useEffect(() => {
  //     if(!user)
  //         router.push('/login');
  // }, [user])

   //using use-debounced library, to avoid mulitple unneccesory api calls while changing search input value
  const debounced = useDebouncedCallback(async(value) => {
    setGiphies({...giphies, offset: 0, error: null, q: value, data: [], loading: value === '' || giphies.q.length < 3 ? false : true, totalCount: 0, pages: 0}
    , 1000);
  })

  //Handling hot search
  const handleSearch = async() => {
    setGiphies({...giphies, offset: 0, error: null, data: [], loading: giphies.q === '' || giphies.q.length < 3 ? false : true});
    gihpyQuery();
  }


  return authLoading ? (
    <Spinner />
  ) : (
    <>
      <Header />
      <div className="bg-white-100 w-full text-sm min-h-screen h-full flex flex-col items-center">
        {/* Searchbar Section */}
        <div className="flex gap-3 my-4 bg-white w-full md:w-1/2 p-5 h-min rounded-md">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center text-gray-700 pl-2">
              <button
                type="submit"
                className="p-1 focus:outline-none focus:shadow-outline"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </span>
            <input
              onChange={(e) => debounced(e.target.value)}
              type="text"
              className="py-3 w-full bg-gray-100 placeholder:text-gray-700 rounded-md pl-10 focus:outline-none"
              placeholder="Start Searching..."
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-black text-white rounded-md px-5 py-1.5"
          >
            Search
          </button>
        </div>
        
        {/* Result Section */}
        {giphies.totalCount > 0 && (
          <div className="py-2 font-bold text-left w-full px-4 lg:px-20">
            {giphies.totalCount} results found.
          </div>
        )}
        {giphies.loading ? (
          <Spinner />
        ) : (
          <>
            {giphies.error && giphies.q !== '' && <p>{giphies.error}</p>}
            {giphies.data.length > 0 && (
              <div className="px-20 grid grid-cols-1 md:grid-cols-3 gap-5">
                {giphies.data.map((giphy, key) => (
                  <div
                    key={key}
                    className="w-full shadow-lg rounded-md border flex flex-col"
                  >
                    <Image
                      src={giphy.images.fixed_width_downsampled.url}
                      className="rounded-t-md w-full h-56"
                      alt=''
                    />
                    <div className="w-full flex justify-between px-3 py-3">
                      <div className="font-bold text-lg">{giphy.title}</div>
                    </div>
                    {!giphy.username == '' && (
                      <div className="text-start px-3 pb-3 text-gray-500">
                        @{giphy.username}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <h1>Hey/ I am search</h1>
      </div>
    </>
  );
}
