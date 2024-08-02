import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10); // Limit per request
  const [skip, setSkip] = useState(0);
  const [filter, setFilter] = useState({ address: [], gender: [] });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    // Fetch the initial data
    fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setUsers(data.users);
        setDisplayedUsers(data.users);
        setFilter({
          address: [...new Set(data.users.map((user) => user.address.city))],
          gender: [...new Set(data.users.map((user) => user.gender))],
        });

        setTotal(data.total); // Assuming the total count is returned as 'total'
        setSkip(skip + limit); // Update skip to fetch the next set of users

        if (data.users.length < limit) {
          setHasMore(false); // No more data to load
        }
      });
  }, []);

  const loadFunc = () => {
    // Fetch additional data when the user scrolls down
    if (loading) return;

    fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers((prevUsers) => [...prevUsers, ...data.users]); // Append new users to the existing users
        setSkip(skip + limit); // Update skip to fetch the next set of users

        if (data.users.length < limit) {
          setHasMore(false); // No more data to load
        }
      });
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    console.log(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGenderFilter(e.target.value);
    console.log(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    // console.log(`Filtering user: ${user.name}`);
    // console.log(`User's city: ${user.address.city}`);
    // console.log(`User's gender: ${user.gender}`);
    // console.log(`Category filter: ${categoryFilter}`);
    // console.log(`Gender filter: ${genderFilter}`);
    // console.log(`User's city: ${user.address.city}`);
    if (categoryFilter && genderFilter) {
      return (
        user.address.city === categoryFilter && user.gender === genderFilter
      );
    } else if (categoryFilter) {
      return user.address.city.trim() === categoryFilter.trim();
    } else if (genderFilter) {
      return user.gender === genderFilter;
    } else {
      return true;
    }
  });

  console.log("Filtered Users:", filteredUsers);

  const handleSort = (criteria) => {
    const direction =
      sortCriteria === criteria && sortDirection === "asc" ? "desc" : "asc";
    setSortCriteria(criteria);
    setSortDirection(direction);

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[criteria] < b[criteria]) return direction === "asc" ? -1 : 1;
      if (a[criteria] > b[criteria]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  const sortIcon =
    sortDirection === "asc" ? "🔼" : sortDirection === "desc" ? "🔽" : "🔼🔽";

  return (
    <>
      <div className="h-auto bg-black">
        <nav className="border-gray-200 bg-white dark:bg-gray-900">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
            <a
              href=""
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Logo Company
              </span>
            </a>

            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
                <li>
                  <a
                    href="#"
                    className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-8 pt-24">
          <div className="flex h-screen flex-col rounded-md bg-[#f0f8ff]">
            <div className="-m-1.5 overflow-x-auto">
              <div className="inline-block min-w-full p-1.5 align-middle">
                <div className="overflow-hidden">
                  <div className="mb-5 flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-bold">Employess</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-7">
                      <div class="mx-auto max-w-sm">
                        <label
                          for="countries"
                          class="mb-2 block text-sm font-medium text-gray-900"
                        >
                          Select an option
                        </label>
                        <select
                          value={categoryFilter || ""}
                          onChange={handleCategoryChange}
                          id="countries"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        >
                          <option value="" disabled>
                            Choose a country
                          </option>
                          {filter.address.map((newAddress, index) => (
                            <option key={index} value={newAddress}>
                              {newAddress}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div class="mx-auto max-w-sm">
                        <label class="mb-2 block text-sm font-medium text-gray-900">
                          Select an option
                        </label>
                        <select
                          value={""}
                          onChange={handleGenderChange}
                          id="countries"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        >
                          <option selected>Select Gender</option>
                          {filter.gender.map((gender, index) => (
                            <option key={index} value={gender}>
                              {gender}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={loadFunc}
                    hasMore={hasMore}
                    loader={<div className="loader">Loading more users...</div>}
                    endmessage={
                      <div className="end-message">No more users to show</div>
                    }
                  >
                    <div className="">
                      <table className="#4FC3A1 min-w-full divide-y divide-gray-200 rounded-sm border-2 border-gray-400 dark:divide-neutral-700">
                        <thead>
                          <tr className="odd:bg-white even:bg-slate-50">
                            <th
                              onClick={() => handleSort("id")}
                              className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-neutral-500"
                            >
                              ID{" "}
                              {sortCriteria === "id" &&
                                (sortDirection
                                  ? "asc"
                                    ? "🔼"
                                    : "🔽"
                                  : "🔼🔽")}
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-neutral-500"
                            >
                              image
                            </th>
                            <th
                              onClick={() => handleSort("firstName")}
                              className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-neutral-500"
                            >
                              First Name
                              {sortCriteria === "firstName" && sortIcon}
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-neutral-500"
                            >
                              Demography
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-neutral-500"
                            >
                              Degsignation
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500 dark:text-neutral-500"
                            >
                              location
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 [&>*:nth-child(even)]:bg-[#a6dbdc] [&>*:nth-child(odd)]:bg-[#F8F8F8]">
                          {loading ? (
                            <p>Loading.....</p>
                          ) : (
                            filteredUsers.map((user, index) => (
                              <tr key={index}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                                  {user.id}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                                  <img
                                    src={user.image}
                                    alt={user.name}
                                    className="h-12 w-12 rounded-full"
                                  />
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                                  {user.firstName}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                                  {user.gender}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                                  {user.company.department}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                                  {user.address.city}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
