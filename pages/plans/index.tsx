import type { NextPage } from "next";
import Container from "../../components/container";
import { PlansC } from "../../components/plans";

const Plans: NextPage = () => {
  return (
    <Container title="Plans">
      <PlansC />
    </Container>
  );
};

export default Plans;
