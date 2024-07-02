export const getCharacterImage = (character: any) => {
    const id = character.url.split("/")[5];
    return `/img/people/${id}.jpg`;
  };
