"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  Image,
  Text,
  Link,
  Flex,
  InputGroup,
  Input,
  InputLeftElement,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon, StarIcon } from "@chakra-ui/icons";
import { getCharacterImage } from "./utils";

interface Character {
  name: string;
  url: string;
}

const Home = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(true);

  const getInitialFavorites = () => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    }
    return [];
  };

  const [favorites, setFavorites] = useState<string[]>(getInitialFavorites);

  const fetchCharactersData = async (page: number) => {
    setLoading(true);
    const response = await axios.get(
      `https://swapi.dev/api/people/?page=${page}`
    );
    const data = response.data.results;
    setCharacters(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCharactersData(page);
  }, [page]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (character: Character) => {
    if (favorites.includes(character.name)) {
      setFavorites(favorites.filter((fav) => fav !== character.name));
    } else {
      setFavorites([...favorites, character.name]);
    }
  };

  const onHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const filteredResult = characters.filter((data) =>
    data.name.toLowerCase().includes(searchString.toLowerCase())
  );

  return (
    <Box p={4} bgColor="black">
      <Flex alignItems="center" justifyContent="space-between">
        <Box borderRadius="50%" />
        <Box w="60%">
          <Image src="/star-wars1.svg" alt="Starwars Logo" w="10%" h="10%" />
        </Box>
        <InputGroup w="264px" bgColor={"black"}>
          <InputLeftElement>
            <SearchIcon color="white" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            bgColor="black"
            h="40px"
            fontSize="16px"
            value={searchString}
            onChange={(event) => onHandleChange(event)}
          />
        </InputGroup>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="50vh">
          <Spinner size="xl" color="orange" />
        </Flex>
      ) : (
        <>
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            {filteredResult.map((character) => (
              <Box
                key={character.name}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                p={4}
                bgColor={"#2b3037"}
              >
                <Link href={`/character/${character.url.split("/")[5]}`}>
                  <Image
                    src={getCharacterImage(character)}
                    alt={character.name}
                  />
                  <Text mt={2} fontWeight="bold" color={"orange"}>
                    {character.name}
                  </Text>
                </Link>
                <Flex gap="5px">
                  <Button
                    onClick={() => toggleFavorite(character)}
                    mt={2}
                    gap="10px"
                  >
                    {favorites.includes(character.name)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                    <StarIcon
                      color={
                        favorites.includes(character.name) ? "orange" : "gray"
                      }
                    />
                  </Button>
                </Flex>
              </Box>
            ))}
          </Grid>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button onClick={() => setPage(page - 1)} isDisabled={page === 1}>
              Previous
            </Button>
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Home;
