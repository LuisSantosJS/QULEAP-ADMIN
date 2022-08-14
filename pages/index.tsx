import type { NextPage } from "next";
import Container from "../components/container";
import { Musics } from "../components/musics";

const Home: NextPage = () => {

  return (
    <Container title="Musics">
      <Musics />
    </Container>
  );
};

export default Home;
