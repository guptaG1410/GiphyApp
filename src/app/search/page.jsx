'use client';

import React, { useState, useEffect } from 'react';
import Spinner from '@/components/spinner';
import Header from '@/components/header';
import { useDebouncedCallback } from 'use-debounce';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

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
  const giphyQuery = async () => {
    try {
      setGiphies({ ...giphies, loading: true, error: null });

      // Fetching GIFs based on search inputs and offset
      const itemlimits = 21;
      const giphy_raw = await fetch(
        process.env.NEXT_PUBLIC_GIPHY_API_KEY +
          giphies.q +
          `&limit=` +
          itemlimits +
          `&offset=` +
          giphies.offset * itemlimits
      );
      if (giphy_raw.status === 200) {
        let giphy_json = await giphy_raw.json();
        console.log(giphy_json);
        if (giphy_json?.data?.length > 0) {
          //also storing the total page count for pagination
          let totalpages =
            (giphy_json.pagination.total_count + itemlimits - 1) / itemlimits;
          setGiphies({
            ...giphies,
            data: giphy_json.data,
            loading: false,
            totalCount: giphy_json.pagination.total_count,
            pages: totalpages,
          });
        } else {
          setGiphies({
            ...giphies,
            error: '0 Result Found with query "' + giphies.q + '"',
            loading: false,
            data: [],
          });
        }
      } else {
        setGiphies({
          ...giphies,
          loading: false,
          error:
            'Due to some technical problem, failed to fetch giphies from the server.',
        });
      }
    } catch (error) {
      console.log(`Error occured: ${error.message}`);
    }
  };

  //Use effect will call Data Fetcher function on every search input change for hot search, and on every pagination navigation.
  useEffect(() => {
    document.title = 'Home';
    giphyQuery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giphies.q, giphies.offset]);

  //If the user is not logged in navigate them to login page.
  useEffect(() => {
    if (!user) router.push('/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  //using use-debounced library, to avoid mulitple unneccesory api calls while changing search input value
  const debounced = useDebouncedCallback(async (value) => {
    setGiphies(
      {
        ...giphies,
        offset: 0,
        error: null,
        q: value,
        data: [],
        loading: value === '' || giphies.q.length < 3 ? false : true,
        totalCount: 0,
        pages: 0,
      },
      1000
    );
  });

  //function to change the page offset which wil make useEffect to trigger new query with previous offset
  const handleDirectionPrevious = () => {
    setGiphies({ ...giphies, offset: giphies.offset - 1 });
  };

  //function to change the page offset which wil make useEffect to trigger new query with next offset.
  const handleDirectionNext = () => {
    setGiphies({ ...giphies, offset: giphies.offset + 1 });
  };

  //this method wiil be called by pagination page numbers, this will change the offset accordingly
  const handlePaginationByPageNumber = (e) => {
    setGiphies({ ...giphies, offset: e - 1 });
  };

  //Handling hot search
  const handleSearch = async () => {
    setGiphies({
      ...giphies,
      offset: 0,
      error: null,
      data: [],
      loading: giphies.q === '' || giphies.q.length < 3 ? false : true,
    });
    giphyQuery();
  };

  return authLoading ? (
    <Spinner />
  ) : (
    <>
      <Header user={user} />
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
              className="text-black py-3 w-full bg-gray-100 placeholder:text-gray-700 rounded-md pl-10 focus:outline-none"
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
                    <img
                      src={giphy.images.fixed_width_downsampled.url}
                      className="rounded-t-md w-full h-56"
                      alt=""
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
        {/* Pagination Section */}
        {giphies.totalCount > 20 && (
          <>
            {/* Previous Button */}
            {giphies.offset === 0 && (
              <div className="flex font-bold w-full text-sm gap-4 items-center justify-center p-6">
                <div className="">Previous</div>
                <div className="bg-[#EB518F] bg-opacity-10 border-b-4 px-4 py-3 border-[#EB518F]">
                  {giphies.offset + 1}
                </div>
                <div
                  onClick={() =>
                    handlePaginationByPageNumber(giphies.offset + 2)
                  }
                  className="bg-opacity-10 border-b-4 border-transparent px-4 py-3 cursor-pointer"
                >
                  {giphies.offset + 2}
                </div>
                <div
                  onClick={() =>
                    handlePaginationByPageNumber(giphies.offset + 3)
                  }
                  className="bg-opacity-10 border-b-4 border-transparent px-4 py-3 cursor-pointer"
                >
                  {giphies.offset + 3}
                </div>
                <div onClick={handleDirectionNext} className="cursor-pointer">
                  Next
                </div>
              </div>
            )}
            {/* Three Pages refs, active in center if not first or last, else respectively first and last */}
            {giphies.offset > 0 && giphies.offset + 1 < giphies.pages && (
              <div className="flex font-bold w-full text-sm gap-4 items-center justify-center p-6">
                <div onClick={handleDirectionPrevious} className="">
                  Previous
                </div>
                <div
                  onClick={() => handlePaginationByPageNumber(giphies.offset)}
                  className="bg-opacity-10 border-b-4 border-transparent px-4 py-3 cursor-pointer"
                >
                  {giphies.offset}
                </div>
                <div className="bg-[#EB518F] bg-opacity-10 border-b-4 px-4 py-3 border-[#EB518F]">
                  {giphies.offset + 1}
                </div>
                <div
                  onClick={() =>
                    handlePaginationByPageNumber(giphies.offset + 2)
                  }
                  className="bg-opacity-10 border-b-4 border-transparent px-4 py-3 cursor-pointer"
                >
                  {giphies.offset + 2}
                </div>
                <div onClick={handleDirectionNext} className="cursor-pointer">
                  Next
                </div>
              </div>
            )}

            {/* Next Button */}
            {giphies.offset + 1 === giphies.pages && (
              <div className="flex font-bold w-full text-sm gap-4 items-center justify-center p-6">
                <div
                  onClick={handleDirectionPrevious}
                  className="cursor-pointer"
                >
                  Previous
                </div>
                <div
                  onClick={() =>
                    handlePaginationByPageNumber(giphies.offset - 1)
                  }
                  className="bg-opacity-10 border-b-4 border-transparent px-4 py-3 cursor-pointer"
                >
                  {giphies.offset - 1}
                </div>
                <div
                  onClick={() => handlePaginationByPageNumber(giphies.offset)}
                  className="bg-opacity-10 border-b-4 border-transparent px-4 py-3 cursor-pointer"
                >
                  {giphies.offset}
                </div>
                <div className="bg-[#EB518F] bg-opacity-10 border-b-4 px-4 py-3 border-[#EB518F]">
                  {giphies.offset + 1}
                </div>
                <div className="">Next</div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
