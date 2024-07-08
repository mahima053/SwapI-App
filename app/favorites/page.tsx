"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Image,
  Text,
  Link,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { getCharacterImage } from "../utils";

interface Character {
  name: string;
  url: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(favs);
    }
  }, []);

  useEffect(() => {
    const fetchFavoriteCharacters = async () => {
      setLoading(true);
      const characterRequests = favorites.map((name) =>
        fetch(`https://swapi.dev/api/people/?search=${name}`).then((res) =>
          res.json()
        )
      );
      const characterResponses = await Promise.all(characterRequests);
      const characters = characterResponses.map((res) => res.results[0]);
      setFavoriteCharacters(characters);
      setLoading(false);
    };

    if (favorites.length > 0) {
      fetchFavoriteCharacters();
    } else {
      setLoading(false);
    }
  }, [favorites]);

  const toggleFavorite = (character: Character) => {
    const updatedFavorites = favorites.includes(character.name)
      ? favorites.filter((fav) => fav !== character.name)
      : [...favorites, character.name];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <Box p={4} bgColor="black">
      <Flex alignItems="center" justifyContent="space-between" gap="2px">
        <Box borderRadius="50%" />
        <Box w={{ base: "40%", md: "10%" }}>
          <Image src="/star-wars1.svg" alt="Starwars Logo" w="100%" h="auto" />
        </Box>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="50vh">
          <Spinner size="xl" color="orange" />
        </Flex>
      ) : favoriteCharacters.length > 0 ? (
        <Grid
          templateColumns={{
            base: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          gap={6}
        >
          {favoriteCharacters.map((character) => (
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
                  w="100%"
                />
                <Text
                  mt={2}
                  fontWeight="bold"
                  color={"orange"}
                  w="100%"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {character.name}
                </Text>
              </Link>
              <Flex
                gap="2px"
                alignItems="center"
                justifyContent="center"
                mt={2}
              >
                <Button
                  onClick={() => toggleFavorite(character)}
                  fontSize={{ base: "10px", md: "14px", sm: "10px" }}
                  width="100%"
                >
                  {favorites.includes(character.name)
                    ? "Remove from Favorite"
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
      ) : (
        <Flex justifyContent="center" alignItems="center" height="50vh">
          <Text fontSize="xl" color="white">
            No favorites added
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default Favorites;
