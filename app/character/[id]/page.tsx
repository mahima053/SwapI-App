"use client"; // Add this line at the top
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Text, List, ListItem, Image, Flex } from "@chakra-ui/react";
import { getCharacterImage } from "@/app/page";

interface CharacterDetail {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  films: string[];
  url: any;
}

interface Film {
  title: string;
  url: string;
}

const CharacterDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [films, setFilms] = useState<Film[]>([]);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (id) {
        const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
        setCharacter(response.data);
        const filmRequests = response.data.films.map((url: string) =>
          axios.get(url)
        );
        console.log(response, "response");
        console.log(filmRequests, "filmRequestsresponse");

        const filmResponses = await Promise.all(filmRequests);
        setFilms(filmResponses.map((res) => res.data));
        console.log(filmResponses, "filmResponsesresponse");
      }
    };
    fetchCharacter();
  }, [id]);

  if (!character) return <Box>Loading...</Box>;

  return (
    <Flex
      p={10}
      bg="black"
      alignItems="center"
      justifyContent={"center"}
      flexDirection="column"
      gap="20px"
    >
      <Box>
        <Image src="/star-wars1.svg" alt="Starwars Logo" w="100px" h="100px" />
      </Box>
      <Flex bg="white">
        <Image
          src={getCharacterImage(character)}
          alt={character.name}
          w="40%"
          h="40%"
        />
        <Box pl="40px" pt="20px">
          <Text fontSize="20px" fontWeight="bold">
            {character.name}
          </Text>
          <Flex alignItems={"center"} alignContent={"center"} mt={2} gap="5px">
            <Text fontWeight={"400px"}>Height:</Text>
            <Text color="gray">{character.height}</Text>
          </Flex>
          <Flex alignItems={"center"} alignContent={"center"} mt={2} gap="5px">
            <Text fontWeight={"400px"}>Mass:</Text>
            <Text color="gray">{character.mass}</Text>
          </Flex>
          <Flex alignItems={"center"} alignContent={"center"} mt={2} gap="5px">
            <Text fontWeight={"400px"}>Hair Color:</Text>
            <Text color="gray">{character.hair_color}</Text>
          </Flex>
          <Flex alignItems={"center"} alignContent={"center"} mt={2} gap="5px">
            <Text fontWeight={"400px"}>Skin Color:</Text>
            <Text color="gray">{character.skin_color}</Text>
          </Flex>
          <Flex alignItems={"center"} alignContent={"center"} mt={2} gap="5px">
            <Text fontWeight={"400px"}>Eye Color:</Text>
            <Text color="gray">{character.eye_color}</Text>
          </Flex>
          <Flex alignItems={"center"} alignContent={"center"} mt={2} gap="5px">
            <Text fontWeight={"400px"}>Birth Year:</Text>
            <Text color="gray">{character.birth_year}</Text>
          </Flex>
          <Flex alignItems={"center"} alignContent={"center"} mt={2} gap="5px">
            <Text fontWeight={"400px"}>Gender:</Text>
            <Text color="gray">{character.gender}</Text>
          </Flex>
        </Box>
      </Flex>

      <Box
        bgColor="gray.700"
        p="20px"
        w="30%"
        borderRadius="12px"
        boxShadow="md"
      >
        <Text
          mt={4}
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          color="white"
        >
          Movies
        </Text>
        <List spacing={3} mt={4} alignItems="center" color="gray.200">
          {films.map((film) => (
            <ListItem
              key={film.url}
              p="10px"
              borderRadius="8px"
              bgColor="gray.600"
              _hover={{ bgColor: "gray.500" }}
            >
              {film.title}
            </ListItem>
          ))}
        </List>
      </Box>
    </Flex>
  );
};

export default CharacterDetail;
