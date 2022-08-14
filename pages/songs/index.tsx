import type { NextPage } from "next";
import Container from "../../components/container";
import { Musics } from "../../components/musics";

const Songs: NextPage = () => {
  return (
    <Container title="Musics">
      <Musics />
    </Container>
  );
};

export default Songs;
