"use client";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";

type Props = {
  url: string;
  search: string;
};

const Search = ({ url, search }: Props) => {
  const [keyword, setKeyword] = useState<string>(search);
  const router = useRouter();

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    router.push(`${url}?search=${keyword}`);
  };

  return (
    <input
      type="text"
      id="keyword"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className={`text-md w-full rounded-lg p-2 bg-[#ffffff] border border-secondary focus:border-primary focus:outline-none`}
      placeholder="Search Menu"
      onKeyUp={handleSearch}
    />
  );
};
export default Search;
